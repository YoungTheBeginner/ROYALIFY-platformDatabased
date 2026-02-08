const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testReviewSystem() {
  try {
    console.log('🧪 Testing Review System\n');

    // 1. Login
    console.log('1️⃣ Logging in...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;
    console.log(`✅ Logged in as user ${userId}`);
    console.log(`Token: ${token.substring(0, 20)}...\n`);

    // 2. Get products
    console.log('2️⃣ Fetching products...');
    const productsRes = await axios.get(`${API_BASE}/products`);
    const productId = productsRes.data[0].id;
    console.log(`✅ Got products. Testing with product ID: ${productId}\n`);

    // 3. Submit review
    console.log('3️⃣ Submitting review...');
    const reviewRes = await axios.post(
      `${API_BASE}/reviews`,
      {
        productId,
        rating: 5,
        title: 'Amazing product!',
        comment: 'This is the best product I have ever used. Highly recommend!'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ Review submitted:', reviewRes.data);
    console.log();

    // 4. Fetch reviews for product
    console.log('4️⃣ Fetching reviews for product...');
    const getReviewsRes = await axios.get(
      `${API_BASE}/reviews/product/${productId}`
    );
    console.log(`✅ Got ${getReviewsRes.data.length} reviews for product:`);
    console.log(JSON.stringify(getReviewsRes.data, null, 2));
    console.log();

    // 5. Get product details (should include reviews)
    console.log('5️⃣ Fetching product details with reviews...');
    const productDetailRes = await axios.get(
      `${API_BASE}/products/${productId}`
    );
    console.log('✅ Product details:');
    console.log(`- Name: ${productDetailRes.data.name}`);
    console.log(`- Rating: ${productDetailRes.data.rating}`);
    console.log(`- Reviews count: ${productDetailRes.data.reviews.length}`);
    console.log();

    // 6. Check if user can review
    console.log('6️⃣ Checking if user can review product...');
    const canReviewRes = await axios.get(
      `${API_BASE}/reviews/check/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Can review result:', canReviewRes.data);
    console.log();

    // 7. Update review
    console.log('7️⃣ Updating review with 4 stars...');
    const updateRes = await axios.post(
      `${API_BASE}/reviews`,
      {
        productId,
        rating: 4,
        title: 'Very Good Product',
        comment: 'Updated review: Still very good!'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ Review updated:', updateRes.data);
    console.log();

    // 8. Final product check
    console.log('8️⃣ Checking final product rating...');
    const finalRes = await axios.get(`${API_BASE}/products/${productId}`);
    console.log(`✅ Final rating: ${finalRes.data.rating}`);
    console.log(`✅ Total reviews: ${finalRes.data.reviews.length}`);

    console.log('\n✨ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testReviewSystem();
