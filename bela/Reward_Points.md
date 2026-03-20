# Reward Points Report — Reports Module (Figma Specification)

## Scope
Read-only reward credit/debit transactions report.

Access: Super Admin, Sub Admin (role-based)

---

## Reward Points Report – Listing

### Filters
- Search by Transaction ID, User Name
- Country
- Platform
- Transaction Type (Credit / Debit)
- Date Range (mandatory)
  - Default: Current Month
- Apply
- Export (CSV only)

### Table Columns
- Transaction ID
- Transaction Type
- User (clickable)
- Country
- Platform

### Pagination
- Server-side (10 / 25 / 50)

### Edge Cases
- No data → “No Data Available.”