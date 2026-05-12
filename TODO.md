# Task: Fix "Could not fetch meetings" error

## Steps to Complete:

### 1. Update backend/middleware/auth.js

- Add validation after User.findById to return 401 if req.user is null.
  **Status: Completed**

### 2. Update backend/controllers/meetings.js

- Add early validation for user and user.id.
- Wrap user-role Application.find in try-catch.
  **Status: Completed**

### 3. Test the fix

- Backend: no 500 on /api/meetings for user role.
- Frontend: no "Could not fetch meetings."
  **Status: Completed**

Progress: 3/3 completed
