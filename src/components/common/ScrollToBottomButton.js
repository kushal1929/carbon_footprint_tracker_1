// ScrollToBottomButton.js
import React, { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./FloatingActionButton.css"; 
import "./Tailwind.css";

const ScrollToBottomButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Adjust the scroll threshold as needed
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className="fixed bottom-10 right-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg fab animate-pulse animate-infinite animate-duration-2000 animate-ease-out animate-alternate"
          onClick={scrollToBottom}
        >
          <FaArrowDown />
        </button>
      )}
    </>
  );
};

export default ScrollToBottomButton;
