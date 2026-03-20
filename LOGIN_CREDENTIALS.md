# Admin Panel - Login Credentials

## Test Accounts

### 1. Super Admin Account
- **Email:** `admin@example.com`
- **Password:** `Admin@123`
- **Role:** Super Admin
- **Status:** Active
- **Permissions:** Full access to all features

### 2. Sub Admin Account
- **Email:** `subadmin@example.com`
- **Password:** `SubAdmin@123`
- **Role:** Sub Admin
- **Status:** Active
- **Permissions:** Limited access (users:read, posts:read, reports:read)

### 3. Inactive Account (Test Error)
- **Email:** `inactive@example.com`
- **Password:** `Inactive@123`
- **Status:** Inactive
- **Expected Error:** "Your account is inactive."

### 4. Locked Account (Test Error)
- **Email:** `locked@example.com`
- **Password:** `Locked@123`
- **Status:** Locked
- **Expected Error:** "Your account is locked. Please reset your password."

---

## Login Features

### Fields
- ✅ Email Address (mandatory, validated for proper format)
- ✅ Password (mandatory, masked with show/hide toggle)

### Actions
- ✅ Login button (Primary CTA)
- ✅ Forgot Password link (placeholder functionality)

### Validations & Error Messages
- ✅ Missing fields → "Required fields are missing."
- ✅ Invalid email format → "Please enter a valid email address."
- ✅ Incorrect credentials → "Invalid email or password."
- ✅ Inactive account → "Your account is inactive."
- ✅ Account locked → "Your account is locked. Please reset your password."

### Security Features
- ✅ Session token stored in localStorage
- ✅ Automatic authentication check on page load
- ✅ Secure logout functionality
- ✅ Password masking with toggle visibility
- ✅ Form validation before submission

### User Experience
- ✅ Loading state during authentication
- ✅ Success toast notification on login
- ✅ Clear error messages with icons
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support
- ✅ Smooth transitions and animations

---

## Technical Implementation

### Authentication Flow
1. User enters credentials and submits form
2. Client-side validation checks for required fields and email format
3. Credentials sent to mock authentication service (simulates API call)
4. Authentication service validates credentials and checks account status
5. On success:
   - Session token generated and stored
   - User data stored in localStorage
   - User redirected to dashboard
   - Navigation rendered based on role permissions
6. On failure:
   - Specific error message displayed based on error type
   - Form remains editable for correction

### State Management
- **AuthContext:** Manages global authentication state
- **localStorage:** Persists session token and user data
- **Role-based rendering:** Sidebar navigation adapts to user role

### Mock Users
The authentication system currently uses mock users for demonstration. In production, this would connect to a real backend API.

---

## How to Test

1. **Successful Login:**
   - Use `admin@example.com` / `Admin@123`
   - Should redirect to dashboard with success message

2. **Sub Admin Login:**
   - Use `subadmin@example.com` / `SubAdmin@123`
   - Navigation should show limited menu items based on permissions

3. **Invalid Email Format:**
   - Try entering `notanemail` in email field
   - Should show "Please enter a valid email address."

4. **Missing Fields:**
   - Leave both fields empty and click Login
   - Should show "Required fields are missing."

5. **Incorrect Password:**
   - Use `admin@example.com` / `WrongPassword`
   - Should show "Invalid email or password."

6. **Inactive Account:**
   - Use `inactive@example.com` / `Inactive@123`
   - Should show "Your account is inactive."

7. **Locked Account:**
   - Use `locked@example.com` / `Locked@123`
   - Should show "Your account is locked. Please reset your password."

8. **Logout:**
   - Click logout from the header dropdown
   - Should return to login screen with info message

---

## Future Enhancements

- [ ] Implement "Forgot Password" functionality
- [ ] Add "Remember Me" option
- [ ] Implement two-factor authentication (2FA)
- [ ] Add session timeout (30 minutes inactivity)
- [ ] Connect to real backend API (Supabase)
- [ ] Add login attempt tracking and lockout after failed attempts
- [ ] Implement password strength requirements
- [ ] Add CAPTCHA for security
