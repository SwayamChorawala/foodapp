import React from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
}

const Hero = () => {
  return (
    <section className='hero'>
      <div className='hero-inner'>
        <motion.h1
          className='hero-title'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          Why <span className='gradient-text'>Us</span>
        </motion.h1>

        {[
          {
            img: 'food2.jpeg',
            alt: 'Local ingredients',
            h2: 'Unique Taste',
            label: 'Local Ingredients',
            desc: 'Our emphasis on the best local ingredients ensures that each dish is a culinary masterpiece, highlighting rich flavors and regional quality.',
            reverse: false,
            imgClass: 'foodimg'
          },
          {
            img: 'food3.jpeg',
            alt: 'Fine dining experience',
            h2: 'Exceptional Service',
            label: 'Fine Dining Experience',
            desc: 'Experience personalized service and attention to detail that creates a fine-dining atmosphere and complements every dish.',
            reverse: true,
            imgClass: 'food1img'
          }
        ].map((card, i) => (
          <motion.article
            key={i}
            className={`hero-card ${card.reverse ? 'reverse' : ''}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className='hero-img-wrapper'>
              <img src={card.img} alt={card.alt} className={card.imgClass} />
              <div className='hero-img-overlay' />
            </div>
            <div className='hero-copy'>
              <p className='eyebrow'>{card.label}</p>
              <h2>{card.h2}</h2>
              <p>{card.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Hero
