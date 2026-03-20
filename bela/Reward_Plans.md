# Rewards and payments > Reward Plans

## Scope

This document defines all **Reward Plans screens, fields, and behaviors**
for the BellaRoules Admin Panel.

**Access:** Super Admin only

---

## 1. Reward Plans – Listing

### Purpose

Allow Super Admins to view and manage purchasable reward coin plans used for in-app purchases.

### Navigation

- Sidebar → Plan Management → Reward Plans

### Header Actions

- Add Reward Plan
- Filter by:
  - Status (Active / Inactive)
  - Currency
- Sorting:
  - Coins Count (Asc / Desc)
  - Price (Asc / Desc)
  - Display Order (Asc)
  - Last Modified Date (Latest First – default)

### Table Columns

- Plan ID (system-generated)
- Coins Count
- Price
- Currency
- Display Order
- Status (Active / Inactive)
- Last Modified Date (DD/MM/YYYY HH:MM)
- Action: Edit

### Business Rules

- Only **Active** plans are exposed to the mobile application
- Inactive plans are hidden from users but visible to admins
- Display Order controls the order shown in the mobile app
- Duplicate plans with the same coin count for the same platform are not allowed
- Changes do not affect historical purchases

### Pagination

- Server-side pagination
- Default page size: 10
- Rows per page: 10 / 25 / 50
- Total record count displayed
- Empty state shown when no plans exist

---

## 2. Reward Plan – Create / Edit

### Entry

- Listing → Add Reward Plan
- Listing → Edit Reward Plan

### Editable Fields

- Coins Count (mandatory, positive integer)
- Price (mandatory, > 0)
- Currency (mandatory)
- Display Order (mandatory, positive integer)
- Description (optional)
- Status (Active / Inactive; default Active)

### Read-Only Fields (Edit Mode)

- Plan ID
- Created Date
- Last Modified Date

### Actions

- Save
- Cancel

### Validations & Error Messages

- Coins Count:
  - “Coin count is required.”
  - “Coins count must be a positive number.”
- Price:
  - “Please enter a valid price.”
  - “The price must be greater than zero.”
- Currency:
  - “Please select a currency.”
- Display Order:
  - “Display order is required.”
  - “Display order must be a positive number.”
- Duplicate Plan:
  - “A reward plan with the same coin count already exists for the selected platform.”

### Acceptance Criteria

- Super Admin can create and edit reward plans
- Active plans appear in the mobile application
- Deactivated plans are unavailable for purchase
- Display order controls mobile listing
- Existing purchase history remains unchanged