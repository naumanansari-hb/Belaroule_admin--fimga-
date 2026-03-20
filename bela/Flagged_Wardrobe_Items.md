# Flagged Wardrobe Items — Flagged Content Management (Figma Specification)

## Scope
Listing + Detail screens for monitoring and resolving **flagged wardrobe items**.

Access:
- Super Admin
- Sub Admin (role-based)

---

## Global Impact Rule
When wardrobe item is marked **Inactive**:
- Item removed from community visibility
- Item remains visible to the user in their wardrobe
- Outfit generation and wardrobe functionality not impacted

---

## 1) Flagged Wardrobe Items — Listing

### Header Actions
- Search:
  - Flag ID
  - Wardrobe Item ID
- Filters:
  - Status: Flagged / Resolved
  - Flagged Date: Date Range
- Sort:
  - Date (Asc / Desc)

### Table Columns
- Flag ID
- Wardrobe Item Name
- Item Owner
- Flagged By
- Flagged Date (DD/MM/YYYY)
- Status
- Action: Edit

### Pagination
- Server-side pagination (10 / 25 / 50)
- Empty state: “No Flagged Wardrobe Items Available.”

---

## 2) Flagged Wardrobe Item — Detail

### Sections
- Flag Details:
  - Flag ID
  - Flagged By (linked)
  - Flagged Date
  - Flag Reason
  - Flag Status
- Wardrobe Item Details:
  - Wardrobe Item Name
  - Item Owner (linked)
  - Item Image (preview)
  - Item Category

### Admin Actions
- Wardrobe Item Status (Active / Inactive) — Mandatory
- Admin Note (optional)

### Actions
- Update
- Cancel

### Confirmation Logic
- Same as flagged users (single vs multiple flags)

### Success
- “Wardrobe item status updated successfully.”