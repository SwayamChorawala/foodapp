import React from 'react'
import Navbar from '../Navbar'
import Details from './Details'
import Footer from '../Footer'
import './about.css'
import Team from './Team'
const About = () => {
  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div>
        <Details/>
      </div>
      <div>
        <Team/>
      </div>
      <div id='footer2'>
        <Footer/>
      </div>
    </div>
  )
}

export default About

