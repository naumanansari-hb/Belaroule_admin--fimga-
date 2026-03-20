# 10.4 System Notifications (In-App Templates) — Configuration (Figma Specification)

## FRD Reference
- Module: 10. Configuration
- Section: 10.4 System Notifications (In-App Templates)

Source: AI FRD - Bellaroule (18).pdf

---

## Scope
This module manages **predefined in-app system notification templates** used by the platform.

Admins can:
- View existing notification templates
- Edit notification content
- Activate/Deactivate templates

Admins CANNOT:
- Add new notification templates
- Delete templates

**Access:**
- Super Admin
- Sub Admin (role-based permissions)

---

## Navigation
- Sidebar → Configuration → System Notifications

---

## 10.4.1 System Notifications — Listing Screen

### Purpose
To display a list of all predefined system notification templates and allow edit + status change.

### Listing Rules
- Templates are system predefined
- No “Add Notification” button
- No delete action
- Each template has unique Notification Code (read-only)
- Status controls whether the notification is used by system

---

### Header Controls
- Search (by Notification Title / Notification Code)
- Filter by Status:
  - Active
  - Inactive
- Sort by:
  - Last Updated Date (Latest first default)

---

### Table Columns
- Notification Title
- Notification Code (system generated / predefined)
- Status (Active/Inactive toggle)
- Last Updated Date (DD/MM/YYYY HH:MM)
- Action: Edit

---

### Status Toggle Behavior
- Switching Active → Inactive disables notification usage system-wide
- Switching Inactive → Active enables notification usage

Confirmation modal required:
- “Are you sure you want to update the status?”
Buttons:
- Cancel
- Update

Success message:
- “System notification status updated successfully.”

---

### Empty State & Errors
- No records: “No system notifications available.”
- Unauthorized: “You are not authorized to perform this action.”
- Save failure: “Something went wrong. Please try again.”

---

### Pagination
- Server-side pagination
- Default page size: 10
- Options: 10 / 25 / 50
- Show total record count

---

## 10.4.2 System Notification — Detail/Edit Screen

### Purpose
Allow Admin to edit in-app notification template content (English).

### Navigation Rules
- Open from listing → Edit
- After successful update → redirect back to listing

---

### Fields

#### Editable Fields
- Notification Title (mandatory)
  - Validation: cannot be blank
- Notification Message (mandatory)
  - Type: Multi-line text / rich text (as per system)
  - Language: English only
  - Supports variables/placeholders

#### Read-only Fields
- Notification Code
- Variables List (Key + Description)

---

### Variables / Placeholder Rules
- Variables are predefined and listed on screen
- Admin cannot edit variable keys
- Admin can only use allowed variables in message text
- If invalid variable used → validation error

---

### Actions
- Update
- Cancel

---

### Confirmation Popup
On Update click:
- “Are you sure you want to update the system notification?”
Buttons:
- Cancel
- Update

---

### Validations & Messages
- Missing required fields:
  - “Required fields are missing.”
- Invalid variable used:
  - “Invalid variable used in notification content.”
- Update success:
  - “System notification updated successfully.”
- Update failure:
  - “Something went wrong. Please try again.”

---

## Edge Cases
- User session expired during edit → redirect to login
- Template inactive but edited → allowed (edit does not auto-activate)
- Large message length → should still support formatting without UI break
- Concurrent updates by two admins → latest save wins

---

## Acceptance Criteria
- Listing shows all templates with status + last updated + edit action
- Search/filter works
- Status toggle requires confirmation and shows success message
- Edit screen loads correct notification template
- Admin can update title/message successfully
- Invalid variables are blocked
- No Add/Delete possible from UI
- RBAC is enforced for Sub Admin access