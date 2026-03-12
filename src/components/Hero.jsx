import React from 'react'
import './Hero.css'
const Hero = () => {
  return (
    <section className='hero'>
      <div className='hero-inner'>
    
        <h1 className='hero-title'>Why Us</h1>
        <article className='hero-card'>
          <img src='food2.jpeg' alt='Local ingredients' className='foodimg' />
          <div className='hero-copy'>
            <h2>Unique Taste</h2>
            <p className='eyebrow'>Local Ingredients</p>
            <p>
              Our emphasis on the best local ingredients ensures that each dish is a culinary masterpiece,
              highlighting rich flavors and regional quality.
            </p>
          </div>
        </article>
        <article className='hero-card reverse'>
          <img src='food3.jpeg' alt='Fine dining experience' className='food1img' />
          <div className='hero-copy'>
            <h2>Exceptional Service</h2>
            <p className='eyebrow'>Fine Dining Experience</p>
            <p>
              Experience personalized service and attention to detail that creates a fine-dining atmosphere
              and complements every dish.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Hero
