import React from 'react'
import Navbar from "../Widgets/Navbar"
import Cover from '../Widgets/Cover'

export default function Home() {
  return (
    <div>
      <Navbar/>
      {/* <br/> */}
      <Cover/>

      <h1 className='text-center'>This is Home section</h1>
    </div>
  )
}
