# Revenue Report — Reports Module (Figma Specification)

## Scope
Read-only analytical report showing plan-wise revenue performance.

Access: Super Admin, Sub Admin (role-based)

---

## Revenue Report – Listing

### Filters
- Country (All by default)
- Platform (Android / iOS / All)
- Date Range (Start + End mandatory)
  - Default: Current Month
- Apply
- Export (CSV only)

### Table Columns
- Plan ID
- Plan Name
- Platform Type
- Country
- Total Purchases
- Gross Revenue
- Currency

### Rules
- Read-only
- Refresh only on Apply

### Pagination
- Server-side (10 / 25 / 50)

### Edge Cases
- No data → “No Data Available.”