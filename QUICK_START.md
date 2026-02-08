# 🚀 ROYALIFY - QUICK START GUIDE

**Status**: ✅ Ready to Run  
**Date**: February 3, 2026

---

## 📋 REQUIREMENTS

- Node.js (v14+)
- npm or yarn
- SQLite (comes with Prisma)

---

## 🔧 SETUP INSTRUCTIONS

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup database (if first time)
npx prisma migrate deploy

# Start server
npm start
```

**Expected output:**
```
ROYALIFY server listening on port 4000
```

### 2. Frontend Setup (New Terminal)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173/
```

---

## 🌐 ACCESSING THE APPLICATION

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:4000/api
3. **Health Check**: http://localhost:4000/api/health

---

## 🔑 TEST CREDENTIALS

### Test Account 1
- **Email**: user@example.com
- **Password**: password123

### Test Account 2 (Premium)
- **Email**: premium@example.com
- **Password**: password123

---

## ✅ VERIFICATION CHECKLIST

After starting both servers, verify:

1. **Frontend loads**: Visit http://localhost:5173
2. **API responds**: Check http://localhost:4000/api/health
3. **Can register**: Create new account
4. **Can login**: Login with test credentials
5. **Can browse products**: Home page shows product grid
6. **Can add to cart**: Click product, add to cart
7. **Can checkout**: Complete order with form
8. **Can view orders**: Check profile page

---

## 🔑 ENVIRONMENT VARIABLES

### Backend (.env already configured)
```
DATABASE_URL="file:D:/Coding/ROYALIFY/server/prisma/dev.db"
JWT_SECRET="your_jwt_secret_key_change_this"
PORT=4000
```

### Frontend (Vite auto-detects)
- Default API: `http://localhost:4000/api`
- Override with: `VITE_API_URL` environment variable

---

## 📚 AVAILABLE SCRIPTS

### Backend
```bash
npm start        # Run server
npm run dev      # Run with hot-reload (nodemon)
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🗄️ DATABASE

- **Type**: SQLite
- **Location**: `server/prisma/dev.db`
- **Schema**: `server/prisma/schema.prisma`
- **ORM**: Prisma

### Reset Database
```bash
cd server
npx prisma migrate reset
```

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Kill process on port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4000 | xargs kill -9
```

### Database Connection Error
```bash
cd server
npx prisma db push
```

### API Not Responding
- Check if server is running on port 4000
- Verify .env file has DATABASE_URL
- Check terminal for error messages

### CORS Errors
- Ensure backend is running
- Check API URL in client (should be http://localhost:4000/api)
- Verify CORS is enabled in app.js

---

## 📊 PROJECT STRUCTURE

```
ROYALIFY/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 8 main pages
│   │   ├── components/    # Reusable components
│   │   └── context/       # State management
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication
│   ├── prisma/          # Database
│   └── package.json
└── Documentation/        # All docs and guides
```

---

## 🎯 FEATURES TO TEST

1. **Authentication**: Register → Login → Logout
2. **Shopping**: Browse → Add to Cart → Checkout → Order
3. **Reviews**: Buy product → Submit review → See rating
4. **Premium**: Upgrade account → Access admin dashboard
5. **Admin**: Create/edit/delete products (if premium)
6. **Profile**: View order history and personal reviews
7. **Wishlist**: Add/remove from wishlist
8. **Responsive**: Test on different screen sizes

---

## 📞 SUPPORT

**Issues?** Check:
1. Console (F12) for error messages
2. Network tab for API response
3. Terminal for server logs
4. FINALIZATION_CHECKLIST.md for detailed info
5. README.md for full documentation

---

## ✨ NEXT STEPS

After verification:
1. Explore the codebase
2. Try all features
3. Review presentation script
4. Prepare for campus presentation
5. Consider deployment

---

**Everything is ready to go! 🚀👑**
