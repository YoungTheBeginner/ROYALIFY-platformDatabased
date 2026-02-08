const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, customer, total } = req.body;
    const userId = req.userId; // From auth middleware

    if (!items || !customer || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderId,
        userId,
        items: items, // Prisma handles JSON automatically
        customer: customer, // Prisma handles JSON automatically
        total: parseFloat(total),
        status: 'completed'
      }
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const order = await prisma.order.findFirst({
      where: { 
        orderId,
        userId // Ensure user can only see their own orders
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};
