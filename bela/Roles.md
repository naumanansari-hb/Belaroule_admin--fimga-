# Master management > Roles

## Access
- **Super Admin:** Full access (Create / View / Edit / Activate-Deactivate / Permission Matrix)
- **Sub Admin:** Access based on Role Permissions (as granted by Super Admin)

## Screens
1. **Role Master (Listing)**
2. **Role Master (Create New Role)**
3. **Role Master (Edit Role / Details)**

---

## 1) Role Master (Listing)

### Purpose
View and manage roles used to control access across the Admin Panel.

### Primary Actions
- Search roles
- Filter roles by status
- Add new role
- Edit role
- Activate / Deactivate role

### Table Columns
- Role ID (system generated)
- Role Name
- Description
- Status (Active / Inactive)
- Created Date (DD/MM/YYYY)
- Last Modified Date (DD/MM/YYYY)
- Action: Edit

### Rules
- **Role Name must be unique**
- **Role Deactivation Constraint:** If role is assigned to any sub-admin, deactivation must be blocked with an error.
- Pagination: server-side; default page size 10 (configurable); next/prev + page numbers + rows-per-page (10/25/50)
- Empty state when no records match search/filter.

---

## 2) Role Master (Create New Role)

### Entry
- From Role Listing → **Add Role**

### Sections
#### A) Role Details
Fields:
- **Role Name** (Text, mandatory, max 100, unique)
- **Description** (Textarea, optional, max 250)
- **Status** (Dropdown: Active/Inactive; default Active)

#### B) Permission Matrix (Module Permissions)
- Matrix columns: **View / Edit / Add**
- Rows: modules (Dashboard, My Profile, Sub-Admin, User, Guest User, Roles, Category, Body Shape, Age Group, Default Wardrobe, Transaction Type, Reward Plans, Payment History, Post, Flagged Users/Posts/Comments/Wardrobe Items, Task Configurations, Prompts & API Setting, API/LLM Config, Static Pages, FAQs, Email Notifications, System Notification, Reports, etc.)

##### Permission Dependency Rules
- **View must be enabled before Edit or Add can be selected**
- Removing View auto-unchecks Edit and Add for that module
- Disabled permissions (–) cannot be selected
- Permission changes apply immediately after successful save

### Buttons
- **Create Permissions / Create Role** (Primary)
  - Validate role name uniqueness
  - Validate permission dependency rules
  - Confirm popup: “Are you sure you want to create a new role ?”
  - Success toast: “Role created successfully.”
- **Cancel** (Secondary)
  - Discard changes, return to Role Listing

### Edge Cases
- No permissions selected → allow save (view-only disabled)
- Session expiry → redirect to login
- Backend error → show generic error message

---

## 3) Role Master (Edit Role / Details)

### Entry
- From Role Listing → **Edit**

### Editable Fields
- Role Name (unique)
- Description
- Status (Active/Inactive) — subject to deactivation constraint
- Permission matrix (same dependency rules)

### Buttons
- **Update Permissions / Update Role** (Primary)
  - Confirm popup: “Are you sure you want to update the role details?”
  - Success toast: “Role updated successfully.”
- **Cancel** (Secondary)

### Deactivation Constraint
- If role is assigned to any sub-admin:
  - Block deactivation
  - Show error (generic): role is assigned and cannot be deactivated (exact wording depends on UI copy set)

### Acceptance Criteria
- Super Admin can create/update roles and permissions
- Dependency rules enforced
- Assigned roles cannot be deactivated
