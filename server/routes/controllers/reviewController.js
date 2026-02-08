const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Submit a review for a product
exports.submitReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.userId; // From auth middleware

    if (!productId || !rating || !title) {
      return res.status(400).json({ message: 'Missing required fields: productId, rating, title' });
    }

    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const normalizedComment = typeof comment === 'string' ? comment.trim() : '';

    if (!normalizedTitle) {
      return res.status(400).json({ message: 'Review title cannot be empty' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user purchased this product
    const orders = await prisma.order.findMany({
      where: { userId, status: 'completed' }
    });

    let hasPurchased = false;
    for (const order of orders) {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items) && items.some(item => item.id === productId)) {
        hasPurchased = true;
        break;
      }
    }

    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'You can only review products you have purchased',
        requiresPurchase: true
      });
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    let review;
    if (existing) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, title: normalizedTitle, comment: normalizedComment }
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: { userId, productId, rating, title: normalizedTitle, comment: normalizedComment }
      });
    }

    // Recalculate product rating and quietly skip if product record not in catalogue
    const aggregates = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (product && aggregates._avg.rating !== null) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Math.round(aggregates._avg.rating * 10) / 10,
          reviews: aggregates._count.rating
        }
      });
    }

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.userId;

    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};

// Check if user can review a product (has purchased it)
exports.canUserReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // For now, we'll allow anyone to review
    // In a real app, you'd check if they have a completed order containing this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    res.json({ 
      canReview: true, 
      hasReviewed: !!existingReview,
      existingReview: existingReview || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking review eligibility', error: error.message });
  }
};
