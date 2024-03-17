import React from 'react';
import style from '../Styles/Footer.module.css';

const Footer = () => {
  return (
    <div className={style.footer}>
      <footer>
        <div className={style.footerItem}>About Us</div>
        <div className={style.footerItem}>Contact Us</div>
        <div className={style.footerItem}>Terms and Conditions</div>
        <div className={style.footerItem}>Social Media</div>
      </footer>
    </div>
  );
};

export default Footer;

