import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'
import { LuShoppingBag, LuUser, LuLogIn, LuLogOut } from "react-icons/lu"
import { useSelector } from 'react-redux'

const Navbar = () => {
  const cartItems = useSelector((state) => state.app)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored))
        } catch {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }

    checkUser()
    window.addEventListener('authChange', checkUser)
    return () => window.removeEventListener('authChange', checkUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null)
    window.dispatchEvent(new Event('authChange'))
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      setHidden(currentScrollY > lastScrollY && currentScrollY > 120)
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])


  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/menu', label: 'Menu' },
    { to: '/contact', label: 'Contact' },
    { to: '/admin', label: 'Admin Panel' },
  ]

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'nav-hidden' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='nav-inner'>
        {/* Brand */}
        <Link to="/" className='nav-title'>
          <span className='nav-title-chef'>The Chef</span>
          <span className='nav-title-sep'>&amp;</span>
          <span className='nav-title-table'>The Table</span>
        </Link>

        {/* Desktop links */}
        <div className='nav-links'>
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
                {isActive && (
                  <motion.span
                    className='nav-link-indicator'
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right — cart + user auth + hamburger */}
        <div className='nav-right'>
          {currentUser ? (
            <div className="user-auth-section">
              <div className="user-badge">
                <LuUser className="user-badge-icon" />
                <span>{currentUser.username}</span>
              </div>
              <button onClick={handleLogout} className="logout-nav-btn" title="Logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="auth-nav-btn">
              <LuLogIn />
              <span>Login</span>
            </Link>
          )}

          <Link to="/card2" className='shopping-bag-link' aria-label="View cart">
            <div className='shopping-bag'>
              <LuShoppingBag />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span
                    className='cart-badge'
                    key={cartItems.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className='mobile-menu'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {navLinks.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
              >
                <Link
                  to={to}
                  className={`mobile-link ${location.pathname === to ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navLinks.length * 0.07, duration: 0.3 }}
            >
              {currentUser ? (
                <div style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ffd700', fontWeight: 600, fontSize: '0.9rem' }}>
                    👤 {currentUser.username}
                  </span>
                  <button onClick={handleLogout} className="logout-nav-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="mobile-link"
                  style={{ color: '#ff5252', fontWeight: 600 }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
