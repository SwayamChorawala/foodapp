import React from 'react'
import { motion } from 'framer-motion'
import './details.css'

const Details = () => {
  return (
    <div className='container21'>
      <div className='details-bg-glow' />
      <div id='main'>
        <div className="text-content">
          <div className="about-left-col">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="about-headline">
                Crafting<br />
                <span className="about-highlight">Culinary</span><br />
                Memories
              </span>
            </motion.div>

            <motion.p
              id='ph'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              At The chef and the table, we pride ourselves on offering a unique dining experience where every dish tells a story. Our talented chefs curate seasonal tasting menus that showcase the finest local ingredients. Step into an intimate setting where each plate is a masterpiece of precision and creativity, ensuring a dining journey that is unforgettable and delightful.
            </motion.p>
            
            {/* Quick stats row for premium design */}
            <motion.div 
              className="about-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="stat-card">
                <h3>12+</h3>
                <p>Years of Art</p>
              </div>
              <div className="stat-card">
                <h3>100%</h3>
                <p>Local Ingredients</p>
              </div>
            </motion.div>
          </div>

          <div className="about-right-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="about-img-container"
            >
              <img
                src="photo.jpeg"
                alt="Restaurant interior"
                id='aboutp'
              />
              <div className="about-img-border" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
