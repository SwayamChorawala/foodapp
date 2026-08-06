import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuShieldCheck,
  LuUser,
  LuLock,
  LuGlobe,
  LuLogOut,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuUtensils,
  LuShoppingBag,
  LuUsers,
  LuCheck,
  LuInfo,
  LuX,
  LuSearch,
  LuRefreshCw,
} from 'react-icons/lu';
import { menuItems } from '../Menu/item';
import './AdminPanel.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_FOOD_ITEMS = menuItems;

const AdminPanel = () => {
  const navigate = useNavigate();

  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active dashboard tab: 'food', 'orders', 'users'
  const [activeTab, setActiveTab] = useState('food');

  // Data states
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notification message
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Modal State for Food Item (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    type: 'veg',
    image: '',
    category: 'Mains',
  });

  // Check login session on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminToken');
    if (savedAdmin) {
      setIsAdminLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAuthError('Please enter both Admin username and password.');
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.admin?.token || 'admin-active');
        localStorage.setItem('adminUser', adminUsername.trim());
        setIsAdminLoggedIn(true);
        triggerNotification('Welcome Admin! Login successful.');
        fetchDashboardData();
      } else {
        // Fallback check for local development credentials
        if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
          localStorage.setItem('adminToken', 'admin-active-fallback');
          localStorage.setItem('adminUser', 'admin');
          setIsAdminLoggedIn(true);
          triggerNotification('Welcome Admin! (Logged in successfully)');
          fetchDashboardData();
        } else {
          setAuthError(data.message || 'Invalid Admin Username or Password');
        }
      }
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
        localStorage.setItem('adminToken', 'admin-active-fallback');
        localStorage.setItem('adminUser', 'admin');
        setIsAdminLoggedIn(true);
        triggerNotification('Welcome Admin! (Logged in in Offline Mode)');
        fetchDashboardData();
      } else {
        setAuthError('Invalid Admin Credentials. Default is admin / admin123');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
    triggerNotification('Admin logged out safely', 'info');
  };

  const updateAndSyncFoodItems = (newItemsList) => {
    setFoodItems(newItemsList);
    localStorage.setItem('foodMenuItems', JSON.stringify(newItemsList));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  // Fetch Dashboard Data from API & LocalStorage
  const fetchDashboardData = async () => {
    setLoadingData(true);

    let initialList = menuItems;
    const stored = localStorage.getItem('foodMenuItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= menuItems.length) {
          initialList = parsed;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    setFoodItems(initialList);
    localStorage.setItem('foodMenuItems', JSON.stringify(initialList));
    window.dispatchEvent(new Event('menuUpdated'));

    // Fetch Orders
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (err) {
      console.log('Orders fetch note:', err.message);
    }

    // Fetch Users
    try {
      const userRes = await fetch(`${API_BASE_URL}/api/users`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData);
      }
    } catch (err) {
      console.log('Users fetch note:', err.message);
    }

    setLoadingData(false);
  };

  // Open modal for Create or Edit
  const openFoodModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        desc: item.desc || '',
        price: item.price || '',
        type: item.type || 'veg',
        image: item.image || '',
        category: item.category || 'Mains',
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        desc: '',
        price: '',
        type: 'veg',
        image: '',
        category: 'Mains',
      });
    }
    setIsModalOpen(true);
  };

  const closeFoodModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Save Food Item (Create / Update CRUD)
  const handleSaveFoodItem = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price) {
      alert('Title and Price are required!');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      desc: formData.desc.trim(),
      price: Number(formData.price),
      type: formData.type,
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      category: formData.category,
    };

    let updatedList = [];

    if (editingItem) {
      // UPDATE (Edit)
      const id = editingItem._id || editingItem.id;
      updatedList = foodItems.map((item) =>
        (item._id || item.id) === id ? { ...item, ...payload, id } : item
      );

      try {
        const res = await fetch(`${API_BASE_URL}/api/food/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            updatedList = foodItems.map((item) =>
              (item._id || item.id) === id ? { ...data.item, id: data.item._id || id } : item
            );
          }
        }
      } catch (err) {
        console.warn('Backend update note:', err);
      }

      updateAndSyncFoodItems(updatedList);
      triggerNotification('Food item updated successfully!');
    } else {
      // CREATE (Add New)
      const newId = Date.now();
      const newItem = { ...payload, id: newId };
      updatedList = [newItem, ...foodItems];

      try {
        const res = await fetch(`${API_BASE_URL}/api/food`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            updatedList = [{ ...data.item, id: data.item._id || newId }, ...foodItems];
          }
        }
      } catch (err) {
        console.warn('Backend create note:', err);
      }

      updateAndSyncFoodItems(updatedList);
      triggerNotification('New food item added successfully!');
    }

    closeFoodModal();
  };

  // DELETE Food Item
  const handleDeleteFoodItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    const updatedList = foodItems.filter((item) => (item._id || item.id) !== id);
    updateAndSyncFoodItems(updatedList);

    try {
      await fetch(`${API_BASE_URL}/api/food/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend delete warning:', err);
    }

    triggerNotification('Food item deleted', 'info');
  };

  // UPDATE Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Backend order update warning:', err);
    }

    setOrders((prev) =>
      prev.map((ord) => ((ord._id || ord.id) === orderId ? { ...ord, status: newStatus } : ord))
    );
    triggerNotification(`Order status updated to: ${newStatus}`);
  };

  // DELETE Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend order delete warning:', err);
    }

    setOrders((prev) => prev.filter((ord) => (ord._id || ord.id) !== orderId));
    triggerNotification('Order record deleted', 'info');
  };

  // DELETE User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this registered user?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend user delete warning:', err);
    }

    setUsers((prev) => prev.filter((u) => u._id !== userId));
    triggerNotification('User deleted', 'info');
  };

  // Filter food items by search query
  const filteredFoodItems = foodItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Admin is NOT logged in, show Admin Login View
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-bg-orb orb-1"></div>
        <div className="admin-bg-orb orb-2"></div>

        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-login-header">
            <div className="admin-icon-badge">
              <LuShieldCheck />
            </div>
            <h2>Admin Control Panel</h2>
            <p>Please enter your Admin Credentials to access the dashboard</p>
          </div>

          {authError && (
            <div className="admin-alert alert-error">
              <LuInfo />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="admin-form-group">
              <label>Admin Username</label>
              <div className="admin-input-box">
                <LuUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Admin Password</label>
              <div className="admin-input-box">
                <LuLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-btn-primary full-width" disabled={authLoading}>
              {authLoading ? 'Authenticating...' : 'Login to Admin Dashboard'}
            </button>
          </form>

          <div className="admin-login-tip">
            <span>💡 Default Credentials:</span> <strong>Username: admin | Password: admin123</strong>
          </div>

          <div className="admin-back-site">
            <button type="button" onClick={() => navigate('/')} className="admin-btn-secondary">
              <LuGlobe /> Go to Customer Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard View (When Logged In)
  return (
    <div className="admin-dashboard-wrapper">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className={`admin-toast ${notification.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LuCheck />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <LuShieldCheck className="brand-icon" />
          <div>
            <h1>The Chef &amp; Table — Admin Panel</h1>
            <p>Manage Menu Items, Customer Orders, and Users</p>
          </div>
        </div>

        <div className="admin-header-actions">
          {/* USER REQUIREMENT: Button to click and go directly to main website */}
          <button
            type="button"
            className="admin-nav-btn go-website-btn"
            onClick={() => navigate('/')}
            title="Return to customer website"
          >
            <LuGlobe /> <span>🌐 Go to Website</span>
          </button>

          <button
            type="button"
            className="admin-nav-btn logout-btn"
            onClick={handleAdminLogout}
            title="Logout from admin session"
          >
            <LuLogOut /> <span>Logout Admin</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main-container">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            className={`tab-item ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            <LuUtensils />
            <span>Manage Menu ({foodItems.length})</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <LuShoppingBag />
            <span>Customer Orders ({orders.length})</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <LuUsers />
            <span>Registered Users ({users.length})</span>
          </button>
        </div>

        {/* TAB 1: FOOD MENU MANAGEMENT (CRUD) */}
        {activeTab === 'food' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <div className="search-input-box">
                <LuSearch />
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="tab-right-btns">
                <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                  <LuRefreshCw /> Refresh
                </button>
                <button className="admin-btn-primary" onClick={() => openFoodModal(null)}>
                  <LuPlus /> Add New Food Item
                </button>
              </div>
            </div>

            {/* Food Items Grid */}
            <div className="food-grid">
              {filteredFoodItems.map((item) => (
                <div key={item._id || item.id} className="admin-food-card">
                  <div className="food-card-img">
                    <img src={item.image} alt={item.title} />
                    <span className={`badge-type ${item.type}`}>{item.type}</span>
                  </div>
                  <div className="food-card-body">
                    <h3>{item.title}</h3>
                    <p className="food-desc">{item.desc}</p>
                    <div className="food-meta">
                      <span className="food-price">₹{item.price}</span>
                      <span className="food-cat">{item.category || 'Mains'}</span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => openFoodModal(item)}
                        title="Edit Food Item"
                      >
                        <LuPencil /> Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteFoodItem(item._id || item.id)}
                        title="Delete Food Item"
                      >
                        <LuTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFoodItems.length === 0 && (
              <div className="empty-state">
                <p>No food items found matching your query.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <h2>All Customer Orders ({orders.length})</h2>
              <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                <LuRefreshCw /> Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <p>No orders placed yet. Orders placed by customers will appear here!</p>
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Items Purchased</th>
                      <th>Total Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id || ord.id}>
                        <td className="font-mono">#{ord._id || ord.id}</td>
                        <td>
                          <strong>{ord.fullName}</strong>
                          <br />
                          <small>📞 {ord.phoneNumber}</small>
                          <br />
                          <small>📍 {ord.address}</small>
                        </td>
                        <td>
                          {ord.items && ord.items.length > 0 ? (
                            <ul className="order-items-list">
                              {ord.items.map((it, idx) => (
                                <li key={idx}>
                                  {it.title || it.name} x {it.quantity || 1}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            ord.title
                          )}
                        </td>
                        <td className="font-bold">₹{ord.totalPrice}</td>
                        <td>
                          <span className="payment-badge">{ord.paymentMethod || 'COD'}</span>
                        </td>
                        <td>
                          <select
                            className={`status-select ${ord.status || 'Pending'}`}
                            value={ord.status || 'Pending'}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord._id || ord.id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn-delete-sm"
                            onClick={() => handleDeleteOrder(ord._id || ord.id)}
                            title="Delete order"
                          >
                            <LuTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <h2>Registered Customers ({users.length})</h2>
              <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                <LuRefreshCw /> Refresh Users
              </button>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <p>No registered users found in database.</p>
              </div>
            ) : (
              <div className="users-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr._id}>
                        <td className="font-mono">{usr._id}</td>
                        <td>
                          <strong>{usr.username}</strong>
                        </td>
                        <td>{usr.email || 'N/A'}</td>
                        <td>{usr.lastLogin ? new Date(usr.lastLogin).toLocaleString() : 'N/A'}</td>
                        <td>
                          <button
                            className="btn-delete-sm"
                            onClick={() => handleDeleteUser(usr._id)}
                            title="Remove User"
                          >
                            <LuTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE / EDIT FOOD ITEM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-backdrop">
            <motion.div
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                <button className="modal-close-btn" onClick={closeFoodModal}>
                  <LuX />
                </button>
              </div>

              <form onSubmit={handleSaveFoodItem} className="modal-form">
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Item Title (e.g., Margherita Pizza)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Food Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Short description of ingredients and taste..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={closeFoodModal}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingItem ? 'Save Changes' : 'Create Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
