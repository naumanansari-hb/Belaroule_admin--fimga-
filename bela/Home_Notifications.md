# Home > Notifications — Admin Panel (Figma Specification)

## FRD Reference
- Module: 2. Home
- Section: 2.4 Notifications

Source: AI FRD - Bellaroule (16).pdf fileciteturn15file0L286-L360

---

## Scope
The Notifications module displays **system notifications received by Admin users**, and allows them to:
- View notifications
- Distinguish Read vs Unread
- Mark notifications as Read
- Mark All as Read
- Delete notifications (one by one)

**Access:**
- Super Admin
- Sub Admin fileciteturn15file0L286-L309

---

## Preconditions
- User must be logged in with a valid session
- User account must be in Active status
- User must have access to Notifications screen from Home module fileciteturn15file0L300-L305

---

## Navigation Rules
- Notifications screen accessible from Home module fileciteturn15file0L310-L328
- Clicking a notification:
  - Marks it as Read
  - If notification contains configured redirection:
    - redirect to associated screen
  - If no redirection configured:
    - still marks as Read
- Mark All as Read:
  - marks all unread notifications as Read
- Delete icon:
  - deletes selected notification permanently

---

## Screen Layout (Template Standard)

### 1) Header
- Page Title: **Notifications**
- Header actions (right aligned):
  - **Mark All as Read** (CTA)
  - Optional: Search icon (only if system supports search in future; not required by FRD)

---

### 2) Notifications List (Main Content)

#### Each Notification Item Displays fileciteturn15file0L310-L319
- Notification Title / Message (Primary line)
- Timestamp (Date + Time)
- Read / Unread visual indicator
- Delete icon (trash)

---

## Notification List UI States

### Unread Notification Style
- Distinct/highlighted style to clearly indicate unread status fileciteturn15file0L329-L339
- Example:
  - Highlight background
  - Unread dot indicator
  - Bold title

### Read Notification Style
- Muted/standard style distinct from unread fileciteturn15file0L329-L334

---

## Actions

### A) Open Notification
**Trigger:** Click/tap notification row
**System Behavior:**
- Mark notification as Read
- If redirect target configured → navigate
- If no redirect target configured → no navigation, but still mark as Read fileciteturn15file0L310-L328

### B) Mark All as Read
**Trigger:** Header CTA button
**Rules:**
- Applies only to unread notifications
- Already read notifications remain unchanged fileciteturn15file0L343-L347

### C) Delete Notification (Single)
**Trigger:** Delete icon in item row
**Rules:**
- Deletes one notification at a time
- Deleted notifications permanently removed
- Cannot recover deleted notifications fileciteturn15file0L335-L342

---

## Business Rules (Strict)

### Read / Unread Rules fileciteturn15file0L329-L334
- A notification becomes Read when:
  - user clicks/taps it
  - regardless of redirection

### Delete Rules fileciteturn15file0L335-L342
- Single delete only (no bulk delete)
- Permanent deletion
- No restore

---

## Validations & Error Messages (Exact)

| Scenario | System Message |
|---------|----------------|
| No notifications available | “No notifications to display.” |
| Unauthorized access | Redirect to Login screen |

Error messages must match exactly. fileciteturn15file0L348-L353

---

## Edge Cases fileciteturn15file0L354-L358
- User has no notifications
- Notification has no redirection target
- User deletes last remaining notification
- Session expires while viewing notifications
- Large number of notifications requiring scroll/pagination (if applicable)

---

## Acceptance Criteria fileciteturn15file0L359-L360
- Notifications screen loads correctly for logged-in users
- Read and unread notifications are visually distinguishable
- Clicking a notification marks it as Read
- Notification without redirection still marked as Read
- Mark All as Read updates all unread notifications correctly
- Single notification deletion works correctly
- Deleted notifications do not reappear
- Empty state handled gracefully