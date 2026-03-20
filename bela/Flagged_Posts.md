# Flagged Posts — Flagged Content Management (Figma Specification)

## Scope
Listing + Detail screens for monitoring and resolving **flagged posts**.

Access:
- Super Admin
- Sub Admin (role-based)

---

## Global Impact Rule
When a post is marked **Inactive**:
- Post removed from community feed
- Post removed from user profile

---

## 1) Flagged Posts — Listing

### Header Actions
- Search:
  - Flag ID
  - Post ID
- Filters:
  - Status: Flagged / Resolved
  - Flagged Date: Date Range
- Sort:
  - Date (Asc / Desc)

### Table Columns
- Flag ID
- Post ID
- Post Owner
- Flagged By
- Flagged Date (DD/MM/YYYY)
- Status
- Action: Edit

### Pagination
- Server-side pagination (10 / 25 / 50)
- Empty state: “No Flagged Posts Available.”

---

## 2) Flagged Post — Detail

### Sections
- Flag Details:
  - Flag ID
  - Flagged By (linked)
  - Flagged Date
  - Flag Reason
  - Flag Status
- Post Details:
  - Post ID (linked to post detail)
  - Post Owner (linked to user detail)
  - Post Image/Video preview
  - Caption
  - Hashtags

### Admin Actions
- Post Status (Active / Inactive) — Mandatory
- Admin Note (optional)

### Actions
- Update
- Cancel

### Confirmation Logic
- Same as flagged users (single vs multiple flags)

### Success
- “Post status updated successfully.”