import React from 'react'
import { motion } from 'framer-motion'
import './Explore.css'

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 } }
}

const Explore = () => {
  return (
    <div className='explore'>
      {/* Aurora orbs */}
      <div className='explore-orb explore-orb-1' />
      <div className='explore-orb explore-orb-2' />

      <div className='explore-text'>
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className='explore-img-wrapper'
        >
          <img src="food.jpeg" alt="Food" className='img-photo' />
          <div className='explore-img-glow' />
        </motion.div>

        <motion.div
          className='explore-info'
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className='text-area'>
            <h1>
              Our<br />
              Culinary<br />
              <span className='gradient-text'>Story</span>
            </h1>
          </div>
          <div className='explore-p'>
            <p className='explore-p-label'>Experience It</p>
            <p>
              Immerse yourself in the unique dining experience at The Chef and the Table. With a focus on local ingredients, our seasonal tasting menus are crafted to perfection for a memorable and delicious dining adventure.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Explore
