import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Booking.css'

const Booking = () => {
  return (
    <motion.section
      className='booking-cta'
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='booking-orb' />
      <motion.div
        className='booking-eyebrow'
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        ✦ Reserve Your Table
      </motion.div>
      <motion.h1
        className='h1'
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Indulge Now
      </motion.h1>
      <motion.p
        className='p7'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45 }}
      >
        Treat yourself to a culinary journey like no other. Join us for an exclusive dining
        experience and discover a world of flavors.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link className='btn2' to="/contact">Book Now</Link>
      </motion.div>
    </motion.section>
  )
}

export default Booking
