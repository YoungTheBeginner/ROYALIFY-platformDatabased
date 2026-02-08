const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.listProducts = async (req, res) => {
  try {
    const { limited } = req.query;
    let where = { published: true }; // Only show published products by default
    if (limited === 'true') {
      where.limited = true;
    }
    // Sort by rating (highest first), then by creation date (newest first)
    const products = await prisma.product.findMany({ 
      where,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Get reviews for this product
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ ...product, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Admin: Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, currency, desc, image, limited, stock, tags, published } = req.body;

    if (!name || !price || !currency || !desc || !image || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        currency,
        desc,
        image,
        limited: limited || false,
        stock: parseInt(stock),
        tags: tags || '',
        published: published !== false
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, currency, desc, image, limited, stock, tags, published } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseInt(price);
    if (currency !== undefined) updateData.currency = currency;
    if (desc !== undefined) updateData.desc = desc;
    if (image !== undefined) updateData.image = image;
    if (limited !== undefined) updateData.limited = limited;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (tags !== undefined) updateData.tags = tags;
    if (published !== undefined) updateData.published = published;

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Admin: Get all products (including unpublished)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
