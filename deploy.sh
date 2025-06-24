#!/bin/bash

echo "🚀 Starting Student Era MERN Stack Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first."
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

echo "📝 Committing changes..."
git add .
git commit -m "Prepare for Vercel deployment"

echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Create a new project and import your GitHub repository"
echo "3. Deploy backend first with root directory: backend"
echo "4. Deploy frontend with root directory: frontend"
echo "5. Add environment variables as specified in README.md"
echo ""
echo "🔗 Your repository: $(git remote get-url origin)"
echo "📚 Check README.md for detailed deployment instructions" 