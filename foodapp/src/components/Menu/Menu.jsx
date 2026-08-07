import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../Navbar'
import './Menu.css'
import Card from './Card'
import { menuItems } from './item'
import { FaSearch } from "react-icons/fa"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}
const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Menu = () => {
  const [name, setname] = useState("")

  // Build menu list from item.js + admin edits + admin-added extras
  const buildMenuList = () => {
    try {
      const editsMap = JSON.parse(localStorage.getItem('adminFoodEdits') || '{}');
      const extras = JSON.parse(localStorage.getItem('adminFoodExtras') || '[]');
      const base = menuItems.map((item) => {
        const edit = editsMap[item.id];
        if (!edit) return item;
        const resolvedImage = edit.imageOverride ? edit.imageOverride : item.image;
        return { ...item, ...edit, image: resolvedImage };
      });
      return [...base, ...extras];
    } catch (e) {
      console.warn(e);
      return menuItems;
    }
  };

  const [menuItemsList, setMenuItemsList] = useState(() => buildMenuList());
  const [filteredItems, setFilteredItems] = useState(() => buildMenuList());

  const loadMenu = () => {
    const list = buildMenuList();
    setMenuItemsList(list);
  };

  useEffect(() => {
    loadMenu();
    window.addEventListener('menuUpdated', loadMenu);
    return () => window.removeEventListener('menuUpdated', loadMenu);
  }, []);

  useEffect(() => {
    const result = menuItemsList.filter((item) =>
      item.title.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredItems(result);
  }, [name, menuItemsList]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className='menu-container'>
        <div className='menu-header'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Dinner Menu
          </motion.h1>
        </div>

        <motion.div
          className='desc'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p>Appetizers &amp; Mains</p>
          <p id='desc1'>These dishes are carefully crafted for an amazing evening</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div id="search">
            <input
              type="text"
              id="search-input"
              placeholder="Search menu..."
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <FaSearch id='searchi' />
          </div>
        </motion.div>

        <motion.div
          className='menu-grid'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.map((item) => (
            <motion.div key={item.id} variants={cardVariant}>
              <Card item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Menu
