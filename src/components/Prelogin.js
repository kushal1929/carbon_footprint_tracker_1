import './Prelogin.css';

import * as React from "react";



export const Element = () => { 
  return (
     <div className="element"> 
      <div className="image-background"> 
        <div className="white-rectangle" > 

          <div class="left-half">
            <div className='heading'>
              <div className='text'>ECOLIBRIUM</div>
            </div>
            <div className='phrase'>
              <p className='text1'> 
                <span className="text11"> Transforming tomorrow, <br /> </span> 
              </p> 
              <p className="text2"> 
                <span className="text22">one footprint at a time.</span> 
              </p>
            </div>
            <div className='buttons'>
              <button className='signup' onClick={() => window.location.href = '/register'}><div className='signup_text'>Signup</div></button>
              <button className='login' onClick={() => window.location.href = '/login'}><div className='login_text'>Login</div></button>
            </div>
          </div>
          <div class="right-half">
            <div className="box"> 
              <div className='front_img'/>
            </div>
          </div>

        </div>
      </div>
    <div className='page2'></div> 
    </div> ); 
  };







function Prelogin() {

  return (   
      <Element/>
  );
}

export default Prelogin;