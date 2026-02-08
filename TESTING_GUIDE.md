  # 🧪 ROYALIFY Review System - Testing Guide

## Prerequisites
- Backend running: `node server.js` on port 4000
- Frontend running: `npm run dev` on port 5173
- Database: SQLite at `D:/Coding/ROYALIFY/server/prisma/prisma/dev.db`

---

## Manual Testing Flow

### Test 1: Login
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"
4. ✅ Should redirect to home page
5. ✅ Token should be saved to localStorage

### Test 2: Browse Products
1. Navigate to home page or `/shop`
2. ✅ Should see products list
3. ✅ Products should display rating and review count
4. Click on any product to go to detail page

### Test 3: Submit Your First Review
1. On product detail page
2. Scroll down to "Customer Reviews" section
3. Click "Write a Review" button
4. ✅ Form should appear with:
   - 5-star rating selector
   - Title input field
   - Comment textarea
5. Click on stars to select rating (e.g., 5 stars = all gold)
6. Enter title: "Amazing product!"
7. Enter comment: "This is fantastic!"
8. Click "Submit Review"
9. ✅ Should see success alert
10. ✅ Review should appear in list immediately
11. ✅ Product average rating should update

### Test 4: View Submitted Review
1. Your review should now be in the list
2. ✅ Should show:
   - Gold stars matching your rating
   - Your title
   - Your comment (if provided)
   - Today's date

### Test 5: Update Your Review
1. On same product detail page
2. Click "Write a Review" again
3. Change rating to 4 stars
4. Change title to "Very Good Product"
5. Click "Submit Review"
6. ✅ Should see success alert
7. ✅ Review should update (not duplicate)
8. ✅ Product rating should recalculate

### Test 6: Check Rating Update
1. Go back to home page
2. Find the product you reviewed
3. ✅ Product card should show new average rating
4. ✅ Review count should be updated

### Test 7: View Other Products
1. Navigate to another product detail page
2. Scroll to reviews section
3. ✅ Should show existing reviews (if any)
4. ✅ Should show review count
5. Click "Write a Review"
6. Submit a review with different rating
7. ✅ This product should now have your review

### Test 8: Logout and Test Auth
1. Logout from the application
2. Navigate to a product detail page
3. Scroll to reviews section
4. Click "Write a Review" area
5. ✅ Should see message: "Sign in to write a review"
6. Click the "Sign in" link
7. ✅ Should redirect to login page

### Test 9: Login as Different User
1. Login with different credentials (if available)
2. Navigate to product you previously reviewed
3. ✅ Should see your first review in list
4. Click "Write a Review"
5. ✅ You should be able to submit a DIFFERENT review
6. ✅ Product should show 2 reviews now
7. Submit review with 3 stars
8. ✅ Average rating should recalculate (e.g., (5+3)/2 = 4.0)

---

## Edge Case Testing

### Test 10: Invalid Rating Values
1. Try to access API with invalid rating:
   ```
   POST /api/reviews
   {
     productId: "product1",
     rating: 6,  // Invalid! Should be 1-5
     title: "Test"
   }
   ```
2. ✅ Should return 400 error: "Rating must be between 1 and 5"

### Test 11: Missing Required Fields
1. Try submitting without title:
   ```
   POST /api/reviews
   {
     productId: "product1",
     rating: 5,
     // title missing!
     comment: "No title"
   }
   ```
2. ✅ Should return 400 error: "Missing required fields"

### Test 12: Unauthenticated Request
1. Try to submit review without token:
   ```
   POST /api/reviews
   ```
2. ✅ Should return 401 error: "Unauthorized"

### Test 13: Invalid Token
1. Send request with fake token:
   ```
   Authorization: Bearer INVALID_TOKEN_HERE
   ```
2. ✅ Should return 401 error: "Invalid token"

---

## API Testing with cURL

### Login to Get Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response should include a JWT token.

### Submit Review
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId":"product1",
    "rating":5,
    "title":"Excellent product!",
    "comment":"Highly recommended"
  }'
```

### Get Product Reviews
```bash
curl http://localhost:4000/api/reviews/product/product1
```

### Get User's Reviews
```bash
curl http://localhost:4000/api/reviews/user/my-reviews \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check Review Eligibility
```bash
curl http://localhost:4000/api/reviews/check/product1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Database Verification

### Check Reviews in Database
```bash
sqlite3 D:/Coding/ROYALIFY/server/prisma/prisma/dev.db

# List all reviews
SELECT id, userId, productId, rating, title, createdAt FROM Review;

# Check specific product's reviews
SELECT * FROM Review WHERE productId = 'product1';

# Check product's updated rating
SELECT id, name, rating, reviews FROM Product WHERE id = 'product1';
```

---

## Expected Results

### Successful Review Submission
```json
{
  "message": "Review submitted successfully",
  "review": {
    "id": "review-uuid",
    "userId": 1,
    "productId": "product1",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "Highly recommended",
    "createdAt": "2025-01-28T10:30:00Z",
    "updatedAt": "2025-01-28T10:30:00Z"
  }
}
```

### Product with Reviews
```json
{
  "id": "product1",
  "name": "Product Name",
  "rating": 4.5,
  "reviews": 2,
  "reviews_data": [
    {
      "id": "review1",
      "userId": 1,
      "rating": 5,
      "title": "Great!",
      "comment": "Love it",
      "createdAt": "2025-01-28T10:00:00Z"
    },
    {
      "id": "review2",
      "userId": 2,
      "rating": 4,
      "title": "Good",
      "comment": "Nice product",
      "createdAt": "2025-01-28T11:00:00Z"
    }
  ]
}
```

---

## Performance Checklist
- ✅ Review submission completes in <2 seconds
- ✅ Review list loads without delay
- ✅ Rating calculation is accurate
- ✅ No database errors in console
- ✅ No frontend errors in browser console
- ✅ Forms submit without lag
- ✅ UI updates immediately after submission

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Unable to connect to server" | Ensure `node server.js` is running on port 4000 |
| Token not saving | Check localStorage is enabled in browser |
| Review not appearing | Check browser console for API errors |
| Wrong average rating | Verify all reviews are included in calculation |
| Form won't submit | Check authentication token is valid |
| Date format wrong | Verify timezone in browser settings |

---

## Test Completion Checklist
- [ ] Can login successfully
- [ ] Can submit review with all fields
- [ ] Can submit review with optional comment
- [ ] Average rating calculates correctly
- [ ] Review appears in list immediately
- [ ] Can update existing review
- [ ] Can view reviews without login
- [ ] Cannot submit review without login
- [ ] Star ratings display correctly
- [ ] Dates format correctly
- [ ] Product card shows updated rating
- [ ] Review count is accurate

---

**All tests passing = System Ready for Production ✅**
