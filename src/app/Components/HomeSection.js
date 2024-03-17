import React from 'react';
import style from '../Styles/Home.module.css';
import Link from 'next/link';
const HomeSection = () => {
  return (
    <div className={style.home}>
      <div className={style.face}>
        <button className={style.faceRecognitionButton}>Face Recognition</button>
      </div>
      <div className={style.buttonsContainer}>
        <Link href={'registration'} className={style.signUpButton}>Registration </Link>
        <Link href={'Login'} className={style.loginButton}>Login</Link>
      </div>
    </div>
  );
};

export default HomeSection;
