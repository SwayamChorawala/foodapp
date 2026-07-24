import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import img1 from '../images/food4.jpg'
import img2 from '../images/food5.avif'
import img3 from '../images/food6.jpg'
import img4 from '../images/food7.jpg'
import use3DTilt from '../hooks/use3DTilt'
import './Side.css'

const dishes = [
  { id: 1, img: img1, name: 'Signature Starter' },
  { id: 2, img: img2, name: 'Chef\'s Special' },
  { id: 3, img: img3, name: 'Garden Fresh' },
  { id: 4, img: img4, name: 'Artisan Dessert' },
]

const DishCard = ({ dish, index }) => {
  const tiltRef = use3DTilt({ max: 12, speed: 400, glare: true })
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='imgfood-tilt' ref={tiltRef}>
        <div className='imgfood'>
          <img src={dish.img} alt={dish.name} />
          <div className='dish-overlay'>
            <span className='dish-name'>{dish.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Side = () => {
  return (
    <section className='side-section'>
      <motion.div
        className='side-header'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        <p className='side-eyebrow'>✦ Handcrafted with Love</p>
        <h1 className='side-title'>Signature <span className='gradient-text'>Dishes</span></h1>
      </motion.div>

      <div className='img-container'>
        {dishes.map((dish, i) => (
          <DishCard key={dish.id} dish={dish} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className='side-cta'
      >
        <Link className='menu-btn' to='/menu'>
          <span>View Full Menu</span>
          <span className='menu-btn-arrow'>→</span>
        </Link>
      </motion.div>
    </section>
  )
}

export default Side
