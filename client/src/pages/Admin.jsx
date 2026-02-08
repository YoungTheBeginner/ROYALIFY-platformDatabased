import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import './Admin.css';
import { formatCurrency } from '../utils/currency';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutStep, setLogoutStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limitedOnly, setLimitedOnly] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    desc: '',
    image: '',
    limited: false,
    stock: '',
    tags: '',
    published: true
  });
  const [imageUploadState, setImageUploadState] = useState({
    dragActive: false,
    error: '',
    uploading: false
  });
  const fileInputRef = useRef(null);

  const confirmPublishFlow = () => {
    const firstStep = window.confirm('Publish this product to the Royalify Emporium?');
    if (!firstStep) return false;
    return window.confirm('Final confirmation: make this product visible to every shopper?');
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.isPremium && storedUser.role !== 'admin') {
      navigate('/profile');
      alert('Premium membership required for admin access');
      return;
    }
    setUser(storedUser);
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async (skipLoader = false) => {
    if (!skipLoader) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/products/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(response.data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to public products
      const response = await API.get('/products');
      setProducts(response.data);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    const normalizedValue = name === 'currency' && typeof nextValue === 'string'
      ? nextValue.toUpperCase().slice(0, 3)
      : nextValue;
    setFormData(prev => ({
      ...prev,
      [name]: normalizedValue
    }));
    if (name === 'image') {
      setImageUploadState(prev => ({ ...prev, error: '', uploading: false, dragActive: false }));
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      currency: 'USD',
      desc: '',
      image: '',
      limited: false,
      stock: '',
      tags: '',
      published: true
    });
    setImageUploadState({ dragActive: false, error: '', uploading: false });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: (product.price / 100).toString(),
      currency: product.currency || 'USD',
      desc: product.desc,
      image: product.image,
      limited: product.limited || false,
      stock: product.stock.toString(),
      tags: product.tags || '',
      published: product.published !== false
    });
    setImageUploadState({ dragActive: false, error: '', uploading: false });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPublishing = formData.published && (!editingProduct || editingProduct.published === false);
    if (isPublishing && !confirmPublishFlow()) {
      return;
    }
    if (!formData.image) {
      setImageUploadState(prev => ({ ...prev, error: 'Add product imagery before publishing.' }));
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        price: parseInt(parseFloat(formData.price) * 100),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        // Update existing product
        await API.put(`/products/admin/${editingProduct.id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (isPublishing) {
          alert('Congratulations! Your product is now live in the Royalify Emporium.');
        } else {
          alert('Product updated successfully!');
        }
      } else {
        // Create new product
        await API.post('/products/admin/create', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (formData.published) {
          alert('Congratulations! Your new product is now live in the Royalify Emporium.');
        } else {
          alert('Product saved to drafts.');
        }
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await API.delete(`/products/admin/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + (error.response?.data?.message || error.message));
    }
  };

  const togglePublish = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const nextPublished = !product.published;
      if (nextPublished) {
        if (!confirmPublishFlow()) {
          return;
        }
      } else {
        const confirmDraft = window.confirm('Move this product back to drafts?');
        if (!confirmDraft) {
          return;
        }
      }

      await API.put(`/products/admin/${product.id}`, {
        published: nextPublished
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
      if (nextPublished) {
        alert('Congratulations! This product is now live in the Royalify Emporium.');
      } else {
        alert('Product moved to drafts.');
      }
    } catch (error) {
      alert('Error updating product: ' + error.message);
    }
  };

  const stats = useMemo(() => {
    if (!products.length) {
      return {
        total: 0,
        published: 0,
        drafts: 0,
        limited: 0,
        inventoryValue: 0
      };
    }

    const total = products.length;
    const published = products.filter(product => product.published !== false).length;
    const limited = products.filter(product => product.limited).length;
    const inventoryValue = products.reduce((sum, product) => {
      const numericPrice = Number(product.price);
      const price = Number.isFinite(numericPrice) ? numericPrice / 100 : 0;
      const numericStock = Number(product.stock);
      const stock = Number.isFinite(numericStock) ? numericStock : 0;
      return sum + price * stock;
    }, 0);

    return {
      total,
      published,
      drafts: total - published,
      limited,
      inventoryValue
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter(product => {
      const matchesSearch = !normalizedSearch
        || product.name?.toLowerCase().includes(normalizedSearch)
        || product.tags?.toLowerCase().includes(normalizedSearch)
        || product.desc?.toLowerCase().includes(normalizedSearch);

      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'published' && product.published !== false)
        || (statusFilter === 'draft' && product.published === false);

      const matchesLimited = !limitedOnly || product.limited;

      return matchesSearch && matchesStatus && matchesLimited;
    });
  }, [products, searchTerm, statusFilter, limitedOnly]);

  const userInitials = useMemo(() => {
    if (!user?.name) {
      return 'U';
    }
    return user.name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }, [user]);

  const handleManualRefresh = () => {
    fetchProducts();
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageUploadState({ dragActive: false, error: 'Only image files are supported.', uploading: false });
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageUploadState({ dragActive: false, error: 'Choose an image under 3MB.', uploading: false });
      return;
    }

    setImageUploadState({ dragActive: false, error: '', uploading: true });

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setImageUploadState({ dragActive: false, error: '', uploading: false });
    };
    reader.onerror = () => {
      setImageUploadState({ dragActive: false, error: 'We could not read that file. Try again.', uploading: false });
    };
    reader.readAsDataURL(file);
  };

  const handleImageBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleImageInputChange = (event) => {
    const file = event.target.files?.[0];
    processImageFile(file);
    event.target.value = '';
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    setImageUploadState(prev => ({ ...prev, dragActive: false }));
    const file = event.dataTransfer?.files?.[0];
    processImageFile(file);
  };

  const handleImageDragOver = (event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    if (!imageUploadState.dragActive) {
      setImageUploadState(prev => ({ ...prev, dragActive: true }));
    }
  };

  const handleImageDragLeave = (event) => {
    event.preventDefault();
    const isChild = event.currentTarget.contains(event.relatedTarget);
    if (!isChild && imageUploadState.dragActive) {
      setImageUploadState(prev => ({ ...prev, dragActive: false }));
    }
  };

  const clearUploadedImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImageUploadState({ dragActive: false, error: '', uploading: false });
  };

  const handleLogout = () => {
    setLogoutStep(1);
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    setLogoutStep(1);
  };

  const finalizeLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedOut'));
    setShowLogoutModal(false);
    setLogoutStep(1);
    navigate('/login');
  };

  const advanceLogoutStep = () => {
    if (logoutStep === 1) {
      setLogoutStep(2);
      return;
    }
    finalizeLogout();
  };

  if (!user) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Preparing premium workspace...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header glass">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="admin-logo">
              ROYALIFY Command
            </Link>
            <span className="admin-badge">Premium</span>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{userInitials}</div>
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role === 'admin' ? 'Administrator' : 'Premium curator'}</p>
              </div>
            </div>
            <Link to="/profile" className="header-nav-link">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="welcome-section fade-up">
          <h1 className="welcome-title">Curate the royal collection</h1>
          <p className="welcome-subtitle">
            Drive your premium storefront with real-time product insights and effortless publishing controls.
          </p>
        </section>

        <section className="stats-grid fade-up">
          <article className="stat-card glass">
            <div className="stat-content">
              <p className="stat-label">Products live</p>
              <p className="stat-value">{stats.published}</p>
            </div>
          </article>
          <article className="stat-card glass">
            <div className="stat-content">
              <p className="stat-label">Draft queue</p>
              <p className="stat-value">{stats.drafts}</p>
            </div>
          </article>
          <article className="stat-card glass">
            <div className="stat-content">
              <p className="stat-label">Limited releases</p>
              <p className="stat-value">{stats.limited}</p>
            </div>
          </article>
          <article className="stat-card glass">
            <div className="stat-content">
              <p className="stat-label">Inventory value</p>
              <p className="stat-value">{formatCurrency(stats.inventoryValue, { currency: 'USD' })}</p>
            </div>
          </article>
        </section>

        <section className="products-section fade-up">
          <div className="section-header">
            <div>
              <h2 className="section-title">Product management</h2>
              <p className="section-subtitle">
                {lastRefreshed ? `Synced ${lastRefreshed.toLocaleString()}` : 'Loading data...'}
              </p>
            </div>
            <div className="section-actions">
              <button className="refresh-button" type="button" onClick={handleManualRefresh} disabled={loading}>
                Refresh
              </button>
              <button className="add-product-btn" type="button" onClick={openCreateModal}>
                + Add product
              </button>
            </div>
          </div>

          <div className="product-toolbar">
            <div className="search-control">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="search-input"
                placeholder="Search by name, tag, or description"
              />
            </div>
            <div className="filter-group">
              <button
                type="button"
                className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-chip ${statusFilter === 'published' ? 'active' : ''}`}
                onClick={() => setStatusFilter('published')}
              >
                Published
              </button>
              <button
                type="button"
                className={`filter-chip ${statusFilter === 'draft' ? 'active' : ''}`}
                onClick={() => setStatusFilter('draft')}
              >
                Drafts
              </button>
              <label className="limited-toggle">
                <input
                  type="checkbox"
                  checked={limitedOnly}
                  onChange={(event) => setLimitedOnly(event.target.checked)}
                />
                <span>Limited only</span>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Fetching your catalog...</p>
            </div>
          ) : (
            <div className="products-table-wrapper glass">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Limited</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <span className="empty-icon">*</span>
                          <h3>No products found</h3>
                          <p>Adjust your filters or add a new product to the collection.</p>
                          <button className="add-product-btn" type="button" onClick={openCreateModal}>
                            Create your first product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="product-name-cell">
                          <div className="product-info">
                            <img className="product-thumb" src={product.image} alt={product.name} />
                            <div>
                              <p className="product-name">{product.name}</p>
                              <p className="product-id">{product.tags || 'No tags assigned'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="product-price">
                          {formatCurrency(Number(product.price || 0) / 100, { currency: product.currency || 'USD' })}
                        </td>
                        <td className="product-stock">
                          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {product.stock ?? 0} in vault
                          </span>
                        </td>
                        <td className="product-status">
                          <span className={`status-badge ${product.limited ? 'limited' : 'regular'}`}>
                            {product.limited ? 'Limited run' : 'Core catalog'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`publish-toggle ${product.published !== false ? 'published' : 'draft'}`}
                            onClick={() => togglePublish(product)}
                          >
                            {product.published !== false ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td>
                          <div className="product-actions">
                            <button type="button" className="action-btn" onClick={() => openEditModal(product)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showModal && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <div className="admin-modal-content glass">
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit product' : 'Create product'}</h2>
                <p>Craft compelling product stories for your premium storefront.</p>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <label>
                    <span>Product name *</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    <span>Price ({formData.currency}) *</span>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    <span>Currency code</span>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      maxLength={3}
                    />
                  </label>
                  <label>
                    <span>Stock count *</span>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <label className="form-wide">
                  <span>Description *</span>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </label>
                <label className="form-wide">
                  <span>Product imagery *</span>
                  <div
                    className={`image-dropzone ${imageUploadState.dragActive ? 'is-dragging' : ''}`}
                    onDragOver={handleImageDragOver}
                    onDragLeave={handleImageDragLeave}
                    onDrop={handleImageDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageInputChange}
                      className="image-file-input"
                    />
                    <p className="image-dropzone-title">Drag an image here</p>
                    <p className="image-dropzone-subtitle">
                      or{' '}
                      <button type="button" onClick={handleImageBrowse} className="image-browse-btn">
                        browse your device
                      </button>
                    </p>
                    {imageUploadState.uploading && <p className="image-dropzone-status">Uploading...</p>}
                  </div>
                  {formData.image && (
                    <div className="image-preview">
                      <img src={formData.image} alt="Product preview" />
                      <div className="image-preview-details">
                        <p>Preview attached. Submit to save.</p>
                        <button type="button" className="image-remove-btn" onClick={clearUploadedImage}>Remove image</button>
                      </div>
                    </div>
                  )}
                  <details className="image-url-fallback">
                    <summary>Use an image URL instead</summary>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/product.jpg"
                    />
                  </details>
                  {imageUploadState.error && <p className="image-upload-error">{imageUploadState.error}</p>}
                </label>
                <label className="form-wide">
                  <span>Tags (comma separated)</span>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="luxury, curated, signature"
                  />
                </label>
                <div className="modal-switches">
                  <label>
                    <input
                      type="checkbox"
                      name="limited"
                      checked={formData.limited}
                      onChange={handleInputChange}
                    />
                    <span>Limited edition</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                    />
                    <span>Published</span>
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="primary-action">
                    {editingProduct ? 'Update product' : 'Create product'}
                  </button>
                  <button type="button" className="secondary-action" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      {showLogoutModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={cancelLogout}>
          <div className="modal-content logout-modal admin-logout-modal" onClick={(event) => event.stopPropagation()}>
            <div className="logout-modal-crest" aria-hidden="true">
              <div className="logout-crest-ring" />
              <div className="logout-crest-core" />
            </div>
            <p className="logout-modal-eyebrow">Royal exit protocol</p>
            <div className="logout-modal-progress" aria-hidden="true">
              <span className={`progress-dot${logoutStep >= 1 ? ' is-active' : ''}`} />
              <span className={`progress-dot${logoutStep >= 2 ? ' is-active' : ''}`} />
            </div>
            <h3 className="logout-modal-title">
              {logoutStep === 1 ? 'Exit the Command Suite?' : 'Confirm royal command sign-off?'}
            </h3>
            <p className="logout-modal-copy">
              {logoutStep === 1
                ? 'We are preparing to close your premium command center session. Continue to proceed.'
                : 'Your administrator credentials will sign out and the session will end elegantly.'}
            </p>
            <div className="logout-modal-buttons">
              <button type="button" className="logout-modal-btn secondary" onClick={cancelLogout}>
                Stay in workspace
              </button>
              <button type="button" className="logout-modal-btn primary" onClick={advanceLogoutStep}>
                {logoutStep === 1 ? 'Continue' : 'Confirm logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
