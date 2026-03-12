import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { LuShoppingBag } from "react-icons/lu";
import Card2 from '../components/Menu/Card2'
import { useSelector } from 'react-redux';
const Navbar = () => {
  const cartItems = useSelector((state) => state.app);
  return (
    <div>
    <div className='navbar'>
        <div className='nav-brand'>
            {/* Can add logo here in the future if needed */}
        </div>
        <div className='nav-links'>
            <Link to="/">home</Link> 
            <Link to="/about">about</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/contact">contact</Link>
        </div>
        <div className='nav-right'>
            <div className='Shopping-bag'>
             <Link to="/card2"><LuShoppingBag /></Link>
                <span className='value'>{cartItems.length}</span>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Navbar
