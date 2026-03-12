import React from 'react'
import './Booking.css'
import { Link } from 'react-router-dom'
const Booking = () => {
  return (
   <section className='booking-cta'>
     <h1 className='h1'>Indulge Now</h1>
      <p className='p7'>
        Treat yourself to a culinary journey like no other. Join us for an exclusive dining
        <br/>
         experience and discover a world of flavors
      </p>
      <Link className='btn2' to="/contact">Book Now</Link>
    </section>
  )
}

export default Booking
