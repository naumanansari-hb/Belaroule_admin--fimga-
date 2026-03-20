# Master Management > Default Wardrobe Item Master

## FRD Reference
- Section: 4.2 Default Wardrobe Item
- Sub-sections:
  - 4.2.1 Default Wardrobe Item (Listing)
  - 4.2.2 Default Wardrobe Item (Adding)
  - 4.2.3 Default Wardrobe Item (Details)

---

## Scope
This module manages **AI-processed Default Wardrobe Items** that will be suggested to users.

Key concept:
- Admin uploads item image(s)
- AI processes image and detects wardrobe item category (and extracted items in bulk mode)
- Admin reviews AI tagging and approves/rejects
- Only approved items are eligible for default wardrobe suggestion logic

**Default items are suggestions, not ownership.**

---

## Access Control
Access to:
- Super Admin
- Authorized Sub Admin users (Role-based permissions)

Precondition:
- Admin logged in
- Admin account Active
- Permission granted for Master Management → Default Wardrobe Item

---

## AI Processing Outcomes (System-Level)

### Case 1: Single Category Item Detected
- Image contains one valid wardrobe category item
- AI tags:
  - Category (mandatory)
- Admin:
  - Reviews AI tags
  - Corrects if needed
  - Manually fills missing tags
  - Approves item

### Case 2: Multiple Category Items + Human Detected (Bulk Upload)
- Image contains human + multiple wardrobe items
- AI detects and separates individual items
- AI tags each extracted item with Category
- Admin reviews each extracted item individually and approves one-by-one or in bulk

### Case 3: No Valid Category Item Detected
- AI detects none of supported wardrobe categories
- System rejects upload
- Error message:
  - “This image does not contain any supported wardrobe item. Please upload a different image.”

---

# 4.2.1 Default Wardrobe Item — Listing Screen

## Purpose
Provide visibility into:
- AI processed items
- Approval status
- Category tagging completeness
- Active/Inactive default items

## Navigation Rules
- Sidebar → Master Management → Default Wardrobe Item
- Add Default Set → redirects to Add screen
- Edit/View → redirects to Detail screen
- After successful create/update → remain on listing with confirmation message

## Visibility Rules (Critical)
- Only **Active** default sets are considered in runtime suggestion logic
- Inactive sets ignored by system but visible to admins
- Only **Approved** items used for suggestions
- Pending items never shown to users
- Rejected items archived and ignored

## Table Columns
- Item ID (system-generated)
- Image Preview (thumbnail)
- Category (detected/assigned)
- Age Group (assigned/pending)
- Body Shape (assigned/pending)
- AI Status (Processed / Failed)
- Approval Status (Pending / Approved / Rejected)
- Created Date (DD/MM/YYYY)
- Action: View / Edit

## Filters & Search
- Filter by:
  - Category
  - Approval Status
  - AI Status
- Search by:
  - Item ID

## Pagination
- Server-side pagination
- Default page size: 10
- Rows per page: 10 / 25 / 50
- Show total record count (e.g., “Showing 1–5 of 5”)
- Disable controls if records ≤ page size

## Validations & Messages
- No records: “No Default Wardrobe Sets Available.”
- Unauthorized: “You are not authorized to access this section.”
- AI failed: “Image processing failed. Please try again.”

---

# 4.2.2 Default Wardrobe Item — Add Screen (Upload + Review)

## Purpose
- Upload images and trigger AI processing
- Allow admin to define default wardrobe sets to drive suggestions

## Step 1: Upload Section

### Fields
- Upload Image (Mandatory)
  - Supports single image and bulk images
  - Formats: JPG, PNG
- Upload Mode
  - Single Item Upload
  - Bulk Upload (multiple items in one image)

### Processing Messages
- “Image is being processed.”
- “Image processed successfully. Please review the details.”

---

## Step 2: Approval & Review Section

### Fields (Mandatory)
- Age Group (Dropdown)
  - Values: Specific Age Group OR Generic
- Body Shape (Dropdown)
  - Values: Specific Body Shape OR Generic
- Category (Dropdown)
  - Values: Top / Bottom / Footwear
- Item Name (Text)
- Item Image (Upload)
  - Max size: 5 MB
- Status
  - Active / Inactive

---

## Core Assignment Logic (Authoritative Priority)
System resolves default sets using priority:
1. Age Group + Body Shape
2. Age Group + Generic Body Shape
3. Body Shape + Generic Age Group
4. Fully Generic

Additional Rules:
- Only Active records eligible
- Per Category:
  - Minimum 1 item required
  - Same item cannot repeat within a set
- Default items:
  - marked as is_default = true
  - suggestions only, not ownership

---

## Validations & Messages
- Missing mandatory: “Required fields are missing.”
- No items selected: “At least one item must be selected.”
- Duplicate config: “A default set already exists for this configuration.”
- Save success: “Default wardrobe set created successfully.”
- No valid item: “This image does not contain any supported wardrobe item. Please upload a different image.”

---

# 4.2.3 Default Wardrobe Item — Detail Screen

## Purpose
Acts as human-in-the-loop validation layer for AI processed wardrobe items, and allows controlled updates to default wardrobe configuration.

## Screen Sections

### Image Preview
- Original uploaded image
- Highlight detected items (only for bulk upload)

### AI Detected Fields (Editable After Review)
- Category
  - Mandatory
  - AI suggested
  - Editable
- Age Group (optional/manual/editable)
- Body Shape (optional/manual/editable)

### Approval Status / Actions
Buttons:
- Approve
- Reject
- Save as Draft

Navigation:
- Save updates → redirect to listing
- Cancel → return without saving

## Business Rules
- Item cannot be approved without Category
- Draft items not used by system
- Approved items become eligible for default suggestion logic
- Rejected items permanently excluded
- Deactivated sets ignored immediately
- Existing user history NOT modified

## Validations & Messages
- Invalid update: “Invalid configuration.”
- Successful update: “Default wardrobe set updated successfully.”
- Category missing: “Category is required to approve this item.”
- Approved: “Default wardrobe item approved successfully.”
- Rejected: “Item rejected and removed from default list.”

## Edge Cases
- AI misclassifies category
- Multiple admins reviewing same item
- Admin approves without reviewing all extracted items
- Session expiry during review
- Admin edits while refresh job running

---

## Acceptance Criteria (Overall)
- Admin can view listing with correct filters, pagination, statuses
- Admin can upload image(s) and AI is triggered automatically
- Invalid images are rejected with exact message
- AI processed items go to review stage
- Admin can correct AI tags
- Approve activates item; Reject excludes item
- Bulk extracted items can be approved independently
- Updates affect future suggestions only