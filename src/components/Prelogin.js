import { useNavigate } from 'react-router-dom';
import Prelogin_2 from './Prelogin_2';
import Prelogin_3 from './Prelogin_3';
import * as React from "react";
import './common/Tailwind.css'
import ScrollToBottomButton from '../components/common/ScrollToBottomButton';

export const Element = () => { 

  const navigate=useNavigate();
  const gotoLogin = () => {
    navigate('/login');
  };
  const gotoRegister = () => {
    navigate('/register');
  };
  
  return (
    <div className="h-screen max-w-screen bg-cover bg-[url('../../assets/image_1.jpg')]">
      <div className="absolute flex items-center h-[90%] w-[95%] my-[3%] mr-[3%] ml-[2%] rounded-[66px] bg-white">
        <div className="w-full relative flex flex-wrap lg:h-full lg:w-[97%] lg:items-start lg:pl-16">
          <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:items-start lg:mt-[8%]">
            <div className="text-5xl font-PJSbold lg:text-[6vw] animate-fade animate-once animate-duration-[3000ms] animate-ease-out animate-alternate">
              ECOLIBRIUM
            </div>
            <p className="mt-[12%] text-lg lg:text-[2vw] text-gray-500 font-WorkSans animate-fade animate-delay-500 animate-once animate-duration-[3000ms] animate-ease-out animate-alternate">
              Transforming tomorrow,
            </p>
            <p className="mt-1 text-lg lg:text-[2vw] text-gray-500 font-WorkSans animate-fade animate-delay-500 animate-once animate-duration-[3000ms] animate-ease-out animate-alternate">
              one footprint at a time.
            </p>
            <div className="flex mt-[8%]">
              <button
                onClick={gotoRegister}
                className="w-28 lg:w-[9vw] px-4 py-2 mr-8 text-white uppercase bg-black border-2 border-transparent rounded-lg text-md hover:bg-white hover:text-black hover:border-black animate-fade-up animate-delay-500 animate-once animate-duration-[3000ms] animate-ease-out animate-alternate"
              >
                Signup
              </button>
              <button
                onClick={gotoLogin}
                className="w-28 lg:w-[9vw] px-4 py-2 text-black uppercase bg-transparent border-2 border-black rounded-lg hover:bg-gray-800 hover:text-white text-md animate-fade-up animate-delay-500 animate-once animate-duration-[3000ms] animate-ease-out animate-alternate"
              >
                Login
              </button>
            </div>
          </div>

          <div className="relative h-0 w-full lg:h-full lg:w-1/2">
            <img
              alt="HomePage"
              src={require("../assets/prelogin.jpg")}
              className="absolute inset-0 h-full w-full object-contain animate-fade animate-once animate-duration-[3000ms] animate-ease-out animate-alternate"
            />
          </div>
          <ScrollToBottomButton/>
        </div>
      </div>
    </div>
  ); 
  };







function Prelogin() {

  return (  
    <> 
      <Element/>
      <Prelogin_2/>
      <div className='hidden sm:block'> <Prelogin_3/> </div>
    </>
  );
}

export default Prelogin;