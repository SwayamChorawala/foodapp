import React from 'react'
import './Card2.css'
import { useDispatch, useSelector } from 'react-redux'
import Card from './Card'
import Navbar from '../Navbar'
  import { increaseQuantity, decreaseQuantity } from '../../redux/CreateSlice'

const Card2 = () => {
  
  const items = useSelector(state => state.app)

  const subtotal = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0)

  const deliveryFee = 20
  const taxes = subtotal * 5 / 100 // 5% tax
  const total = subtotal + deliveryFee + taxes
  const dispatch=useDispatch()
  return (
    <div>

      <Navbar />

      <div className='menu-container'>

        <div className='menu-header'>
          <h1>Your Cart</h1>
        </div>

        {items.length === 0 ? (

          <div className="cart-empty">
            <p>
            Your cart is empty.
            </p>
          </div>

        ) : (

          <div className="cart-page-container">
            <div className="cart-items-section">
              <div className='menu-grid'>
                {items.map((item) => (
                  <div key={item.id} className="cart-item-wrapper">
                    <Card item={item} showAddToCartButton={false} removecard={true} />
                    <div className="quantity-controls">
                      <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-summary-section">
              <h2>Order Summary</h2>
              <div className="summary-item">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="summary-item">
                <p>Delivery Fee</p>
                <p>₹{deliveryFee.toFixed(2)}</p>
              </div>
              <div className="summary-item">
                <p>Taxes (5%)</p>
                <p>₹{taxes.toFixed(2)}</p>
              </div>
              <hr />
              <div className="summary-total">
                <h3>Total</h3>
                <h3>₹{total.toFixed(2)}</h3>
              </div>
            </div>
          </div>

        )}

      </div>

    </div>
  )
}

export default Card2