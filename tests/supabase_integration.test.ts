/**
 * FLUVIA FLOW — SUPABASE INTEGRATION TEST SUITE
 * Validates Supabase clients, dual-mode auth adapter, session management,
 * RLS schema, profile synchronization, and billing preservation.
 */

import fs from 'fs';
import path from 'path';
import { isSupabaseConfigured, getSupabaseUrl } from '../src/lib/supabase/config';
import { getSupabaseBrowserClient } from '../src/lib/supabase/client';
import { dbStore, hashPassword } from '../src/lib/db/store';
import { createSignedSessionToken, parseSignedSessionToken, createSignedVaultToken, parseSignedVaultToken } from '../src/lib/auth/session';
import { isSupabaseAuthEnabled } from '../src/lib/auth/supabaseAuth';

function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING FLUVIA FLOW SUPABASE INTEGRATION TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(desc: string, condition: boolean, extra?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`, extra ? extra : '');
      failed++;
    }
  }

  // 1. Config & Validation Tests
  console.log('1. Testing Supabase Config & Validation...');
  assert('isSupabaseConfigured() returns boolean without crashing', typeof isSupabaseConfigured() === 'boolean');
  assert('Placeholder credentials are not recognized as configured', !isSupabaseConfigured() || getSupabaseUrl().startsWith('https://'));
  assert('isSupabaseAuthEnabled() reflects configuration state', isSupabaseAuthEnabled() === isSupabaseConfigured());

  // 2. Client Resilience Tests
  console.log('\n2. Testing Client Initializers...');
  const browserClient = getSupabaseBrowserClient();
  if (!isSupabaseConfigured()) {
    assert('Browser client returns null gracefully when unconfigured', browserClient === null);
  } else {
    assert('Browser client returns instance when configured', browserClient !== null);
  }

  // 3. PostgreSQL Schema & RLS Policy Verification
  console.log('\n3. Testing SQL Migration Schema...');
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20261023_fluvia_flow_schema.sql');
  assert('Migration file exists', fs.existsSync(migrationPath));
  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert('Schema creates profiles table', sql.includes('create table if not exists public.profiles'));
  assert('Schema creates workspaces table', sql.includes('create table if not exists public.workspaces'));
  assert('Schema creates credit_accounts table', sql.includes('create table if not exists public.credit_accounts'));
  assert('Schema creates credit_ledger table', sql.includes('create table if not exists public.credit_ledger'));
  assert('Schema includes handle_new_user trigger function', sql.includes('create or replace function public.handle_new_user()'));
  assert('Schema enables Row Level Security on profiles', sql.includes('alter table public.profiles enable row level security;'));
  assert('Schema protects credit_accounts with read-only client policy', sql.includes('create policy "Users can read own credit balance"'));
  assert('Schema protects payu_orders with strict user isolation', sql.includes('create policy "Users can view own payment orders"'));

  // 4. Session & Dual-Mode Token Testing
  console.log('\n4. Testing Session Token Signing & HMAC Verification...');
  const testSession = {
    userId: 'usr_test_supabase_123',
    email: 'creator_test@fluvia.io',
    role: 'creator' as const,
    workspaceId: 'ws_test_supabase_123',
  };
  const token = createSignedSessionToken(testSession);
  assert('Token is generated as two-part signature', token.includes('.'));
  const parsed = parseSignedSessionToken(token);
  assert('Parsed token accurately matches original payload', parsed?.userId === testSession.userId && parsed?.email === testSession.email);

  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedParsed = parseSignedSessionToken(tamperedToken);
  assert('Tampered session token signature is rejected', tamperedParsed === null);

  // 5. Database Profile & Credit Account Synchronization
  console.log('\n5. Testing Profile Synchronization...');
  const testSupabaseUid = 'e82b7f02-a1b2-4c3d-8e9f-' + Math.random().toString(36).substring(2, 14);
  const testEmail = `creator_${Date.now()}@fluviaflow.ai`;
  const synced = dbStore.syncSupabaseProfile({
    userId: testSupabaseUid,
    email: testEmail,
    displayName: 'Supabase Creator',
    avatarUrl: 'https://fluvia.io/avatar.png',
  });

  assert('Profile created with exact Supabase UUID', synced.profile.id === testSupabaseUid);
  assert('Workspace created and linked to owner', synced.workspace.ownerId === testSupabaseUid);
  const creditAccount = dbStore.getCreditAccount(testSupabaseUid);
  assert('Synchronized user automatically receives 100 free credits', creditAccount.availableBalance === 100);

  // 6. Billing & PayU Preservation Tests
  console.log('\n6. Testing Billing & No-GST Document Preservation...');
  const pdfGenPath = path.resolve(process.cwd(), 'src/lib/documents/pdfGenerator.ts');
  const pdfGenContent = fs.readFileSync(pdfGenPath, 'utf8');
  assert('PDF Generator contains NO mentions of GST', !pdfGenContent.includes('GST') && !pdfGenContent.includes('Tax (18% GST)'));
  
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  assert('.env.example documents Supabase URL, Anon Key, and Service Role Key', 
    envExampleContent.includes('NEXT_PUBLIC_SUPABASE_URL') &&
    envExampleContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') &&
    envExampleContent.includes('SUPABASE_SERVICE_ROLE_KEY')
  );

  // 7. Ephemeral Instance & Vault Rehydration Tests
  console.log('\n7. Testing Vault Token Signing & Rehydration Resilience...');
  const vaultUser = {
    userId: 'usr_vault_' + Math.random().toString(36).substring(2, 10),
    email: `vault_user_${Date.now()}@fluviaflow.ai`,
    displayName: 'Vault Resilient Artist',
    role: 'creator' as const,
    passwordHash: hashPassword('VaultPass123!'),
  };

  const vaultToken = createSignedVaultToken(vaultUser);
  assert('Vault token is generated as signed two-part token', typeof vaultToken === 'string' && vaultToken.includes('.'));
  
  const parsedVault = parseSignedVaultToken(vaultToken);
  assert('Vault token parsed successfully', parsedVault !== null && parsedVault.email === vaultUser.email);

  const rehydrated = dbStore.rehydrateFromVault(vaultUser);
  assert('User successfully rehydrated into dbStore', rehydrated.profile.id === vaultUser.userId);
  assert('Rehydrated user password verifies accurately', dbStore.verifyPassword(vaultUser.userId, 'VaultPass123!'));
  assert('Rehydrated user has 100 welcome credits', dbStore.getCreditAccount(vaultUser.userId).availableBalance === 100);

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
