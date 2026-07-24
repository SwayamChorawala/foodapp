import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import './Home.css'
import Explore from './Explore'
import Booking from './Booking'
import Hero from './Hero'
import Side from './Side'
import Form from './Form'
import Footer from './Footer'
import Navbar from './Navbar'

const Home = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const imgX = useTransform(mouseX, [-1, 1], [-18, 18])
  const imgY = useTransform(mouseY, [-1, 1], [-10, 10])
  const textX = useTransform(mouseX, [-1, 1], [8, -8])
  const textY = useTransform(mouseY, [-1, 1], [4, -4])

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  // Text animation variants
  const titleVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
  }
  const charVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -40 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }

  const titleWords = ["Taste", "Sensation"]

  return (
    <div className='home-page'>
      {/* Scroll progress bar */}
      <motion.div className='scroll-progress' style={{ scaleX }} />

      <Navbar />

      {/* ── HERO PHOTO SECTION ── */}
      <motion.section
        className='photo'
        ref={heroRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src='./repice.jpeg'
          alt='Restaurant'
          className='hero-image'
          style={{ x: imgX, y: imgY, scale: 1.25 }}
        />
        {/* Overlay */}
        <div className='hero-overlay'>
          <motion.div
            className='hero-eyebrow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ✦ Fine Dining Experience
          </motion.div>

          <motion.h1
            className='taste'
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            style={{ x: textX, y: textY }}
          >
            {titleWords.map((word, wIndex) => (
              <span key={wIndex} className="taste-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split("").map((char, cIndex) => (
                  <motion.span key={cIndex} variants={charVariants} style={{ display: 'inline-block' }}>
                    {char}
                  </motion.span>
                ))}
                {wIndex < titleWords.length - 1 && '\u00A0'}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className='p'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Elevate Your Culinary Journey
          </motion.p>

          <motion.button
            className='btn'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document
                .getElementById('explore-section')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            <span className='btn-text'>Explore Menu</span>
            <span className='btn-glow' />
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            className='scroll-indicator'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className='scroll-line' />
            <span>Scroll</span>
          </motion.div>
        </div>

        {/* Floating decorative orbs */}
        <div className='hero-orb hero-orb-1' />
        <div className='hero-orb hero-orb-2' />
      </motion.section>

      {/* ── OTHER SECTIONS ── */}
      <section id='explore-section'>
        <Explore />
      </section>
      <section id='booking-section'>
        <Booking />
      </section>
      <section className='hero-stack'>
        <Hero />
      </section>
      <section className='side-stack'>
        <Side />
      </section>
      <section className='form-stack'>
        <Form />
      </section>
      <section className='footer-stack'>
        <Footer />
      </section>
    </div>
  )
}

export default Home
