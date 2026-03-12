import React from 'react'
import { Link } from 'react-router-dom'
import img1 from '../images/food4.jpg'
import img2 from '../images/food5.avif'
import img3 from '../images/food6.jpg'
import img4 from '../images/food7.jpg'
import './Side.css'
const dishes = [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
    { id: 4, img: img4 },
];

const Side = () => {
  return (
    <section className='side-section'>
      <h1 className='side-title'>Signature Dishes</h1>
      <div className='img-container'>
        {dishes.map((dish) => (
          <div className='imgfood' key={dish.id}>
            <img src={dish.img} alt={`dish-${dish.id}`} />
          </div>
        ))}
      </div>
      <Link className='menu-btn' to='/menu'>Full Menu</Link>
    </section>
  );
}

export default Side
