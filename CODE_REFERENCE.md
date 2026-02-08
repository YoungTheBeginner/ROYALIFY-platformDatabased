# 📋 ROYALIFY Review System - Code Reference

## Overview
Complete buyer review system implementation with 5-star ratings, review storage, and automatic average calculation.

---

## Key Files Reference

### 1. Database Schema
**File**: `server/prisma/schema.prisma`
```prisma
model Review {
  id        String   @id @default(cuid())
  userId    Int
  productId String
  rating    Int      // 1-5 stars
  title     String
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}

model Product {
  // ... existing fields ...
  rating    Float    @default(0)   // Average rating
  reviews   Int      @default(0)   // Review count
}
```

### 2. Backend Routes
**File**: `server/routes/reviews.js`
```javascript
const express = require('express');
const router = express.Router();
const controller = require('./controllers/reviewController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, controller.submitReview);
router.get('/product/:productId', controller.getProductReviews);
router.get('/user/my-reviews', verifyToken, controller.getUserReviews);
router.get('/check/:productId', verifyToken, controller.canUserReview);

module.exports = router;
```

### 3. Backend Controller
**File**: `server/routes/controllers/reviewController.js`

**submitReview Function**:
- Creates or updates review
- Validates rating (1-5)
- Recalculates product average rating
- Updates review count

**getProductReviews Function**:
- Returns array of reviews for product
- Sorted by newest first
- Public access (no auth required)

**getUserReviews Function**:
- Returns user's own reviews
- Requires authentication
- Used for user dashboard/profile

**canUserReview Function**:
- Checks if user has already reviewed product
- Returns eligibility status
- Requires authentication

### 4. Frontend Component
**File**: `client/src/components/ProductDetail.jsx`

**State Management**:
```javascript
const [reviews, setReviews] = useState([]);
const [showReviewForm, setShowReviewForm] = useState(false);
const [userReview, setUserReview] = useState({
  rating: 5,
  title: '',
  comment: ''
});
const [loading, setLoading] = useState(false);
const [user, setUser] = useState(null);
```

**Key Functions**:
```javascript
// Fetch reviews for product
const fetchReviews = async () => {
  const response = await API.get(`/reviews/product/${id}`);
  setReviews(response.data || []);
};

// Submit review
const handleSubmitReview = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const response = await API.post('/reviews', {
    productId: id,
    ...userReview
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  await fetchReviews();
};

// Convert number to stars
const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => 
    i < rating ? '★' : '☆'
  ).join('');
};
```

**UI Components**:
- Star rating selector: `[1,2,3,4,5].map(star => <span onClick>★</span>)`
- Review form: Title input + comment textarea
- Review list: Maps reviews with star display and date formatting

### 5. App Registration
**File**: `server/app.js`
```javascript
const reviewsRouter = require('./routes/reviews');
app.use('/api/reviews', reviewsRouter);
```

---

## Data Flow Diagram

```
User (Frontend)
    ↓
ProductDetail Component
    ├→ fetchReviews() → GET /api/reviews/product/:productId
    └→ handleSubmitReview() → POST /api/reviews
            ↓
    Express Router (reviews.js)
            ↓
    Review Controller Functions
            ├→ submitReview() [auth middleware]
            ├→ getProductReviews()
            ├→ getUserReviews() [auth middleware]
            └→ canUserReview() [auth middleware]
            ↓
    Prisma ORM
            ↓
    SQLite Database
            ├→ Review table
            └→ Product table (rating, reviews count)
```

---

## Request/Response Examples

### POST /api/reviews - Submit Review
**Request**:
```json
{
  "productId": "clump1a2b3c",
  "rating": 5,
  "title": "Amazing Quality!",
  "comment": "Best purchase ever. Highly recommended!"
}
```

**Response (201)**:
```json
{
  "message": "Review submitted successfully",
  "review": {
    "id": "review-uuid",
    "userId": 1,
    "productId": "clump1a2b3c",
    "rating": 5,
    "title": "Amazing Quality!",
    "comment": "Best purchase ever...",
    "createdAt": "2025-01-28T10:30:00Z",
    "updatedAt": "2025-01-28T10:30:00Z"
  }
}
```

### GET /api/reviews/product/:productId - Fetch Reviews
**Response (200)**:
```json
[
  {
    "id": "review1",
    "userId": 1,
    "productId": "clump1a2b3c",
    "rating": 5,
    "title": "Amazing!",
    "comment": "Love it!",
    "createdAt": "2025-01-28T10:00:00Z",
    "updatedAt": "2025-01-28T10:00:00Z"
  },
  {
    "id": "review2",
    "userId": 2,
    "productId": "clump1a2b3c",
    "rating": 4,
    "title": "Good",
    "comment": "Nice product",
    "createdAt": "2025-01-28T11:00:00Z",
    "updatedAt": "2025-01-28T11:00:00Z"
  }
]
```

### GET /api/reviews/check/:productId - Check Eligibility
**Response (200)**:
```json
{
  "canReview": false,
  "hasReviewed": true,
  "existingReview": {
    "id": "review1",
    "rating": 5,
    "title": "Amazing!",
    "comment": "Love it!"
  }
}
```

---

## Error Responses

### 400 Bad Request - Invalid Rating
```json
{
  "message": "Rating must be between 1 and 5"
}
```

### 400 Bad Request - Missing Fields
```json
{
  "message": "Missing required fields: productId, rating, title"
}
```

### 401 Unauthorized - No Token
```json
{
  "message": "No token provided"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "message": "Invalid token"
}
```

### 500 Server Error
```json
{
  "message": "Error submitting review",
  "error": "Error details here"
}
```

---

## Environment Variables Required

**`.env` (Server)**:
```
DATABASE_URL="file:D:/Coding/ROYALIFY/server/prisma/prisma/dev.db"
JWT_SECRET="your_jwt_secret_key_change_this"
PORT=4000
```

**`.env.local` (Client)**:
```
VITE_API_URL=http://localhost:4000/api
```

---

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Server returns JWT token
3. Client stores token in `localStorage`
4. Client includes token in API header: `Authorization: Bearer {token}`
5. Server middleware (`verifyToken`) extracts userId from token
6. Review API uses userId for associating reviews

---

## Rating Calculation Algorithm

```javascript
// In reviewController.submitReview()

// After creating/updating review:
const reviews = await prisma.review.findMany({ where: { productId } });

// Calculate average
const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

// Round to 1 decimal
const roundedRating = Math.round(avgRating * 10) / 10;

// Update product
await prisma.product.update({
  where: { id: productId },
  data: {
    rating: roundedRating,
    reviews: reviews.length
  }
});
```

**Example**:
- Reviews: [5, 4, 3]
- Sum: 12
- Count: 3
- Average: 4.0
- Rounded: 4.0
- Result: Product.rating = 4.0

---

## Unique Constraint Impact

```javascript
@@unique([userId, productId])
```

This constraint ensures:
- ✅ User can only have ONE review per product
- ✅ Attempting to create duplicate returns unique constraint error
- ✅ Can update review by using same userId + productId
- ✅ No duplicate reviews in database

---

## Frontend Styling

**Star Display**:
```javascript
// Gold stars: ★ (full)
// Empty stars: ☆ (outline)
// Color: #d4af37 (golden)
```

**Form Styling**:
- Gold gradient buttons
- Dark theme inputs with golden border
- Responsive layout
- Smooth transitions

**Review Cards**:
- Dark background with subtle border
- Gold left accent line
- Formatted dates
- Clean typography

---

## Performance Optimizations

1. **Server-side Calculation**: Average rating calculated on server (accurate)
2. **Database Indexing**: Unique constraint on userId_productId for fast lookups
3. **Sorted Results**: Reviews sorted by date in query (not in code)
4. **Minimal Payload**: Only necessary fields returned
5. **Error Handling**: Proper HTTP status codes
6. **Token Validation**: Quick JWT verification

---

## Security Measures

1. **JWT Authentication**: Validates token on protected routes
2. **User Association**: Reviews tied to authenticated user ID
3. **Input Validation**: Rating must be 1-5
4. **Unique Constraint**: Prevents duplicate reviews
5. **HTTPS Ready**: Middleware ready for SSL/TLS
6. **CORS Enabled**: Controlled cross-origin requests

---

## Summary

**Total New Code**:
- Backend: ~150 lines (routes + controller)
- Frontend: ~250 lines (component rewrite)
- Database: 1 new model with 7 fields
- API: 4 new endpoints

**Integration Points**:
- App.js: 2 lines (import + use)
- ProductDetail: Complete rewrite
- Database: New Review model + Product fields

**Features Delivered**:
- ✅ 5-star rating system
- ✅ Review submission
- ✅ Auto-calculation of average ratings
- ✅ Review list display
- ✅ User authentication integration
- ✅ Error handling
- ✅ Responsive UI

