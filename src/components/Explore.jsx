import React from 'react'
import './Explore.css'
const Explore = () => {
  return (
    <div className='explore'>
        <div className='explore-text'>
              <img src="food.jpeg" alt="Food" className='img-photo' />
              <div className='text-area'>
                <h1>
                    Our
                    <br />
                     Culinary
                     <br />
                      Story
                </h1>
              </div>
              <div className='explore-p'>
                <p>Experience It</p>
                <p>
                    Immerse yourself in the unique dining experience at The Chef and the Table. With a focus on local ingredients, our seasonal tasting menus are crafted to perfection for a memorable and delicious dining adventure.
                </p>
              </div>
        </div>  
    </div>
  )
}

export default Explore
