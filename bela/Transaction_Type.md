# Transaction Type — Master Management (Figma Spec)

> Note: The **Master Management PDF extract provided (AI FRD - Bellaroule (3).pdf)** shows that **Transaction Type supports View/Edit/Add** in the permission matrix, but **full screen-level requirements for Transaction Type are not present** in that extract.
> This spec is a **best-effort, consistent master pattern** aligned with the rest of the Admin Panel masters and the “Credit/Debit” transaction usage seen in Reward reporting.

## Access
- Super Admin and authorized Sub Admin users (based on role permissions)

## Screens
1. **Transaction Type (Listing)**
2. **Transaction Type (Add)**
3. **Transaction Type (Details / Edit)**

---

## 1) Transaction Type (Listing)

### Purpose
Maintain a master list of transaction types used across reports and reward/wallet transaction records.

### Table Columns
- Transaction Type ID (System-generated)
- Transaction Type Name (e.g., Credit, Debit, etc.)
- Description (optional)
- Status (Active / Inactive)
- Created Date (DD/MM/YYYY)
- Action: Edit

### Header Actions
- Search (by Transaction Type Name / ID)
- Filter by Status (Active/Inactive)
- Add Transaction Type (Primary CTA)

### Pagination
- Server-side pagination (10 default; 10/25/50)

---

## 2) Transaction Type (Add)

### Fields
- **Transaction Type Name** (Text, mandatory, max 100, unique)
- **Description** (Textarea, optional, max 250)
- **Status** (Dropdown: Active/Inactive; default Active)

### Actions
- Create (Primary)
- Cancel (Secondary)

### Validations (proposed)
- Empty name → “Transaction type name is required.”
- Duplicate name → “Transaction type name already exists.”

---

## 3) Transaction Type (Details / Edit)

### View (Read-only)
- Transaction Type ID
- Created Date
- Last Modified Date

### Editable
- Transaction Type Name (unique)
- Description
- Status (Active/Inactive)

### Actions
- Save / Update
- Cancel / Back

### Edge Cases
- If Transaction Type is used in historical transactions, deactivation should be allowed (data remains intact), but deletion should not exist.
- Unauthorized direct URL access blocked.
