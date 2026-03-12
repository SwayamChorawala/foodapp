import React from 'react'
import { useForm } from 'react-hook-form'
import './form.css'

const Form = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    alert('Form submitted successfully!');
  }

  return (
    <section className='contact-form-section'>
      <img src='imgs.avif' alt='Dining setup' className='form-image' />
      <div className='form'>
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
      </div>
    </section>
  )
}

export default Form
