# Category — Master Management (Figma Spec)

## Access
- Super Admin and authorized Sub Admin users (based on role permissions)

## Screens
1. **Category (Listing)**

---

## 1) Category (Listing)

### Purpose
View all predefined wardrobe categories and allow only **name-level edits** (no structural changes).

### Navigation
- Sidebar → **Master Management → Category**
- Edit action opens editable mode (inline or modal, as per UI)

### Business Rules
- Categories are **system-defined and pre-seeded**
- Total categories fixed at **5**
- Categories cannot be:
  - Added
  - Deleted
  - Activated/Deactivated
- Category Name must be:
  - Not empty
  - Unique
- Updates reflect system-wide immediately

### Table Columns
- Category ID (System-generated)
- Category Name (Editable)
- Created Date (DD/MM/YYYY)
- Action: Edit Category

### Seeded Categories (must always exist)
- Tops
- Bottoms
- Footwear
- Accessories
- Outerwear

### Pagination
- Server-side pagination
- Default page size: 10 (configurable)
- Rows per page: 10 / 25 / 50

### Validations & Error Messages
- Category name empty → “Category name is required.”
- Duplicate category name → “Category name already exists.”
- Successful update → “Category updated successfully.”
- Unauthorized update attempt → “You are not authorized to perform this action.”

### Acceptance Criteria
- Admin can view all predefined categories
- Category list always contains exactly 5 records
- No Add/Delete/Status actions visible
- Editing validates empty/duplicate and persists correctly
