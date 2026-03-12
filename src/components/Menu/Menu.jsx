import React from 'react'
import Navbar from '../Navbar'
import './Menu.css'
import Card from './Card'
import { menuItems } from './item'

const Menu = () => {
  return (
    <div>
    <Navbar/>
    
    <div className='menu-container'>
        <div className='menu-header'>
            <h1>Dinner Menu</h1>
        </div>
        <div className='desc'>
            <p>
                Appetizers & Mains
            </p>
            <p id='desc1'>
                These dishes are carefully crafted for an amazing evening
            </p>
        </div>
        
        <div className='menu-grid'>
            {menuItems.map((item) => (
                <Card key={item.id} item={item}/>
            ))}
        </div>
    </div>
    </div>
  )
}

export default Menu

