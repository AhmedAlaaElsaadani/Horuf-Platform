import Lottie from "lottie-react";
import React from "react";
import homeAnimation from "../../assets/animations/Home.json";
import style from "./Home.module.css";
export default function Home() {
  return (
    <section id="Home" className={style.Home}>
      <div className="container  ">
        <div className="row bg-danger">
          <div className="col-6">
            <h1>Home</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              iusto accusamus consectetur iste sapiente eligendi dicta, est hic
              odit dolorem facere earum libero ea veritatis quibusdam laboriosam
              asperiores cumque rem.
            </p>
          </div>
          <div className="col-5 offset-1">
            <Lottie animationData={homeAnimation} />
          </div>
        </div>
      </div>
    </section>
  );
}
