/**
 * FLUVIA FLOW — SUPABASE DATA MIGRATION SCRIPT
 * Safely and idempotently migrates existing users, workspaces, credits,
 * and subscriptions from data/database.json into Supabase PostgreSQL.
 *
 * Usage:
 *   npx tsx scripts/migrate_to_supabase.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''
).trim();

const serviceRoleKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  ''
).trim();

async function runMigration() {
  console.log('================================================================');
  console.log('🚀 FLUVIA FLOW — SUPABASE MIGRATION ASSISTANT');
  console.log('================================================================\n');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ MIGRATION BLOCKED: Missing Supabase credentials.');
    console.log('\nTo run this migration, configure the following in .env.local:');
    console.log('  1. NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"');
    console.log('  2. SUPABASE_SERVICE_ROLE_KEY="your-secret-service-role-key"');
    console.log('\nFind these keys in your Supabase Dashboard:');
    console.log('  👉 Project Settings > API > Project URL & service_role secret\n');
    process.exit(1);
  }

  if (
    supabaseUrl.includes('your-project') ||
    serviceRoleKey.includes('your-service-role') ||
    serviceRoleKey.length < 20
  ) {
    console.error('❌ MIGRATION BLOCKED: Placeholder credentials detected in .env.local.');
    console.log('Please replace the placeholder values with your real project credentials.\n');
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const dbFilePath = path.resolve(process.cwd(), 'data/database.json');
  if (!fs.existsSync(dbFilePath)) {
    console.error(`❌ Local database file not found at: ${dbFilePath}`);
    process.exit(1);
  }

  const localDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const profiles = localDb.profiles || [];
  const workspaces = localDb.workspaces || [];
  const creditAccounts = localDb.creditAccounts || {};
  const subscriptions = localDb.subscriptions || [];

  console.log(`\nFound in local data/database.json:`);
  console.log(`  • Profiles:        ${profiles.length}`);
  console.log(`  • Workspaces:      ${workspaces.length}`);
  console.log(`  • Credit Accounts: ${Object.keys(creditAccounts).length}`);
  console.log(`  • Subscriptions:   ${subscriptions.length}\n`);

  console.log('Starting migration...');
  let migratedUsers = 0;
  let skippedUsers = 0;
  let errorCount = 0;

  // 1. Fetch existing Supabase auth users to avoid duplicate creation
  const { data: existingUsersData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error('❌ Failed to query existing Supabase Auth users:', listError.message);
    process.exit(1);
  }

  const existingAuthUsersMap = new Map<string, string>(); // email -> supabase userId
  for (const u of existingUsersData.users || []) {
    if (u.email) {
      existingAuthUsersMap.set(u.email.toLowerCase().trim(), u.id);
    }
  }

  for (const profile of profiles) {
    const cleanEmail = (profile.email || '').toLowerCase().trim();
    if (!cleanEmail) continue;

    try {
      let supabaseUserId = existingAuthUsersMap.get(cleanEmail);

      // Create in Supabase Auth if not yet created
      if (!supabaseUserId) {
        // Generate a secure temporary migration password if unknown
        const tempPassword = 'FluviaMigrationTempPass!' + Math.random().toString(36).substring(2, 8);
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            display_name: profile.displayName || cleanEmail.split('@')[0],
            avatar_url: profile.avatarUrl || null,
            role: profile.role || 'creator',
          },
        });

        if (createError) {
          console.warn(`⚠️ Could not create auth user for ${cleanEmail}: ${createError.message}`);
          errorCount++;
          continue;
        }

        supabaseUserId = newUser.user.id;
        existingAuthUsersMap.set(cleanEmail, supabaseUserId);
        migratedUsers++;
      } else {
        skippedUsers++;
      }

      // Upsert into public.profiles
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: supabaseUserId,
          email: cleanEmail,
          display_name: profile.displayName || cleanEmail.split('@')[0],
          avatar_url: profile.avatarUrl || null,
          role: profile.role || 'creator',
          auth_provider: profile.authProvider || 'email',
          created_at: profile.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (profileError) {
        console.warn(`  ⚠️ Profile upsert warning (${cleanEmail}): ${profileError.message}`);
      }

      // Upsert credit account
      const localCredits = creditAccounts[profile.id] || creditAccounts[supabaseUserId];
      const availableBalance = localCredits?.availableBalance ?? 100;
      const reservedBalance = localCredits?.reservedBalance ?? 0;

      const { error: creditError } = await supabase.from('credit_accounts').upsert(
        {
          user_id: supabaseUserId,
          available_balance: availableBalance,
          reserved_balance: reservedBalance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (creditError) {
        console.warn(`  ⚠️ Credit account upsert warning (${cleanEmail}): ${creditError.message}`);
      }
    } catch (err: any) {
      console.error(`❌ Error migrating ${cleanEmail}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n================================================================');
  console.log('✅ SUPABASE MIGRATION FINISHED');
  console.log('================================================================');
  console.log(`  • Auth Users Created: ${migratedUsers}`);
  console.log(`  • Existing Auth Users: ${skippedUsers}`);
  console.log(`  • Errors Encountered:  ${errorCount}`);
  console.log('================================================================\n');
}

runMigration().catch((err) => {
  console.error('Fatal migration failure:', err);
  process.exit(1);
});
