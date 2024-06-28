import React from 'react'
import './Cover.css'
import coverphoto from '../Assets/Images/file1.png'
import coverphoto1 from '../Assets/Images/mobile.avif'

export default function Cover() {
  return (
    <>

      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-md-12 poster">
           <div className="col-md-6 col-sm-10 text-white coverText">
            <h1>Connect your friends</h1>
            <h3>With real time communication</h3>
            <h4>Have your best chat</h4>
           </div>
            <img className='coverPhoto' src={coverphoto} alt="" />

          </div>
        </div>
       
      </div>


{/* <div className="container-fluid">
<div className="row">
          <img style={{width : "100%" , height : "20vh"}} src={coverphoto} alt="" />
        </div>
</div> */}
    </>
  )
}
