# TODO: Fix Multiple Issues

## 1. Payment Option Tracking in Applications

- [x] Add paymentOptionId field to Application model
- [x] Update PaymentPage.js to store selected payment option ID
- [x] Update InternshipRegistrations.js to display payment option details (UPI ID and display name)
- [x] Update backend controllers to populate paymentOptionId

## 2. Fix ManageMeetings.js Error

- [x] Fix "Cannot read properties of undefined (reading 'type')" error in ManageMeetings.js:186
- [x] Update Meeting model or frontend to handle target structure correctly
- [x] Fix 404 error for manage-meetings route

## 3. Fix Account Deletion Requests

- [x] Debug "Failed to fetch deletion requests" error in admin/coadmin dashboards
- [x] Check API endpoint and authentication
- [x] Fixed API endpoint URLs in DeletionRequests.js (removed leading slash since baseURL already includes /api)

## 4. Remove Color Gradients from User Dashboard

- [x] Remove all bg-gradient classes from user dashboard components
- [x] Replace with solid colors for consistent UI
- [x] Update DashboardHome.js, Sidebar.js, and other dashboard components
- [x] Verified no bg-gradient classes found in specified dashboard files

## 5. Testing

- [ ] Test all fixes to ensure functionality works correctly
- [ ] Verify admin dashboard shows payment details
- [ ] Verify meetings management works without errors
- [ ] Verify deletion requests load properly
- [ ] Verify user dashboard has no gradients
