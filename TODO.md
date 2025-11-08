# TODO: Fix Axios Timeout Issues

## Tasks

- [x] Increase default API timeout in frontend/src/config/api.js from 30s to 60s
 - [x] Add retry logic with exponential backoff to fetchAnnouncements in Home.js (up to 3 retries)
- [x] Add retry logic with exponential backoff to fetchInternships in Home.js (up to 3 retries)
- [x] Add retry logic with exponential backoff to fetchTestimonials in Home.js (up to 3 retries)
- [x] Test the app to verify timeouts are resolved
- [ ] If issues persist, check backend performance or network
