# Student Era MERN Stack Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing student internships and certificates.

## 🚀 Deployment on Vercel

### Prerequisites

- Vercel account
- MongoDB Atlas account
- GitHub repository

### Step-by-Step Deployment Process

#### 1. Prepare Your Repository

- Ensure all code is committed to your GitHub repository
- Make sure environment variables are properly configured

#### 2. Deploy Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:

   - **Framework Preset**: Node.js
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables:

   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
   - Add any other environment variables from your `config.env`

6. Deploy the backend

#### 3. Deploy Frontend to Vercel

1. Create another project in Vercel
2. Import the same GitHub repository
3. Configure the project:

   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. Add Environment Variables:

   - `REACT_APP_API_URL`: Your backend Vercel URL (e.g., `https://your-backend.vercel.app`)

5. Deploy the frontend

#### 4. Update API URLs

After deployment, update the frontend API calls to use the new backend URL.

### Environment Variables Required

#### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5000
```

#### Frontend (.env)

```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Project Structure

```
STUDENT ERA MERN/
├── backend/          # Node.js/Express API
├── frontend/         # React.js Frontend
├── vercel.json       # Vercel configuration
└── README.md
```

### Features

- User authentication and authorization
- Internship management
- Certificate generation
- Task management
- Payment processing
- Admin dashboard
- Student dashboard

### Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer
- **PDF Generation**: PDFKit

### Support

For deployment issues, check the Vercel documentation or contact the development team.
