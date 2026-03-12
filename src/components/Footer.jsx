import React from 'react'
import './footer.css'
import { useForm } from 'react-hook-form'
const Footer = () => {
      const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur'
      });
    const onSubmit = (data) => {
    console.log('Form Data:', data);
    alert('Form submitted successfully!');
  }
  return (
    <footer className='section11'>
            <div className='footer-left'>
                <h1 className='hf'>
                    The chef
                    <br />
                    and the table
                </h1>
                <p className='po'>
                    123-456-7890
                </p>
                <p className='pu'>
                    info@mysite.com
                </p>
                <p className='pf'>
                    Terms & Conditions
                    <br />
                    Privacy Policy
                    <br />
                    Accessibility statement
                </p>
            </div>
            <div className='section12'>
                <h1 className='pi'>
                    Stay in Touch
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form9'>
                        <label htmlFor='newsletter-email'>Email</label>
                        <input
                            id='newsletter-email'
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
                        {errors.email && <p className='error2'>{errors.email.message}</p>}
                        <button type='submit' className='submit1'>Submit</button>
                    </div>
                </form>
            </div>
    </footer>
  )
}

export default Footer
