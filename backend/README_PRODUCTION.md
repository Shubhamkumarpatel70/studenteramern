Production deployment notes

Required environment variables

- NODE_ENV=production
- PORT (optional, default 5000)
- MONGO_URI - MongoDB connection string
- JWT_SECRET - secret for signing JWTs
- FRONTEND_URL - https://studentera.live (used in email links)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS - for sending emails (used by nodemailer)
- CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/KEY/SECRET if you use cloudinary for uploads

Recommended packages to install (backend)

Run in backend folder:

npm install helmet compression express-rate-limit express-mongo-sanitize xss-clean hpp morgan

These provide security headers, compression, rate limiting, sanitization, and logging.

Start commands

# Development

npm run dev

# Production (example using node directly)

NODE_ENV=production PORT=5000 FRONTEND_URL=https://studentera.live node server.js

Or use a process manager (recommended):

# with pm2

npm install -g pm2
pm2 start server.js --name studenteramern-backend --env production

Notes

- The backend will serve the frontend static build when NODE_ENV=production and a build is present in ../frontend/build.
- Set FRONTEND_URL to your production frontend address (https://studentera.live) so emails (password reset, confirmation) link directly to the SPA.
- Ensure cookies are transmitted securely by running over HTTPS. The server sets cookie.secure in production when issuing JWT cookie.
- Consider adding central logging (e.g., LogDNA, Papertrail) and monitoring for production readiness.
