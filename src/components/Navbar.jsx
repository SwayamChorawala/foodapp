import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { LuShoppingBag } from "react-icons/lu";
import { useSelector } from 'react-redux';

const Navbar = () => {
  const cartItems = useSelector((state) => state.app);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='navbar'>
      <div className='nav-inner'>
        <Link to="/" className='nav-title'>The Chef & The Table</Link>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>

        <div className='nav-right'>
          <div className='Shopping-bag'>
            <Link to="/card2"><LuShoppingBag /></Link>
            <span className='value'>{cartItems.length}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
