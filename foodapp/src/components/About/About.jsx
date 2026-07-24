import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../Navbar'
import Details from './Details'
import Footer from '../Footer'
import './about.css'
import Team from './Team'

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Details />
      <Team />
      <div id='footer2'>
        <Footer />
      </div>
    </motion.div>
  )
}

export default About
