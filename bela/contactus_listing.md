````md
# contact_us_listing.md — Contact Us (Listing Screen)

All UI components already exist in the system. This document defines how to compose existing React components to build the **Contact Us – Listing** screen using mock APIs. No backend implementation is required.

---

## 1. Access & Roles

### Access To
- Super Admin only

### Preconditions
- Admin must be logged in
- Admin must have access to Contact Management module
- Contact tickets must be created from the mobile application

---

## 2. Screen Identity

- Screen Name: Contact Us (Listing)
- Route: `/contact-management/contact-us`
- Sidebar Path: Communication / Contact Management → Contact Us
- Breadcrumb: Contact Management > Contact Us

---

## 3. Screen Purpose

This screen displays all **Contact Us tickets raised by users** and allows the admin to:
- Search tickets using keywords
- Filter tickets by date and status
- Sort tickets by columns
- Navigate to ticket detail screen
- Monitor open and closed user queries

This screen is **read-only** and serves as the entry point to the Contact Us Details screen.

---

## 4. Layout & Component Composition

Reuse existing layout and UI components only.

### Main View Area Structure
1. Page Header
   - Title: `Contact Us`
   - Breadcrumb navigation

2. Toolbar Row
   - Search input
   - Date range filter
   - Status filter
   - Clear / Reset filters button (if already available)

3. Contact Tickets Table
   - Existing data table component
   - Server-side pagination, sorting, and filtering

4. Pagination Footer
   - Existing pagination component
   - Page size selector and total count

No new UI components should be introduced.

---

## 5. Table Columns

The listing table must display the following columns in order:

1. Ticket ID (clickable)
2. User Name
3. User Email
4. Subject
5. Contacted Date
6. Status (Open / Closed)

---

## 6. Search Functionality

### Search Input
- Placeholder: `Search by Ticket ID, Name, Email, Status`
- Searchable Fields:
  - Ticket ID
  - User Name
  - User Email
  - Status

### Search Rules
- Keyword-based search
- Debounced input
- Server-side search
- On search change:
  - Reset pagination to page 1
  - Refresh table data

---

## 7. Filters (Server-side)

### 7.1 Date Range Filter
- Filter by Contacted Date
- Start Date and End Date selection
- Optional filter (can be cleared)

### 7.2 Status Filter
- Options:
  - Open
  - Closed
  - All
- Default: All

### Filter Rules
- Filters apply independently of search and sorting
- Any filter change triggers data reload
- Pagination resets to page 1 on filter change

---

## 8. Sorting (Server-side)

- Sorting is supported on all table columns
- Default sort:
  - Contacted Date → Descending (latest first)
- Sorting applies independently of search and filters

---

## 9. Pagination (Server-side)

- Default page size: 10
- Page size options: 10 / 25 / 50
- Controls:
  - Next / Previous
  - Page number navigation
- Display:
  - Total records count
  - “Showing X–Y of Z”

---

## 10. Row Interaction & Navigation

### Ticket ID Click
- Clicking Ticket ID navigates to:
  `/contact-management/contact-us/:ticketId`

### Deep-link Handling (Optional)
- If admin is redirected from a notification:
  - Load listing screen
  - Automatically open corresponding ticket detail screen

---

## 11. Loading, Empty & Error States

### Loading State
- Show existing table skeleton loader

### Empty State
- If no tickets exist:
  - Message: `No contact ticket data found.`

### Error State
- Generic error message:
  - `Something went wrong. Please try again.`
- Retry action available

---

## 12. Mock API Specification — Contact Us Listing

### GET Contact Tickets
Endpoint: `GET /mock/contact-tickets`

#### Query Parameters
- `q` — keyword search (ticketId, userName, userEmail, status)
- `status` — `open | closed | all`
- `dateFrom` — YYYY-MM-DD
- `dateTo` — YYYY-MM-DD
- `sortBy` — `ticketId | userName | userEmail | subject | contactedDate | status`
- `sortOrder` — `asc | desc`
- `page` — number
- `pageSize` — number

#### 200 Response
```json
{
  "data": [
    {
      "ticketId": "TCK-10021",
      "userName": "Aanya Sharma",
      "userEmail": "aanya@example.com",
      "subject": "Unable to redeem Bella Coins",
      "contactedDate": "2026-01-25T10:25:00Z",
      "status": "open"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 128
  }
}
````

#### Empty Response (200)

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 0
  }
}
```

#### Error Responses

401 Unauthorized

```json
{ "message": "Unauthorized" }
```

500 Server Error

```json
{ "message": "Something went wrong" }
```

---

## 13. Acceptance Criteria

* Contact Us listing screen loads successfully
* Table displays all required columns
* Server-side search, filters, sorting, and pagination work correctly
* Ticket ID navigates to Contact Us Details screen
* Empty, loading, and error states are handled gracefully
* No data mutation is possible from this screen
* Only existing UI components are used

```
```
