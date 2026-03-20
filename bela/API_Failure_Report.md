# API Failure Report — Reports Module (Figma Specification)

## Scope
Read-only report for failed API requests.

Access: Super Admin, Sub Admin (role-based)

---

## API Failure Report – Listing

### Filters
- Search by API name
- Date & Time range
- Status (Failed)
- Export (CSV only)

### Table Columns
- API Name
- Date & Time
- Request
- Response
- Failure Reason
- Status

### Pagination
- Server-side (10 / 25 / 50)

### Edge Cases
- No failures → “No API Failures Available.”