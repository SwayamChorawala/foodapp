import React from 'react'
import { motion } from 'framer-motion'
import './Team.css'
import use3DTilt from '../../hooks/use3DTilt'

const ChefCard = ({ src, alt, name, role, nameId, roleId, index }) => {
  const tiltRef = use3DTilt({ max: 10, speed: 500, glare: true })
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="chef-card-tilt" ref={tiltRef}>
        <div className="chef-card">
          <img src={src} alt={alt} />
          <p id={nameId}>{name}</p>
          <p id={roleId}>{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

const Team = () => {
  return (
    <div>
      <div className='main2'>
        <motion.h1
          id='hc'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          Our <span className='gradient-text'>Team</span>
        </motion.h1>
        <div className="teams-grid">
          <ChefCard src="chef1.avif" alt="Jone Lake" name="Jone Lake" role="Chef" nameId="pc" roleId="pc2" index={0} />
          <ChefCard src="chef2.avif" alt="Rick Landry" name="Rick Landry" role="So-Chef" nameId="pc3" roleId="pc4" index={1} />
        </div>
      </div>
    </div>
  )
}

export default Team
