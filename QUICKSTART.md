# 🌟 ROYALIFY Review System - Quick Start

## What Was Built
A complete buyer review system where customers can:
- Rate products on a 5-star scale
- Write review titles and detailed comments
- View all reviews for a product
- Update their existing reviews
- See automatically calculated average ratings

---

## Quick Setup

### Start the Servers

**Terminal 1 - Backend**:
```bash
cd D:\Coding\ROYALIFY\server
node server.js
```
Expected: `ROYALIFY server listening on port 4000`

**Terminal 2 - Frontend**:
```bash
cd D:\Coding\ROYALIFY\client
npm run dev
```
Expected: `Local: http://localhost:5173/`

### Test the System

1. **Open Browser**: http://localhost:5173
2. **Login**: 
   - Email: `test@example.com`
   - Password: `password123`
3. **Find a Product**: Click any product
4. **Write Review**:
   - Click "Write a Review" button
   - Click stars to rate (1-5)
   - Enter review title
   - Enter optional comment
   - Click "Submit Review"
5. **Verify**: Review appears immediately and product rating updates

---

## Key Features

| Feature | Status |
|---------|--------|
| 5-star rating | ✅ Complete |
| Review submission | ✅ Complete |
| Review display | ✅ Complete |
| Average rating calculation | ✅ Complete |
| User authentication | ✅ Complete |
| Update reviews | ✅ Complete |
| Error handling | ✅ Complete |
| Golden theme styling | ✅ Complete |

---

## API Endpoints

```
POST   /api/reviews                    → Submit/update review
GET    /api/reviews/product/:id        → Get product reviews
GET    /api/reviews/user/my-reviews    → Get user's reviews
GET    /api/reviews/check/:id          → Check review eligibility
```

---

## Database

- **Type**: SQLite
- **Location**: `D:/Coding/ROYALIFY/server/prisma/prisma/dev.db`
- **Status**: ✅ Synchronized with schema
- **Review Table**: Stores rating, title, comment, userId, productId

---

## Files Created/Modified

**New Files**:
- `server/routes/reviews.js` - API routes
- `server/routes/controllers/reviewController.js` - Business logic

**Modified Files**:
- `server/prisma/schema.prisma` - Added Review model
- `server/app.js` - Registered review routes
- `client/src/components/ProductDetail.jsx` - Added review UI

---

## Documentation

- **`REVIEW_SYSTEM_DOCS.md`** - Complete technical docs
- **`IMPLEMENTATION_SUMMARY.md`** - Feature summary
- **`TESTING_GUIDE.md`** - How to test the system
- **`CODE_REFERENCE.md`** - Code examples and API docs
- **`STATUS.md`** - Current system status

---

## Common Tasks

### Check Server Status
```bash
curl http://localhost:4000/api/health
```
Response: `{"status":"ok"}`

### Get Product with Reviews
```bash
curl http://localhost:4000/api/products/[productId]
```

### Login to Get Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Submit Review
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"productId":"[id]","rating":5,"title":"Great!","comment":"Love it"}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 4000 in use | Kill: `Get-Process -Name node \| Stop-Process -Force` |
| Port 5173 in use | Kill: `Get-Process -Name node \| Stop-Process -Force` |
| Database error | Check: `D:/Coding/ROYALIFY/server/.env` has correct DATABASE_URL |
| API not responding | Verify server running on port 4000 |
| Reviews not saving | Check token in localStorage (browser DevTools) |
| Star ratings not showing | Clear browser cache, hard refresh (Ctrl+Shift+R) |

---

## Architecture

```
Frontend (React + Vite)
    ↓
ProductDetail Component (Review UI)
    ↓
API Client (axios)
    ↓
Backend (Express.js)
    ↓
Routes (reviews.js)
    ↓
Controller (reviewController.js)
    ↓
Database (SQLite + Prisma)
```

---

## System Requirements

- Node.js v22+
- npm or yarn
- SQLite (included with Prisma)
- Browser with JavaScript enabled

---

## Authentication

Reviews require JWT authentication:
- Token stored in `localStorage` after login
- Sent in `Authorization: Bearer {token}` header
- Validated by `verifyToken` middleware on server
- User ID extracted from token for review association

---

## Rating Calculation

**Automatic**: When review is submitted:
1. Review saved to database
2. All reviews for product fetched
3. Average calculated: `sum / count`
4. Rounded to 1 decimal: `Math.round(avg * 10) / 10`
5. Product rating updated
6. Review count updated

**Example**: 3 reviews (5★, 4★, 3★) = 4.0 average

---

## Next Steps (Optional)

- [ ] Add review moderation
- [ ] Add review pagination
- [ ] Add review photos
- [ ] Add review deletion
- [ ] Add helpful votes
- [ ] Add admin dashboard
- [ ] Add review analytics

---

## Support

For detailed information, see:
- **Technical Details**: See `CODE_REFERENCE.md`
- **Testing Instructions**: See `TESTING_GUIDE.md`
- **Feature Overview**: See `IMPLEMENTATION_SUMMARY.md`
- **Complete Docs**: See `REVIEW_SYSTEM_DOCS.md`

---

**Status**: ✅ Production Ready  
**Last Updated**: 2025-01-28  
**Version**: 1.0
