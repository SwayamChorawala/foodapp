import React from 'react'
import './Team.css'
const Team = () => {
  return (
    <div>
      <div className='main2'>
        <h1 id='hc'>Our Team</h1>
        <div className="teams-grid">
          <div className="chef-card">
            <img src="chef1.avif" alt="Jone Lake" id='chef1' />
            <p id='pc'>Jone Lake</p>
            <p id='pc2'>Chef</p>
          </div>
          <div className="chef-card">
            <img src="chef2.avif" alt="Rick Landry" id='chef2' />
            <p id='pc3'>Rick Landry</p>
            <p id='pc4'>So-Chef</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team
