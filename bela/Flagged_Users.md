# Content moderation > Flagged Users
## Scope
Defines admin screens for monitoring **users flagged** for suspicious or abusive behavior.

**Access:** Super Admin, Sub Admin (role-based)

---

## Flagged Users – Listing

### Purpose
Allow admins to review users with repeated flags.

### Header Actions
- Search by User ID, User Name
- Filter by:
  - Flag Reason
  - Status

### Table Columns
- User ID
- User Name
- User Email
- Flag Reason
- Total Flags Count
- Current User Status
- Last Flag Date (DD/MM/YYYY)
- Action: View User

### Rules
- No direct user deletion
- Navigation to User Detail allowed

### Pagination
- Server-side pagination
- Default: 10 rows

## 7.1.2 Flagged User — Detail

### Sections

#### A) Flag Details (Read-only)
- Flag ID
- Flagged By
- Flagged Date (DD/MM/YYYY)
- Flag Reason
- Flag Status (Flagged / Resolved) (read-only)

#### B) User Details (Read-only)
- User ID
- User Name
- User Email
- User Status (Active / Inactive)

#### C) Admin Actions
- Update User Status (dropdown)
  - Values: Active / Inactive
  - Mandatory
- Admin Note (Text Area)
  - Optional
  - Internal only

### Actions
- Update
- Back (to listing)

### Confirmation Pop-up Logic
- If flagged by a single user:
  - “Are you sure that you want to update the flag status?”
  - Discard / Update
- If flagged multiple times:
  - “The following user is also flagged {#count} times. Do you also want to update the status of other flags?”
  - Discard / Apply All / Apply Here

### Success Message
- “User status updated successfully.”

---

## Acceptance Criteria
- Admin can view flagged users
- Admin can navigate to User Detail