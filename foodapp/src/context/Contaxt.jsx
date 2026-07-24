import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import './Context.css'
import { useForm } from 'react-hook-form'
import '../components/form.css'

const Contaxt = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })

  const onSubmit = (data) => {
    console.log('Form Data:', data)
    alert('Form submitted successfully!')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}
    >
      <Navbar />
      <div style={{ paddingTop: '3rem' }}>
        <motion.h1
          className='ch'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className='cp'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          We're here to answer any questions you may have. Reach out to us through the provided channels or drop by our restaurant for an unforgettable dining experience.
        </motion.p>

        <div className="contact-form-container">
          <motion.div
            className='form'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ maxWidth: 560, width: '100%' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className='form-title'>Get in Touch</h1>

              <div className='form-group'>
                <label htmlFor='firstname'>First Name</label>
                <input
                  id='firstname'
                  type='text'
                  placeholder='Enter your first name'
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                />
                {errors.firstName && <p className='error'>{errors.firstName.message}</p>}
              </div>

              <div className='form-group'>
                <label htmlFor='lastname'>Last Name</label>
                <input
                  id='lastname'
                  type='text'
                  placeholder='Enter your last name'
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                />
                {errors.lastName && <p className='error'>{errors.lastName.message}</p>}
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  })}
                />
                {errors.email && <p className='error'>{errors.email.message}</p>}
              </div>

              <div className='form-group'>
                <label htmlFor='message'>Message</label>
                <textarea
                  id='message'
                  placeholder='Enter your message'
                  rows='5'
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                />
                {errors.message && <p className='error'>{errors.message.message}</p>}
              </div>

              <button type='submit' className='submit-btn'>Submit</button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contaxt
