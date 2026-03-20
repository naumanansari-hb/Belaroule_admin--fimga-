# Flagged Messages — Flagged Content Management (Figma Specification)

## Scope
Listing + Detail screens for monitoring and resolving **flagged messages**.

Access:
- Super Admin
- Sub Admin (role-based)

---

## Global Rules
- Admin can view reported message content
- Admin can view Sender and Receiver email addresses
- Reported messages can be filtered by sender/receiver email addresses

---

## 1) Flagged Messages — Listing

### Header Actions
- Search:
  - Flag ID
  - Sender Email
  - Receiver Email
- Filters:
  - Status: Flagged / Resolved
  - Flagged Date: Date Range
- Sort:
  - Date (Asc / Desc)

### Table Columns
- Flag ID
- Sender Email
- Receiver Email
- Flagged By
- Flagged Date (DD/MM/YYYY)
- Status
- Action: Edit

### Pagination
- Server-side pagination (10 / 25 / 50)
- Empty state: “No Flagged Messages Available.”

---

## 2) Flagged Message — Detail

### Sections
- Flag Details:
  - Flag ID
  - Flagged By
  - Flagged Date
  - Flag Reason
  - Flag Status
- Message Details:
  - Message ID
  - Message Content
  - Sent Timestamp
  - Sender Email (linked to user detail)
  - Receiver Email (linked to user detail)
- Sender Details:
  - Sender ID
  - Sender Name
  - Sender Email
  - Sender Status (read-only)

### Admin Actions
- Update User Status (Active / Inactive) — Mandatory
- Admin Note (optional)

### Actions
- Update
- Back

### Confirmation
- “Are you sure that you want to update the user status?”
- Discard / Update

### Success
- “User status updated successfully.”