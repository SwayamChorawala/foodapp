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
  const [originalImage, setOriginalImage] = useState(null); // stores imported avif/module images
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

  // ─── Helper: Get edits map from localStorage ───────────────────────────────
  const getEditsMap = () => {
    try {
      return JSON.parse(localStorage.getItem('adminFoodEdits') || '{}');
    } catch { return {}; }
  };

  // ─── Helper: Save edits map to localStorage ────────────────────────────────
  const saveEditsMap = (map) => {
    localStorage.setItem('adminFoodEdits', JSON.stringify(map));
  };

  // ─── Helper: Get extra items (admin-added, not in item.js) ─────────────────
  const getExtraItems = () => {
    try {
      return JSON.parse(localStorage.getItem('adminFoodExtras') || '[]');
    } catch { return []; }
  };

  // ─── Build the live display list from item.js + edits + extras ───────────
  const buildFoodList = () => {
    const editsMap = getEditsMap();
    const extras = getExtraItems();
    const base = menuItems.map((item) => {
      const edit = editsMap[item.id];
      return edit ? { ...item, ...edit, image: item.image } : item; // image always from item.js
    });
    return [...base, ...extras];
  };

  // ─── Sync display list and fire menuUpdated event ─────────────────────────
  const syncFoodDisplay = () => {
    const list = buildFoodList();
    setFoodItems(list);
    // For Menu.jsx: serialise extras + edits as URL-based items
    const editsMap = getEditsMap();
    const extras = getExtraItems();
    const forMenu = [
      ...menuItems.map((item) => {
        const edit = editsMap[item.id];
        return edit
          ? { ...item, ...edit, image: item.image } // image stays as module reference for Menu
          : item;
      }),
      ...extras,
    ];
    localStorage.setItem('foodMenuItems', JSON.stringify(
      forMenu.map((i) => ({
        ...i,
        image: typeof i.image === 'object' && i.image !== null
          ? (i.image.src || i.image.default || '')
          : i.image,
      }))
    ));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  // ─── Load all dashboard data ───────────────────────────────────────────────
  const fetchDashboardData = async () => {
    setLoadingData(true);
    syncFoodDisplay();

    // Fetch Orders
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`);
      if (orderRes.ok) setOrders(await orderRes.json());
    } catch (err) { console.log('Orders fetch note:', err.message); }

    // Fetch Users
    try {
      const userRes = await fetch(`${API_BASE_URL}/api/users`);
      if (userRes.ok) setUsers(await userRes.json());
    } catch (err) { console.log('Users fetch note:', err.message); }

    setLoadingData(false);
  };

  // ─── Open Edit / Create Modal ──────────────────────────────────────────────
  const openFoodModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setOriginalImage(item.image); // preserve original item.js module image
      const isUrlString = item.image && typeof item.image === 'string' && item.image.startsWith('http');
      setFormData({
        title: item.title || '',
        desc: item.desc || '',
        price: item.price || '',
        type: item.type || 'veg',
        image: isUrlString ? item.image : '', // only pre-fill if it's an http URL
        category: item.category || 'Mains',
      });
    } else {
      setEditingItem(null);
      setOriginalImage(null);
      setFormData({ title: '', desc: '', price: '', type: 'veg', image: '', category: 'Mains' });
    }
    setIsModalOpen(true);
  };

  const closeFoodModal = () => { setIsModalOpen(false); setEditingItem(null); };

  // ─── Save Food Item (Edit or Create) ──────────────────────────────────────
  const handleSaveFoodItem = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) {
      alert('Title aur Price zaroori hain!');
      return;
    }

    if (editingItem) {
      const itemId = editingItem.id || editingItem._id;
      const isBaseItem = menuItems.some((m) => m.id === itemId);

      if (isBaseItem) {
        // Edit a base item.js item — store only changed fields (NOT image)
        const editsMap = getEditsMap();
        editsMap[itemId] = {
          title: formData.title.trim(),
          desc: formData.desc.trim(),
          price: Number(formData.price),
          type: formData.type,
          category: formData.category,
          // image: only save a new URL if user typed one; otherwise keep item.js image
          ...(formData.image.trim() !== '' ? { imageOverride: formData.image.trim() } : {}),
        };
        saveEditsMap(editsMap);
      } else {
        // Edit an admin-added extra item
        const extras = getExtraItems().map((ex) =>
          (ex.id === itemId || ex._id === itemId)
            ? {
              ...ex,
              title: formData.title.trim(),
              desc: formData.desc.trim(),
              price: Number(formData.price),
              type: formData.type,
              category: formData.category,
              image: formData.image.trim() || ex.image || originalImage || '',
            }
            : ex
        );
        localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      }
      triggerNotification('Item successfully updated! ✅');
    } else {
      // CREATE new extra item
      const extras = getExtraItems();
      const newItem = {
        id: Date.now(),
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        price: Number(formData.price),
        type: formData.type,
        category: formData.category,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      };
      extras.push(newItem);
      localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      triggerNotification('Naya item add ho gaya! ✅');
    }

    syncFoodDisplay();
    closeFoodModal();
  };

  // ─── Delete Food Item ──────────────────────────────────────────────────────
  const handleDeleteFoodItem = (id) => {
    if (!window.confirm('Kya aap is food item ko delete karna chahte hain?')) return;
    const isBaseItem = menuItems.some((m) => m.id === id);
    if (isBaseItem) {
      // For base items: reset any edits (restore to original)
      const editsMap = getEditsMap();
      delete editsMap[id];
      saveEditsMap(editsMap);
      triggerNotification('Item original state mein restore ho gaya', 'info');
    } else {
      // For extra items: remove from extras
      const extras = getExtraItems().filter((ex) => ex.id !== id && ex._id !== id);
      localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      triggerNotification('Item delete ho gaya', 'info');
    }
    syncFoodDisplay();
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
              {filteredFoodItems.map((item) => {
                const isBaseItem = menuItems.some((m) => m.id === item.id);
                return (
                  <div key={item._id || item.id} className="admin-food-card">
                    <div className="food-card-img">
                      <img src={item.image} alt={item.title} />
                      <span className={`badge-type ${item.type}`}>{item.type}</span>
                      {isBaseItem && (
                        <span className="badge-source">item.js</span>
                      )}
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
                          title={isBaseItem ? 'Reset to original' : 'Delete Food Item'}
                        >
                          <LuTrash2 /> {isBaseItem ? 'Reset' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  <label>Image URL / Path</label>
                  {/* Show current image preview */}
                  {(originalImage || formData.image) && (
                    <div className="modal-img-preview">
                      <img
                        src={formData.image.trim() !== '' ? formData.image : originalImage}
                        alt="Current Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="img-preview-label">Current Image</span>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="New image URL (leave blank to keep current image)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  {editingItem && originalImage && (
                    <p className="img-hint">💡 Image field khaali chhodein toh purani image rakhegi</p>
                  )}
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
