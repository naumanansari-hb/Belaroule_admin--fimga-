# 11.5 API Consumption Report

## 1. Module Overview

The API Consumption Report provides administrators with visibility into API usage, token consumption, and associated costs across all AI-powered features of the Bellaroule platform. This report supports monitoring, cost optimization, and operational analysis. The module is strictly read-only.

---

## 2. Access Control

- **Super Admin**: Full read access  
- **Sub Admin**: Read-only access based on role permissions  

---

## 3. User Stories

### 3.1 View API Consumption Report
As an Admin, I want to view API consumption and cost details so that I can monitor API usage, token consumption, and associated costs across different AI features.

### 3.2 Export API Consumption Report
As an Admin, I want to export API consumption and cost details so that I can keep track of costing and token usage.

---

## 4. Preconditions

- Admin must have valid login credentials.
- Admin must have permission to access the Reports module.
- Admin must have an active and stable internet connection.

---

## 5. Screen Purpose

The API Consumption Report screen allows admins to:
- Analyze API usage across the platform.
- Monitor token consumption and cost incurred.
- Track API success and failure trends.
- Identify high-cost or high-usage AI features for optimization.

---

## 6. Navigation Rules

- Navigation Path: Sidebar → Reports → API Consumption Report
- This is a read-only screen.
- No create, edit, or delete actions are allowed.
- Applying filters refreshes the report on the same screen.
- Sorting and filtering do not trigger navigation.

---

## 7. Business Rules

- The report is read-only.
- Each row represents one API invocation.
- Report data refreshes only when the Apply button is clicked.
- Default filters must be applied on initial load.
- Export is allowed only in CSV format.

---

## 8. Header Actions and Filters

### 8.1 Search
- Search by Transaction ID
- Search by User Full Name

### 8.2 Filters

- **Date Range**
  - Start Date (mandatory)
  - End Date (mandatory)
  - Default: Current month
  - Invalid ranges must show validation errors

- **API Name**
  - Dropdown with predefined API names
  - Default: All APIs

- **API Status**
  - Values: Success, Failed
  - Default: All

- **Used For**
  - Values:
    - Extractions
    - Compositions
    - OOTD Generation
    - Virtual Try On
    - Wardrobe Quotient
    - Key Trending Pieces
    - Image Validation
    - Weather API
    - Sorting

### 8.3 Sorting

- Sort by Cost (Ascending / Descending)
- Sort by Token Consumed (Ascending / Descending)

### 8.4 Export

- Export to CSV only
- Export respects applied filters
- If no filters are applied, default data is exported

---

## 9. Report Table Columns

- **uID**: Unique identifier for the API consumption record
- **API Name**: Predefined API name
- **Used For**: Purpose for which the API was consumed
- **Token Used**: Number of tokens consumed (decimal values allowed)
- **Cost**: Cost incurred, displayed with dollar sign (e.g., $0.023)
- **API Status**: Success or Failed
- **Date and Time**: Invocation timestamp in DD/MM/YYYY HH:MM AM/PM format

---

## 10. Pagination

- Server-side pagination
- Default page size: 10 records
- Page size options: 10, 25, 50
- Pagination controls:
  - Next / Previous
  - Page number navigation
  - Rows per page selector
- Display total record count (e.g., “Showing 1–10 of 240”)
- Show clear empty state when no records match filters

---

## 11. Status Transition Flow

- No status transitions applicable.
- API Status is static per record.

---

## 12. Edge Cases and Error Handling

- No data available: Show “No Data Available.”
- Only one date selected: Prevent filter application.
- Invalid date range: Show validation message.
- Filters return no results: Show empty state gracefully.
- Large token or cost values: Display without truncation.
- Session expiration: Redirect to Login screen.
- Backend failure or timeout: Show generic error message without technical details.

---

## 13. Acceptance Criteria

- Admin can view a paginated list of API consumption records.
- Admin can filter by Date Range, API Name, API Status, and Used For.
- Admin can sort by Cost and Token Consumed.
- Report displays accurate values for uID, API Name, Used For, Token Used, Cost, API Status, and Date and Time.
- Report refreshes only when Apply is clicked.
- Default filters load on initial screen render.
- Report is strictly read-only.
- Unauthorized users cannot access the API Consumption Report screen.

---

## 14. Mock API Specification (Frontend Consumption)

### Endpoint
GET /mock-api/reports/api-consumption

### Query Parameters

- page: number – current page number  
- pageSize: number – records per page  
- startDate: string (YYYY-MM-DD)  
- endDate: string (YYYY-MM-DD)  
- apiName: string  
- apiStatus: string (Success / Failed)  
- usedFor: string  
- sortBy: string (cost / tokenUsed)  
- sortOrder: string (asc / desc)  
- search: string (Transaction ID or User Name)

### Sample Response Structure

- totalRecords: number  
- data: list of records containing:
  - uID
  - apiName
  - usedFor
  - tokenUsed
  - cost
  - apiStatus
  - dateTime

---

## 15. Reference

This specification is derived from the Bellaroule AI FRD – Reports Module, API Consumption Report section. :contentReference[oaicite:0]{index=0}
