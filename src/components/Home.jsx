import React from 'react'
import './Home.css'
import Explore from './Explore'
import Booking from './Booking'
import Hero from './Hero'
import Side from './Side'
import Form from './Form'
import Footer from './Footer'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div className='home-page'>
  <Navbar/>
      <section className='photo'>
        <img src='repice.jpeg' alt='Restaurant' className='hero-image' />
        <div className='hero-overlay'>
          <h1 className='taste'>Taste Sensation</h1>
          <p className='p'>Elevate Your Culinary Journey</p>
          <button
            className='btn'
            onClick={() =>
              document
                .getElementById('explore-section')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            Explore Menu
          </button>
        </div>
      </section>
      <section id='explore-section'>
      <Explore/>
      </section>
      <section id='booking-section'>
        <Booking />
      </section>
      <section className='hero-stack'>
        <Hero />
      </section>
      <section className='side-stack'>
        <Side/>
      </section>
      <section className='form-stack'>
        <Form/>
      </section>
      <section className='footer-stack'>
        <Footer />
      </section>
      <div className='sidebar'>
        <header>

        </header>
      </div>
    </div>
  )
}

export default Home
