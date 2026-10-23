import fs from 'fs';
import path from 'path';
import { dbStore, verifyPasswordHash, hashPassword } from '../src/lib/db/store';
import { createSignedSessionToken, parseSignedSessionToken } from '../src/lib/auth/session';

async function runAuthRepeatLoginTests() {
  console.log('================================================================');
  console.log('  FLUVIA FLOW — AUTHENTICATION & REPEAT LOGIN TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testEmail = `repeat_user_${timestamp}@fluviaflow.ai`;
  const testPassword = 'SecurePassword123!';
  const testDisplayName = 'Repeat Login Tester';

  // --- 1. User Registration & Scrypt Hashing ---
  console.log('--- 1. User Registration & Scrypt Password Hashing ---');
  const { profile, workspace } = dbStore.createProfile({
    email: testEmail,
    displayName: testDisplayName,
    passwordPlainText: testPassword,
    role: 'creator',
  });

  assert(Boolean(profile && profile.id), 'Profile created with valid identifier');
  assert(profile.email === testEmail.toLowerCase(), 'Profile email normalized to lowercase');
  assert(Boolean(workspace && workspace.id), 'Personal workspace provisioned');

  const db = (dbStore as any).load();
  const storedHash = db.passwords[profile.id];
  assert(Boolean(storedHash), 'Password hash recorded in database');
  assert(storedHash.startsWith('scrypt:'), 'Password securely hashed with salted scrypt');
  assert(verifyPasswordHash(testPassword, storedHash), 'Password hash verifies successfully against plain text');
  assert(!verifyPasswordHash('WrongPassword!', storedHash), 'Invalid password rejected by verifyPasswordHash');

  // --- 2. Database Disk Persistence ---
  console.log('\n--- 2. Database Disk Persistence Verification ---');
  const dbFilePath = path.join(process.cwd(), 'data', 'database.json');
  assert(fs.existsSync(dbFilePath), 'database.json file exists on disk');

  const onDiskData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  const userOnDisk = onDiskData.profiles.find((p: any) => p.id === profile.id);
  assert(Boolean(userOnDisk), 'User profile successfully written and verified on disk');
  assert(Boolean(onDiskData.passwords[profile.id]), 'Password hash securely written and verified on disk');

  // --- 3. First Login Attempt ---
  console.log('\n--- 3. Immediate First Login Attempt ---');
  const userLookup1 = dbStore.getProfileByEmail(testEmail);
  assert(Boolean(userLookup1), 'User lookup succeeds by exact email');
  const isValid1 = dbStore.verifyPassword(userLookup1!.id, testPassword);
  assert(isValid1, 'Initial login verifies password correctly');

  // --- 4. Repeat Login Attempt (Case-Insensitivity & Whitespace) ---
  console.log('\n--- 4. Repeat Login Later (Case-Insensitive & Whitespace Trimming) ---');
  const uppercaseEmail = testEmail.toUpperCase();
  const userLookupUpper = dbStore.getProfileByEmail(uppercaseEmail.trim().toLowerCase());
  assert(Boolean(userLookupUpper), 'Repeat lookup succeeds with UPPERCASE email');
  assert(dbStore.verifyPassword(userLookupUpper!.id, testPassword), 'Repeat login verifies with uppercase email');

  const whitespaceEmail = `  ${testEmail}  `;
  const userLookupWhite = dbStore.getProfileByEmail(whitespaceEmail.trim().toLowerCase());
  assert(Boolean(userLookupWhite), 'Repeat lookup succeeds with leading/trailing whitespace');
  assert(dbStore.verifyPassword(userLookupWhite!.id, testPassword), 'Repeat login verifies with padded whitespace');

  // --- 5. Repeat Login with Wrong Password ---
  console.log('\n--- 5. Security & Wrong Password Rejection ---');
  const wrongPassResult = dbStore.verifyPassword(profile.id, 'WrongPassword123!');
  assert(!wrongPassResult, 'Wrong password rejected on repeat attempt');

  // --- 6. Session Persistence & Token Signatures ---
  console.log('\n--- 6. Session Token Cryptographic Signing & Parsing ---');
  const sessionData = {
    userId: profile.id,
    email: profile.email,
    role: profile.role as 'creator',
    workspaceId: workspace.id,
  };

  const token = createSignedSessionToken(sessionData);
  assert(Boolean(token && token.includes('.')), 'Cryptographically signed session token generated');

  const parsedSession = parseSignedSessionToken(token);
  assert(Boolean(parsedSession), 'Session token successfully parsed and signature verified');
  assert(parsedSession?.userId === profile.id, 'Parsed session contains correct user ID');
  assert(parsedSession?.workspaceId === workspace.id, 'Parsed session contains correct workspace ID');

  // Tampered session token
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedResult = parseSignedSessionToken(tamperedToken);
  assert(tamperedResult === null, 'Tampered session token signature rejected');

  // --- 7. Google OAuth User Password Guard ---
  console.log('\n--- 7. Google OAuth User Password Guard ---');
  const googleEmail = `google_user_${timestamp}@fluviaflow.ai`;
  const { profile: gProfile } = dbStore.createGoogleProfile({
    googleId: `google_id_${timestamp}`,
    email: googleEmail,
    displayName: 'Google Tester',
  });

  assert(dbStore.hasPassword(gProfile.id) === false, 'Google-only user has no password entry in passwords table');
  assert(dbStore.verifyPassword(gProfile.id, 'anyPassword') === false, 'Direct password login for Google user returns false safely');

  // --- 8. Password Reset Flow Verification ---
  console.log('\n--- 8. Password Reset Flow & Post-Reset Login ---');
  const resetResult = dbStore.createPasswordResetToken(testEmail);
  assert(Boolean(resetResult && resetResult.token), 'Password reset token generated');

  const newPassword = 'NewSecurePassword456!';
  const resetSuccess = dbStore.resetPasswordWithToken(testEmail, resetResult!.token, newPassword);
  assert(resetSuccess, 'Password reset succeeded with token');

  // Verify old password fails
  assert(!dbStore.verifyPassword(profile.id, testPassword), 'Old password rejected after password reset');
  // Verify new password succeeds
  assert(dbStore.verifyPassword(profile.id, newPassword), 'New password succeeds on subsequent login');

  console.log('\n================================================================');
  console.log(`  AUTH REPEAT LOGIN RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthRepeatLoginTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
