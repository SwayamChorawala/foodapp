import React from 'react'
import image1 from '../../assets/image1.avif';
   import { LuLeafyGreen } from "react-icons/lu";
       import { GiChickenOven } from "react-icons/gi";
       import { RiDeleteBin6Line } from "react-icons/ri";
    import './Card.css'
import { useDispatch } from 'react-redux';
import { addtocard, removeitem } from '../../redux/CreateSlice';
const Card = ({item, showAddToCartButton = true,removecard=false}) => {
    const dispatch=useDispatch()
  return (
    <div>
        <div>
            {removecard && (
                    <div >
                        
                       <RiDeleteBin6Line className='removebtn' onClick={()=>dispatch(removeitem(item.id))}/>
                    </div>
                )}
        </div>
      <div className='card'>
        <div className='card-img'>
              <img src={item.image} alt="Bread & dips" />
        </div>
        <div className='card-content'>
            <div className='card-title'>
                {item.title}
            </div>
            <div className='card-desc'>
                <p>
                   {item.desc}
                </p>
            </div>
            
            <div className='card-footer'>
                <div className="footer-top">
                    <div className='card-type veg'>
                        {item.type==="veg" ?<LuLeafyGreen/>:<GiChickenOven/>}
                    </div>
                    <div className='card-price'>
                        ₹{item.price}
                    </div>
                </div>
                {showAddToCartButton && (
                    <div className="add-btn-wrapper">
                        <button className='add-btn' onClick={() => dispatch(addtocard(item))}>Add to Cart</button>
                    </div>
                )}
                <div className="quantity-wrapper">
      
        </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Card
