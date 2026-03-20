# Date Format Consistency Changes

## Summary
All dates across the system should use:
- **DD/MM/YYYY** for dates only
- **DD/MM/YYYY HH:MM** for dates with time

## Utility Functions Created
File: `/src/utils/dateFormatter.ts`
- `formatDate(dateString)` - Returns DD/MM/YYYY
- `formatDateTime(dateString)` - Returns DD/MM/YYYY HH:MM
- `getCurrentDate()` - Returns current date in DD/MM/YYYY
- `getCurrentDateTime()` - Returns current datetime in DD/MM/YYYY HH:MM

## Files to Update (48 files)

### Pattern for Each File:

1. **Add import at the top:**
```typescript
import { formatDate, formatDateTime } from '@/utils/dateFormatter';
```

2. **Replace existing formatDate/formatDateTime functions** with import (remove local functions)

3. **Update all date formatting calls** to use the utility functions

### Files List:

#### Reports (4 files)
- [x] `/src/app/components/APIFailureReport.tsx` - DONE
- [ ] `/src/app/components/OOTDReport.tsx`
- [ ] `/src/app/components/RevenueReport.tsx`
- [ ] `/src/app/components/RewardPointsReport.tsx`

#### Master Management (9 files)
- [ ] `/src/app/components/AgeGroupDetail.tsx`
- [ ] `/src/app/components/AgeGroupManagement.tsx`
- [ ] `/src/app/components/BodyShapeDetail.tsx`
- [ ] `/src/app/components/BodyShapeManagement.tsx`
- [ ] `/src/app/components/CategoryManagement.tsx`
- [ ] `/src/app/components/DefaultWardrobeDetail.tsx`
- [ ] `/src/app/components/DefaultWardrobeManagement.tsx`
- [ ] `/src/app/components/TransactionTypeDetail.tsx`
- [ ] `/src/app/components/TransactionTypeManagement.tsx`

#### Reward Plans (2 files)
- [ ] `/src/app/components/RewardPlanDetail.tsx`
- [ ] `/src/app/components/RewardPlanManagement.tsx`

#### Email Templates (2 files)
- [ ] `/src/app/components/EmailTemplateDetail.tsx`
- [ ] `/src/app/components/EmailTemplatesManagement.tsx`

#### FAQs (1 file)
- [ ] `/src/app/components/FAQsManagement.tsx`

#### Static Pages (2 files)
- [ ] `/src/app/components/StaticPageDetail.tsx`
- [ ] `/src/app/components/StaticPagesManagement.tsx`

#### Content Moderation - Flagged Items (10 files)
- [ ] `/src/app/components/FlaggedCommentsManagement.tsx`
- [ ] `/src/app/components/FlaggedCommentDetail.tsx`
- [ ] `/src/app/components/FlaggedPostsManagement.tsx`
- [ ] `/src/app/components/FlaggedPostDetail.tsx`
- [ ] `/src/app/components/FlaggedUsersManagement.tsx`
- [ ] `/src/app/components/FlaggedUserDetail.tsx`
- [ ] `/src/app/components/FlaggedWardrobeManagement.tsx`
- [ ] `/src/app/components/FlaggedWardrobeItemDetail.tsx`
- [ ] `/src/app/components/FlaggedMessagesManagement.tsx`
- [ ] `/src/app/components/FlaggedMessageDetail.tsx`

#### Posts (2 files)
- [ ] `/src/app/components/PostsManagement.tsx`
- [ ] `/src/app/components/PostDetail.tsx`

#### Payment History (1 file)
- [ ] `/src/app/components/PaymentHistoryManagement.tsx`

#### Roles (2 files)
- [ ] `/src/app/components/RoleManagement.tsx`
- [ ] `/src/app/components/RoleDetail.tsx`

#### Employees/Users (2 files)
- [ ] `/src/app/components/EmployeeDetail.tsx`
- [ ] `/src/app/components/SubAdminDetail.tsx`

#### System Configuration (6 files)
- [ ] `/src/app/components/SystemNotifications.tsx`
- [ ] `/src/app/components/SystemNotificationDetail.tsx`
- [ ] `/src/app/components/PromptManagement.tsx`
- [ ] `/src/app/components/PromptDetail.tsx`
- [ ] `/src/app/components/APIConfigurationManagement.tsx`
- [ ] `/src/app/components/APIConfigurationDetail.tsx`
- [ ] `/src/app/components/TaskConfigurationManagement.tsx`
- [ ] `/src/app/components/TaskConfigurationDetail.tsx`

#### Notifications (1 file)
- [ ] `/src/app/components/Notifications.tsx`

#### Global Header (1 file)
- [ ] `/src/app/components/GlobalHeader.tsx`

#### Shared Components (1 file)
- [ ] `/src/app/components/hb/listing/DateRangeFilter.tsx`

## Example Changes:

### BEFORE:
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Usage
<span>{formatDate(item.createdDate)}</span>
```

### AFTER:
```typescript
import { formatDate } from '@/utils/dateFormatter';

// Usage (function is imported, not defined locally)
<span>{formatDate(item.createdDate)}</span>
```

### For DateTime fields:

### BEFORE:
```typescript
const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${datePart} ${timePart}`;
};
```

### AFTER:
```typescript
import { formatDateTime } from '@/utils/dateFormatter';
// Function now returns DD/MM/YYYY HH:MM (24-hour format)
```

## Common Replacements:

1. **Date only formatting:**
   - Replace: `date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })`
   - With: `formatDate(date)`

2. **Date only formatting (en-GB):**
   - Replace: `date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })`
   - With: `formatDate(date)`

3. **DateTime formatting:**
   - Replace: Custom datetime formatting logic
   - With: `formatDateTime(dateTime)`

4. **Creating new dates:**
   - Replace: `new Date().toISOString().split('T')[0]`
   - With: Keep as-is (for internal data storage) OR use `getCurrentDate()` for display

## Testing Checklist:
- [ ] All listing pages show dates in DD/MM/YYYY format
- [ ] All detail pages show dates in DD/MM/YYYY format
- [ ] All datetime fields show DD/MM/YYYY HH:MM format
- [ ] Date range filters work correctly
- [ ] Export functions use correct date format
- [ ] No console errors related to date formatting
