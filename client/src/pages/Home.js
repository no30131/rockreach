import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utils/token";
import "./stylesheets/Home.css";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 599);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 599);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="landing-page">
        <img src={isMobile ? `${process.env.PUBLIC_URL}/images/m-home1.png` : `${process.env.PUBLIC_URL}/images/home1.png`} alt="home1" />
        <div className="home1-signup-area">
          <Link
            to={isLogged ? "/personal" : "/signup"}
          >
            <button className="home-signup-button">立即體驗</button>
          </Link>
        </div>
      </div>
      <div className="landing-page">
        <img src={isMobile ? `${process.env.PUBLIC_URL}/images/m-home2.png` : `${process.env.PUBLIC_URL}/images/home2.png`} alt="home2" />
      </div>
      <div className="landing-page">
        <img src={isMobile ? `${process.env.PUBLIC_URL}/images/m-home3.png` : `${process.env.PUBLIC_URL}/images/home3.png`} alt="home3" />
      </div>
      <div className="landing-page">
        <img src={isMobile ? `${process.env.PUBLIC_URL}/images/m-home4.png` : `${process.env.PUBLIC_URL}/images/home4.png`} alt="home4" />
        <div className="home1-signup-area">
          <Link
            to={isLogged ? "/personal" : "/signup"}
          >
            <button className="home-signup-button">立即體驗</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
