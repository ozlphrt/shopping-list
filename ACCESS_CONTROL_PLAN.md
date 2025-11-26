# Access Control Plan

## Requirements

### Scenarios:
1. **Person A owns List X** (not shared) → Only A sees X
2. **Person A owns List Y** (shared with B, C) → A, B, C see Y
3. **Person B owns List Z** (shared with A, C) → A, B, C see Z

### Expected Results:
- **Person A** sees: X (owner), Y (owner), Z (shared)
- **Person B** sees: Y (shared), Z (owner)
- **Person C** sees: Y (shared), Z (shared)

## Current Implementation Status

### ✅ What's Working:
1. **List Queries** (`useLists.ts`):
   - Queries lists where `ownerId == userId` (owned lists) ✓
   - Queries lists where `sharedWith` array-contains user email (shared lists) ✓
   - Combines and deduplicates results ✓
   - **This correctly implements the requirements!**

2. **Item Queries** (`useItems.ts`):
   - Queries all items by `listId` only (not filtered by userId) ✓
   - All users on a shared list see all items ✓
   - **This is correct for collaboration!**

### ⚠️ Security Issues to Fix:

1. **Firestore Security Rules** (`firestore.rules`):
   - Currently allows any authenticated user to read any list
   - Currently allows any authenticated user to read/write any item
   - **Need to add proper access checks**

2. **Item Access Validation**:
   - Items should only be readable/writable by users who have access to the list
   - Need to validate list access when reading/writing items

## Implementation Plan

### Phase 1: Verify Current Logic ✅
- [x] List queries correctly fetch owned + shared lists
- [x] Item queries correctly fetch all items for a list
- [x] Sharing functionality works (owner can add emails to `sharedWith`)

### Phase 2: Security Rules (Needs Work)

**Challenge**: Firestore security rules can't easily:
- Check if an email is in an array (`sharedWith`)
- Do subqueries to check list access when reading items

**Options**:

#### Option A: Client-Side Validation Only (Current)
- ✅ Simple to implement
- ✅ Queries already filter correctly
- ❌ Not secure - users could bypass with direct API calls
- ❌ Rules allow access to any list/item

#### Option B: Server-Side Validation with Helper Functions
- Use Firestore rules helper functions
- Check list access before allowing item read/write
- More secure but complex

#### Option C: Denormalize Access Data
- Store `allowedUserIds` array in each item
- Update when list sharing changes
- More data but simpler rules

**Recommendation**: Option B with simplified rules

### Phase 3: Security Rules Implementation

```javascript
rules_version = '2';
service cloud.firestore {
  // Helper to check if user has access to a list
  function hasListAccess(listId) {
    let list = get(/databases/$(database)/documents/lists/$(listId));
    return list != null && (
      list.data.ownerId == request.auth.uid ||
      request.auth.token.email in list.data.sharedWith
    );
  }
  
  match /databases/{database}/documents {
    // Items: only accessible if user has access to the list
    match /items/{itemId} {
      allow read, write: if request.auth != null && 
        hasListAccess(resource.data.listId);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid &&
        hasListAccess(request.resource.data.listId);
    }
    
    // Lists: only accessible if user owns or is shared
    match /lists/{listId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.token.email in resource.data.sharedWith
      );
      allow create: if request.auth != null && 
        request.resource.data.ownerId == request.auth.uid;
      allow update: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
      allow delete: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
  }
}
```

**Note**: Firestore rules don't support `in` operator for arrays. Need alternative approach.

### Phase 4: Alternative Security Rules

Since Firestore rules can't check array membership easily, we'll use:

1. **For Lists**: Allow queries to work (they filter client-side), but restrict direct document reads
2. **For Items**: Check list access via helper function (requires reading list document)

**Simplified Approach**:
- Allow authenticated users to query lists (queries filter correctly)
- For items, validate list access in rules
- This balances security with Firestore limitations

## Testing Checklist

- [ ] Person A creates List X → Only A sees it
- [ ] Person A shares List Y with B, C → A, B, C all see Y
- [ ] Person B creates List Z → Only B sees it initially
- [ ] Person B shares List Z with A, C → A, B, C all see Z
- [ ] Person A adds item to List Y → B and C see it in real-time
- [ ] Person B picks item in List Y → A and C see the update
- [ ] Person C deletes item in List Z → A and B see it removed
- [ ] Person A unshares List Y from C → C no longer sees Y
- [ ] Person C tries to access List Y → Permission denied

## Next Steps

1. ✅ Verify current implementation matches requirements
2. ⚠️ Update security rules to properly restrict access
3. ⚠️ Test all scenarios
4. ⚠️ Handle edge cases (user email changes, etc.)

