````md
# contact_us_details.md — Contact Us (Details Screen)

All UI components already exist in the system. This document defines how to compose existing React components to build the **Contact Us – Details** screen using mock APIs. No backend implementation is required.

---

## 1. Access & Roles

### Access To
- Super Admin only

### Preconditions
- Admin must be logged in
- Admin must have access to Contact Management module
- Ticket must exist and be created from the mobile application

---

## 2. Screen Identity

- Screen Name: Contact Us (Details)
- Route: `/contact-management/contact-us/:ticketId`
- Sidebar Path: Communication / Contact Management → Contact Us
- Breadcrumb: Contact Management > Contact Us > {Ticket ID}

---

## 3. Screen Purpose

This screen allows the admin to:
- View complete details of a user-raised Contact Us ticket
- Review the user’s message
- Add an internal/admin conclusion
- Close the ticket by updating its status
- Navigate between tickets
- Safely handle unsaved changes

This screen supports **controlled updates** (Conclusion + Status only).

---

## 4. Layout & Component Composition

Reuse existing layout and UI components only.

### Main View Area Structure
1. Page Header
   - Title: `Ticket Details`
   - Breadcrumb navigation
   - Back button (navigates to Contact Us Listing)

2. Ticket Details Form (existing form layout)
   - Read-only fields
   - Editable fields (Conclusion, Status)

3. Ticket Navigation Controls
   - Previous Ticket (Left Arrow)
   - Next Ticket (Right Arrow)

4. Action Bar
   - Update button
   - Discard button

No new UI components must be created.

---

## 5. Ticket Information Fields

| Field Name | Editable | Description |
|-----------|----------|-------------|
| Ticket ID | No | System-generated unique identifier |
| User Name | No | Name of the user who raised the ticket |
| User Email | No | Email address of the user |
| Subject | No | Ticket subject |
| Message | No | Full user-submitted message |
| Contacted Date | No | Date & time when ticket was created |
| Status | Yes* | Open / Closed |
| Conclusion | Yes* | Admin response / resolution |

\* Editable only when ticket status is **Open**

---

## 6. Status & Conclusion Rules

### Status Field
- Default value: Open
- Allowed values:
  - Open
  - Closed

### Conclusion Field
- Text area
- Max length: 1000 characters
- Mandatory when:
  - Status is set to Closed

### Validation Rules
- If Status = Closed AND Conclusion is empty:
  - Block update
  - Show inline validation error:
    - “Conclusion is required to close the ticket.”

### Closed Ticket Behavior
- If ticket status is already Closed:
  - Status field is disabled
  - Conclusion field is disabled
  - Update button is hidden or disabled
  - Screen becomes fully read-only

---

## 7. Action Buttons

### 7.1 Update
- Visible only when ticket status is Open
- On click:
  - Validate mandatory fields
  - Submit changes via mock API
- On success:
  - Show success toast: `Ticket updated successfully`
  - Refresh ticket details
- On failure:
  - Show error toast: `Unable to update ticket. Please try again.`

---

### 7.2 Discard
- Discards unsaved changes
- Resets Status and Conclusion to last saved values
- Navigates back to listing screen with preserved filters (recommended)

---

## 8. Ticket Navigation (Previous / Next)

### Navigation Controls
- Left Arrow → Previous ticket
- Right Arrow → Next ticket

### Rules
- Navigation is based on the current listing context (filters, sort, search)
- If no previous or next ticket exists:
  - Disable corresponding arrow

### Unsaved Changes Handling
- If admin attempts navigation with unsaved changes:
  - Show confirmation modal:
    - Message: “You have unsaved changes. Do you want to proceed without updating?”
    - Actions:
      - Proceed
      - Cancel

---

## 9. Notifications & Communication (Mocked)

### 9.1 User Email Notification
- Triggered when:
  - Admin adds content in Conclusion field AND clicks Update
- Behavior:
  - Send mock email notification to user
- If user email is unavailable:
  - Skip email
  - Show info toast:
    - “User email not available. Email notification skipped.”

---

### 9.2 Admin Audit Logging (Optional Mock)
- Every Update action logs:
  - Admin ID
  - Ticket ID
  - Status change
  - Timestamp

---

## 10. Error Handling

### Ticket Not Found
- Show empty state:
  - “Ticket not found.”
- Provide Back to Listing button

### Unauthorized Access
- Redirect to login or show Unauthorized screen (if exists)

### API Failure
- Show generic error message
- Provide Retry option

---

## 11. Mock API Specification — Contact Us Details

### GET Ticket Details
Endpoint: `GET /mock/contact-tickets/:ticketId`

200 Response:
```json
{
  "ticketId": "TCK-10021",
  "userName": "Aanya Sharma",
  "userEmail": "aanya@example.com",
  "subject": "Unable to redeem Bella Coins",
  "message": "I tried redeeming Bella Coins but it shows an error every time. Please help.",
  "contactedDate": "2026-01-25T10:25:00Z",
  "status": "open",
  "conclusion": ""
}
````

404 Response:

```json
{ "message": "Ticket not found" }
```

---

### PATCH Ticket Update

Endpoint: `PATCH /mock/contact-tickets/:ticketId`

Request Body:

```json
{
  "status": "closed",
  "conclusion": "The issue has been resolved. Please try again."
}
```

200 Response:

```json
{
  "ticketId": "TCK-10021",
  "status": "closed",
  "conclusion": "The issue has been resolved. Please try again.",
  "updatedAt": "2026-01-27T10:30:00Z"
}
```

400 Validation Error:

```json
{ "message": "Conclusion is required to close the ticket." }
```

---

### GET Adjacent Tickets (Previous / Next)

Endpoint: `GET /mock/contact-tickets/:ticketId/adjacent`

Query Params (optional, from listing context):

* q
* status
* dateFrom
* dateTo
* sortBy
* sortOrder

Response:

```json
{
  "prevTicketId": "TCK-10020",
  "nextTicketId": "TCK-10022"
}
```

---

## 12. Acceptance Criteria

* Ticket details load correctly for valid ticket ID
* All read-only fields display correct data
* Admin can add conclusion and close open tickets
* Validation prevents closing ticket without conclusion
* Closed tickets are fully read-only
* Update and Discard actions behave correctly
* Previous/Next navigation works with unsaved-change protection
* Error, empty, and loading states are handled gracefully
* Only existing UI components are used

```
```
