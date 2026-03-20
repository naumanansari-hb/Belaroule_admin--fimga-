# Master Management > Body Shape
## Access
- Super Admin and authorized Sub Admin users (based on role permissions)

## Screens
1. **Body Shape (Listing)**
2. **Body Shape (Details)**

---

## 1) Body Shape (Listing)

### Purpose
View all predefined body shapes and allow only **name-level edits**.

### Navigation
- Sidebar → **Master Management → Body Shape**
- Edit action → Body Shape Detail

### Business Rules
- Body shapes are system-defined and pre-seeded
- Total body shapes fixed at **6**
- Cannot Add / Delete / Activate / Deactivate
- Only Body Shape Name is editable
- Body Shape Name must be:
  - Not empty
  - Unique

### Table Columns
- Body Shape ID (System-generated)
- Body Shape Name (Editable)
- Created Date (DD/MM/YYYY)
- Action: Edit Body Shape

### Seeded Body Shapes
1. Triangle
2. Rectangle
3. Circle
4. Pear
5. Inverted Triangle
6. Hour Glass

### Pagination
- Server-side pagination
- Default page size: 10 (configurable)
- Rows per page: 10 / 25 / 50

### Validations & Error Messages
- Body shape name empty → “Body shape name is required.”
- Duplicate body shape name → “Body shape name already exist.”
- Successful update → “Body shape updated successfully.”
- Unauthorized action → “You are not authorized to perform this action.”

---

## 2) Body Shape (Details)

### Purpose
View body shape metadata and update only its display name.

### View Section (Read-only)
- Body Shape ID (System-generated)
- Created Date (DD/MM/YYYY)

### Editable Section
- **Body Shape Name**
  - Mandatory
  - Free text (Max 100)
  - Unique

### Actions
- Save / Update (Primary)
- Cancel / Back (Secondary)

### Navigation Rules
- Save → update name → redirect to Listing → show success message
- Cancel → redirect to Listing without saving
- Unauthorized direct URL access must be blocked

### Acceptance Criteria
- Admin can view details
- Only name editable
- Validations enforced
- Cancel does not persist changes
