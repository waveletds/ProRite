# Security Specifications & Hardened Rules TDD

This specification documents the security invariants, payload rules, and test validations designed to protect the ProRite platform resources.

## 1. Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - A user's profile can only be read, created, or changed by the authenticated owner (`request.auth.uid == userId`).
   - The user cannot elevate their subscription tier or artificial wallet balances except through payment triggers verify calculations (handled through trusted transactions or server integration; mock front-end changes cannot bypass database constraint checks).

2. **Projects (`/users/{userId}/projects/{projectId}`)**:
   - A research project belongs strictly to the authenticated user path, and cannot be read, updated, or listed by anyone else.
   - Project titles and IDs must match standard word size bounds to prevent Denial of Wallet memory/indexing exploitation.

---

## 2. The Dirty Dozen Payloads

Below represent 12 adversarial payloads designed to test rules against Identity spoofing, state shortcuts, and resource poisoning:

1. **ID POISONING**: Attempting to inject a huge 10KB junk-character string as a project ID.
2. **PRIVILEGE ESCALATION**: An unauthenticated user attempting to modify `/users/someUser` to set `plan` to `Researcher` or write a custom `walletBalance`.
3. **EMAIL SPOOFING**: Registering with a non-verified email or spoofing another user's email metadata.
4. **BLANKET SNOOPING**: Requesting to view all user credentials or academic drafts using unbounded queries.
5. **GHOST FIELD INJECTION**: Trying to append unexpected properties like `isVerifiedDeveloper: true` while writing profiles.
6. **TEMPORAL INCONSISTENCY**: Submitting a document backdated by three years, avoiding standard database time validations.
7. **FOREIGN VALUE POISONING**: Attempting to write a 1MB boolean array into the project style formats.
8. **ORPHANED WRITE**: Trying to save deep chapter data under a non-existent user identifier path.
9. **STATE SHORTCUT**: Submitting a status upgrade directly into completed parameters without matching payment gateways keys.
10. **SELF-ASSIGNED COLLABORATOR**: Attempting to insert a user ID flag without being the authorized owner.
11. **IMMUTABLE RECORD CLOBBERING**: Attempting to modify `createdAt` variables inside saved outlines.
12. **CROSS-USER DELETION**: Authenticating as student A and attempting to execute `deleteDoc` on student B's chapters.

---

## 3. Test Rules Architecture

These conditions are hard-validated on rules ingestion using explicit attribute constraints and type checks.
All of the Twelve dirty payloads must be checked and rejected by our Firestore Security rules.
