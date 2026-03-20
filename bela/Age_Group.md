# Master Management > Age Group

## Access
- Super Admin and authorized Sub Admin users (based on role permissions)

## Screens
1. **Age Group (Listing)**
2. **Age Group (Details)**

---

## 1) Age Group (Listing)

### Purpose
View all predefined age groups and allow only **name-level edits** (age range fixed).

### Navigation
- Sidebar → **Master Management → Age Group**
- Edit action → Age Group Detail

### Business Rules
- Age groups are system-defined and pre-seeded
- Total age groups fixed at **6**
- Cannot Add / Delete / Activate / Deactivate
- Only Age Group Name is editable
- Age Group Name must be:
  - Not empty
  - Unique
- Age range values are fixed and non-editable
- Changes reflect system-wide immediately

### Table Columns
- Age Group ID (System-generated)
- Age Range (Read-only)
- Age Group Name (Editable)
- Created Date (DD/MM/YYYY)
- Action: Edit

### Pagination
- Server-side pagination
- Default page size: 10 (configurable)
- Rows per page: 10 / 25 / 50

### Validations & Error Messages
- Age group name empty → “Age group name is required.”
- Duplicate age group name → “Age group name already exist.”
- Successful update → “Age group updated successfully.”
- Unauthorized action → “You are not authorized to perform this action.”

---

## 2) Age Group (Details)

### View Section (Read-only)
- Age Group ID (System-generated)
- Age Range (Display-only)
- Created Date (DD/MM/YYYY)

### Editable Section
- **Age Group Name**
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
- Admin can view age group details
- Only name editable; age range fixed
- Validation prevents invalid updates
- Successful update redirects to listing
