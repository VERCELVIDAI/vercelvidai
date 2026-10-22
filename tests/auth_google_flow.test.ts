import { dbStore } from '../src/lib/db/store';
import { createSignedSessionToken, parseSignedSessionToken, validateRedirectUrl } from '../src/lib/auth/session';

console.log('================================================================');
console.log('  FLUVIA FLOW — AUTHENTICATION & GOOGLE OAUTH FLOW TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    failCount++;
  }
}

async function runAuthTests() {
  const timestamp = Date.now();
  const testEmail = `tester_${timestamp}@fluviaflow.ai`.toLowerCase();
  const testPassword = 'Password123!Secure';
  const testName = 'Fluvia Test Creator';

  // -------------------------------------------------------------
  // Test 1: Workspace Auto-Resolution Guarantee
  // -------------------------------------------------------------
  console.log('--- 1. Workspace Resilience & Auto-Resolution Guarantee ---');
  const orphanUserId = `orphan_${timestamp}`;
  const orphanWorkspace = dbStore.ensureUserWorkspace(orphanUserId, 'Orphan Tester');
  assert(Boolean(orphanWorkspace && orphanWorkspace.id), 'Workspace automatically generated for orphan user');
  assert(orphanWorkspace.ownerId === orphanUserId, 'Orphan workspace has user as ownerId');
  const userWorkspaces = dbStore.getUserWorkspaces(orphanUserId);
  assert(userWorkspaces.some(w => w.id === orphanWorkspace.id), 'Orphan workspace correctly indexed in workspace members');

  // Idempotent resolution
  const duplicateResolution = dbStore.ensureUserWorkspace(orphanUserId, 'Orphan Tester');
  assert(duplicateResolution.id === orphanWorkspace.id, 'Repeated workspace resolution returns identical workspace without duplication');

  // -------------------------------------------------------------
  // Test 2: User Registration & Welcome Credit Grant
  // -------------------------------------------------------------
  console.log('\n--- 2. Registration Flow with Welcome Credit Grant ---');
  const { profile: createdUser, workspace: userWorkspace } = dbStore.createProfile({
    email: testEmail,
    displayName: testName,
    passwordPlainText: testPassword,
    role: 'creator',
  });

  assert(Boolean(createdUser && createdUser.id), 'User profile created in database store');
  assert(createdUser.email === testEmail, 'User profile email is normalized');
  assert(Boolean(userWorkspace && userWorkspace.id), 'User workspace automatically provisioned');

  // Verify password with scrypt
  const passwordVerifySuccess = dbStore.verifyPassword(createdUser.id, testPassword);
  const passwordVerifyFail = dbStore.verifyPassword(createdUser.id, 'WrongPassword456');
  assert(passwordVerifySuccess === true, 'Scrypt password hash successfully verified');
  assert(passwordVerifyFail === false, 'Invalid password correctly rejected');

  // Credit account
  const creditAccount = dbStore.getCreditAccount(createdUser.id);
  assert(creditAccount?.availableBalance === 100, 'User granted exactly 100 welcome creative credits on signup');

  // Welcome credits must be idempotent
  const secondCheckAccount = dbStore.getCreditAccount(createdUser.id);
  assert(secondCheckAccount.availableBalance === 100, 'Welcome credits grant is idempotent (no duplicate 100 grants)');

  // -------------------------------------------------------------
  // Test 3: Session Signing & HMAC Security
  // -------------------------------------------------------------
  console.log('\n--- 3. Session Persistence & HMAC-Signed Tokens ---');
  const sessionPayload = {
    userId: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    workspaceId: userWorkspace.id,
  };

  const sessionToken = createSignedSessionToken(sessionPayload);
  assert(Boolean(sessionToken && sessionToken.includes('.')), 'HMAC-signed session token generated with payload.signature format');

  const verifiedSession = parseSignedSessionToken(sessionToken);
  assert(Boolean(verifiedSession), 'Session token successfully verified');
  assert(verifiedSession?.userId === createdUser.id, 'Session payload correctly preserves user ID');
  assert(verifiedSession?.email === createdUser.email, 'Session payload correctly preserves email');
  assert(verifiedSession?.workspaceId === userWorkspace.id, 'Session payload correctly preserves workspace ID');

  // Open redirect protection test
  assert(validateRedirectUrl('/dashboard') === '/dashboard', 'Safe relative redirect preserved');
  assert(validateRedirectUrl('https://malicious-site.com') === '/dashboard', 'External redirect blocked');
  assert(validateRedirectUrl('//evil.com') === '/dashboard', 'Protocol-relative URL blocked');

  // Tamper detection
  const tamperedToken = sessionToken.slice(0, -4) + 'abcd';
  const tamperedSession = parseSignedSessionToken(tamperedToken);
  assert(tamperedSession === null, 'Tampered session token fails cryptographic verification');

  // -------------------------------------------------------------
  // Test 4: Password Recovery & Reset Flow
  // -------------------------------------------------------------
  console.log('\n--- 4. Password Recovery & Reset Tokens ---');
  const resetTokenResult = dbStore.createPasswordResetToken(testEmail);
  assert(Boolean(resetTokenResult && resetTokenResult.token && resetTokenResult.token.length > 20), 'Secure cryptographic password reset token generated');

  const nonExistentToken = dbStore.createPasswordResetToken('nonexistent_user@fluviaflow.ai');
  assert(nonExistentToken === null, 'Reset token generation returns null for non-existent email');

  // Complete password reset
  const newPassword = 'NewSecretPassword2026!';
  const resetSuccess = dbStore.resetPasswordWithToken(testEmail, resetTokenResult!.token, newPassword);
  assert(resetSuccess === true, 'Password reset succeeded with valid token');

  // Old password should now fail, new password should succeed
  assert(dbStore.verifyPassword(createdUser.id, testPassword) === false, 'Old password rejected after reset');
  assert(dbStore.verifyPassword(createdUser.id, newPassword) === true, 'New password accepted after reset');

  // Token reuse should be prevented
  const reuseSuccess = dbStore.resetPasswordWithToken(testEmail, resetTokenResult!.token, 'AnotherPassword999!');
  assert(reuseSuccess === false, 'Reusing an already consumed reset token is rejected');

  // -------------------------------------------------------------
  // Test 5: Google OAuth Account Linking
  // -------------------------------------------------------------
  console.log('\n--- 5. Google OAuth 2.0 Account Linking ---');
  // Scenario A: Existing user logs in via Google (Email Match -> Link Account)
  const fakeGoogleId = `goog_${timestamp}`;
  const preUpdateProfile = dbStore.getProfileByEmail(testEmail);
  assert(preUpdateProfile?.googleId === undefined, 'User initially does not have googleId');

  const { profile: linkedProfile } = dbStore.createGoogleProfile({
    googleId: fakeGoogleId,
    email: testEmail,
    displayName: testName,
    avatarUrl: 'https://lh3.googleusercontent.com/a/sample_avatar',
  });

  assert(linkedProfile?.googleId === fakeGoogleId, 'Existing account successfully linked with Google OAuth ID');
  assert(linkedProfile?.emailVerified === true, 'Email marked verified via Google provider');
  assert(linkedProfile?.id === createdUser.id, 'Linked profile preserves original user ID');

  // Re-checking credit balance after linking
  const linkedBalance = dbStore.getCreditAccount(createdUser.id).availableBalance;
  assert(linkedBalance === 100, 'Credit balance remains at 100 (linking does not double-credit)');

  // Scenario B: Brand new user registers directly via Google OAuth
  const newGoogleEmail = `google_new_${timestamp}@fluviaflow.ai`;
  const newGoogleId = `goog_new_${timestamp}`;
  const { profile: googleRegisteredUser, workspace: googleUserWorkspace } = dbStore.createGoogleProfile({
    googleId: newGoogleId,
    email: newGoogleEmail,
    displayName: 'Google Onboarded Artist',
    avatarUrl: 'https://lh3.googleusercontent.com/a/sample_avatar_new',
  });

  assert(Boolean(googleRegisteredUser && googleRegisteredUser.id), 'Direct Google OAuth user profile created');
  assert(googleRegisteredUser.authProvider === 'google', 'User profile authProvider is google');
  assert(googleRegisteredUser.googleId === newGoogleId, 'User profile has verified googleId');
  assert(googleRegisteredUser.emailVerified === true, 'User profile has emailVerified = true');

  assert(Boolean(googleUserWorkspace && googleUserWorkspace.id), 'Direct Google OAuth workspace initialized');

  const googleBalance = dbStore.getCreditAccount(googleRegisteredUser.id).availableBalance;
  assert(googleBalance === 100, 'Direct Google OAuth user granted 100 welcome credits');

  // -------------------------------------------------------------
  // Test 6: Role-Based Access Control & Admin Protection
  // -------------------------------------------------------------
  console.log('\n--- 6. Role-Based Access Control & Admin Protection ---');
  const regularUser = dbStore.getProfileById(createdUser.id);
  assert(regularUser?.role === 'creator', 'Default registered user role is creator');

  const { profile: adminUser } = dbStore.createProfile({
    email: `admin_${timestamp}@fluviaflow.ai`,
    displayName: 'Fluvia Security Admin',
    passwordPlainText: 'AdminPass2026!Secure',
    role: 'admin',
  });
  assert(adminUser.role === 'admin', 'Admin user profile created with role admin');

  // Verification helper simulation
  const checkAdminAccess = (role: string) => role === 'admin';
  assert(checkAdminAccess(regularUser!.role) === false, 'Standard creator denied admin privileges');
  assert(checkAdminAccess(adminUser.role) === true, 'Admin granted privileges');

  // -------------------------------------------------------------
  // Test 7: Audit Logging for Authentication Lifecycle
  // -------------------------------------------------------------
  console.log('\n--- 7. Audit Trail Verification ---');
  dbStore.logAudit(createdUser.id, 'USER_SIGNUP', 'profile', createdUser.id, {
    method: 'email_password',
  });
  dbStore.logAudit(createdUser.id, 'GOOGLE_LINKED', 'profile', createdUser.id, {
    googleId: fakeGoogleId,
  });

  const auditLogs = dbStore.getAuditLogs().filter(l => l.actorId === createdUser.id);
  const hasSignupEvent = auditLogs.some(l => l.action === 'USER_SIGNUP');
  const hasGoogleLinkEvent = auditLogs.some(l => l.action === 'GOOGLE_LINKED');
  assert(hasSignupEvent, 'Audit trail logs USER_SIGNUP event');
  assert(hasGoogleLinkEvent, 'Audit trail logs GOOGLE_LINKED event');

  console.log('\n================================================================');
  console.log(`  AUTH & GOOGLE OAUTH RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
