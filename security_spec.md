# Security Specification for MandiMitra Firestore

## 1. Data Invariants
1. **User Profile Ownership**: A user profile document `/users/{userId}` can only be read or written by the authenticated user whose `request.auth.uid == userId`.
2. **Subcollection Relational Integrity**: Watchlist entries `/users/{userId}/watchlist/{cropId}` and Sales logs `/users/{userId}/sales/{saleId}` can only be accessed and mutated by the owning user (`request.auth.uid == userId`).
3. **Identity Spoofing Guard**: The incoming data's `userId` field (or `authorId`) must strictly equal `request.auth.uid`.
4. **Community Tips Author Integrity**: A community tip `/communityTips/{tipId}` can only be authored by an authenticated farmer with matching `authorId == request.auth.uid`. All visitors and farmers can read or list community tips (`allow get, list: if true;`).
5. **Community Tips Modification**: Only the original author can edit or delete their own tip, and upvote counters can only be incremented.
6. **Immortal Fields**: Fields such as `id`, `authorId`, `userId`, and `createdAt` cannot be altered after creation.
7. **Size Limits & Boundary Defense**: String lengths for crop names, mandis, and tip texts are constrained to prevent denial-of-wallet and database bloat attacks.
8. **Catch-All Default Deny**: Any unmatched document path is strictly denied.

## 2. The "Dirty Dozen" Attack Payloads (Expected to Fail / Return PERMISSION_DENIED)

1. **Unauthenticated Profile Read**:
   - Path: `/users/victimUser123`
   - Auth: Unauthenticated (`null`)
   - Operation: `get`
   - Expected: `PERMISSION_DENIED`

2. **Cross-User Profile Hijack (Create)**:
   - Path: `/users/victimUser123`
   - Auth: `attackerUser999`
   - Payload: `{"id": "victimUser123", "email": "victim@farm.in", "state": "punjab", "language": "pa", "updatedAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED`

3. **Cross-User Profile Update**:
   - Path: `/users/victimUser123`
   - Auth: `attackerUser999`
   - Payload: `{"state": "hacked_state"}`
   - Expected: `PERMISSION_DENIED`

4. **Watchlist Write to Another Farmer's Account**:
   - Path: `/users/victimUser123/watchlist/wheat`
   - Auth: `attackerUser999`
   - Payload: `{"id": "wheat", "cropId": "wheat", "cropName": "Wheat", "userId": "victimUser123", "updatedAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED`

5. **Sales Record Identity Spoofing (Owner mismatch in body)**:
   - Path: `/users/attackerUser999/sales/sale001`
   - Auth: `attackerUser999`
   - Payload: `{"id": "sale001", "userId": "victimUser123", "cropId": "wheat", "cropName": "Wheat", "mandiName": "Karnal", "quantityQuintals": 50, "ratePerQuintal": 2400, "saleDate": "2026-09-03", "createdAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED` (userId inside payload must match auth.uid)

6. **Sales Record Oversized Denial-of-Wallet Payload**:
   - Path: `/users/attackerUser999/sales/sale002`
   - Auth: `attackerUser999`
   - Payload: `{"id": "sale002", "userId": "attackerUser999", "cropId": "wheat", "cropName": "A".repeat(1000), "mandiName": "Mandi", "quantityQuintals": 10, "ratePerQuintal": 2200, "saleDate": "2026-09-03", "createdAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED` (cropName exceeds 100 char limit)

7. **Negative Quantity / Rate Injection in Sales**:
   - Path: `/users/attackerUser999/sales/sale003`
   - Auth: `attackerUser999`
   - Payload: `{"id": "sale003", "userId": "attackerUser999", "cropId": "cotton", "cropName": "Cotton", "mandiName": "Rajkot", "quantityQuintals": -50, "ratePerQuintal": -3000, "saleDate": "2026-09-03", "createdAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED` (numeric values must be non-negative)

8. **Community Tip Auth Spoofing (authorId is someone else)**:
   - Path: `/communityTips/tip001`
   - Auth: `attackerUser999`
   - Payload: `{"id": "tip001", "authorId": "legitFarmer456", "authorName": "Ramesh", "cropName": "Soybean", "tipText": "Sell now", "createdAt": "2026-09-03T12:00:00Z"}`
   - Expected: `PERMISSION_DENIED`

9. **Community Tip Cross-Author Deletion**:
   - Path: `/communityTips/tipCreatedByFarmerA`
   - Auth: `attackerUser999`
   - Operation: `delete`
   - Expected: `PERMISSION_DENIED`

10. **Community Tip Modifying Author Field on Update**:
    - Path: `/communityTips/tip001`
    - Auth: `originalAuthor123`
    - Payload: `{"authorId": "newAuthor456"}`
    - Expected: `PERMISSION_DENIED` (authorId is immutable)

11. **Malicious Path Variable ID Poisoning**:
    - Path: `/users/attackerUser999/sales/../../poison`
    - Auth: `attackerUser999`
    - Expected: `PERMISSION_DENIED` (IDs must match regex '^[a-zA-Z0-9_\\-]+$' and length <= 128)

12. **Catch-All Root Access Attack**:
    - Path: `/unknown_internal_system_collection/leak`
    - Auth: Any / Unauthenticated
    - Operation: `get` / `create`
    - Expected: `PERMISSION_DENIED`
