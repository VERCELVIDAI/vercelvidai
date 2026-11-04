"use server";

import { cookies } from "next/headers";

import { getModel, parseSettings } from "./catalog";
import type { GenerationPlane } from "./catalog/types";
import {
  MissingCredentialsError,
  PLATFORM_KEY_COOKIE,
  PLATFORM_KEY_COOKIE_OPTIONS,
  decodeCredentials,
  encodeCredentials,
  parseCredentialInput,
} from "./credentials";
import { createPlatformClient } from "./platform";
import type { StatusResult } from "./platform";
import { toPlatform } from "./to-platform";
import {
  isFreeRequestId,
  submitFreeGeneration,
  getFreeGenerationStatus,
} from "./free-engine";

export async function savePlatformCredentials(data: unknown) {
  const { apiKey } = parseCredentialInput(data);
  const jar = cookies();
  jar.set(PLATFORM_KEY_COOKIE, encodeCredentials(apiKey), PLATFORM_KEY_COOKIE_OPTIONS);
}

export async function clearPlatformCredentials() {
  const jar = cookies();
  jar.set(PLATFORM_KEY_COOKIE, "", { ...PLATFORM_KEY_COOKIE_OPTIONS, maxAge: 0 });
}

export async function hasRealPlatformCredentials(): Promise<boolean> {
  const stored = await readStoredCredentials();
  if (stored !== null) return true;
  const envKey = (process.env.HIGGSFIELD_API_KEY || process.env.HF_API_KEY)?.trim();
  return Boolean(envKey && envKey.includes(":"));
}

export async function hasPlatformCredentials(): Promise<boolean> {
  // Always true because Free Mode is natively built-in!
  return true;
}

export async function getCredentialsStatus(): Promise<{ configured: boolean; isFreeMode: boolean }> {
  const hasReal = await hasRealPlatformCredentials();
  return {
    configured: hasReal,
    isFreeMode: !hasReal,
  };
}

export async function submitGeneration(plane: GenerationPlane) {
  const hasReal = await hasRealPlatformCredentials();

  if (hasReal) {
    try {
      const model = getModel(plane.model);
      const parsed: GenerationPlane = {
        ...plane,
        settings: parseSettings(model, plane.settings),
      };
      const { path, body } = toPlatform(parsed);
      return await createPlatformClient(await readCredentials()).submit(path, body);
    } catch (err) {
      console.warn("[OpenHiggs] Platform API failed, falling back to Free Engine:", err);
      return submitFreeGeneration(plane);
    }
  }

  // 100% Free AI Engine Mode (No Key Required)
  return submitFreeGeneration(plane);
}

/** Every request in flight, answered in one round trip. Next dispatches server
    actions one at a time per client, so a poll per run would queue ahead of the
    next submit — the fan-out belongs on this side of the call, where it is
    genuinely parallel. */
export async function getGenerationStatuses(data: unknown): Promise<StatusResult[]> {
  const requestIds = parseRequestIds(data);
  const freeIds = requestIds.filter(isFreeRequestId);
  const platformIds = requestIds.filter((id) => !isFreeRequestId(id));

  const results: StatusResult[] = [];

  // 1. Process Free Generation Jobs
  for (const id of freeIds) {
    const status = getFreeGenerationStatus(id);
    if (status) {
      results.push({ requestId: id, status });
    } else {
      results.push({
        requestId: id,
        status: { status: "processing", requestId: id },
      });
    }
  }

  // 2. Process Platform API Jobs (if any)
  if (platformIds.length > 0) {
    try {
      const client = createPlatformClient(await readCredentials());
      const platformResults = await Promise.all(
        platformIds.map(async (requestId): Promise<StatusResult> => {
          try {
            return { requestId, status: await client.status(requestId) };
          } catch (caught) {
            return { requestId, error: caught instanceof Error ? caught.message : String(caught) };
          }
        }),
      );
      results.push(...platformResults);
    } catch (err) {
      for (const id of platformIds) {
        results.push({ requestId: id, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  return results;
}

async function readStoredCredentials() {
  const jar = cookies();
  return decodeCredentials(jar.get(PLATFORM_KEY_COOKIE)?.value);
}

async function readCredentials() {
  const stored = await readStoredCredentials();
  const baseUrl = process.env.HF_API_BASE_URL || "https://api.higgsfield.ai";
  if (stored) {
    return { ...stored, baseUrl };
  }

  // Fallback to server-side configured master key if available
  const envKey = (process.env.HIGGSFIELD_API_KEY || process.env.HF_API_KEY)?.trim();
  if (envKey && envKey.includes(":")) {
    return { apiKey: envKey, baseUrl };
  }

  throw new MissingCredentialsError();
}

function parseRequestIds(data: unknown): string[] {
  const payload = asObject(data, "Invalid status payload");
  const requestIds = payload.requestIds;
  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    throw new Error("Invalid request ids");
  }
  return requestIds.map((requestId) => {
    if (typeof requestId !== "string" || !requestId) throw new Error("Invalid request id");
    return requestId;
  });
}

function asObject(data: unknown, message: string): Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data)) throw new Error(message);
  return data as Record<string, unknown>;
}
