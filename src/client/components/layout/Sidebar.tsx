import React from 'react'
import Nav from './Nav'

const Sidebar = () => {
  return (
    <div className='hidden lg:flex w-[18rem]'>
      <Nav />
    </div>
  )
}

export default Sidebar