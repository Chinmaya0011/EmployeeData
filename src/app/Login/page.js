"use client"
import Header from '../Components/Header';
import React, { useState } from 'react';
import Link from 'next/link';
import style from '../Styles/Login.module.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation'; // Import useRouter hook from Next.js
import { auth } from '../firebase/firebaseconfig'; // Import the auth object from firebase.js
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  const router = useRouter(); // Initialize useRouter hook inside the component

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTogglePassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You have successfully logged in.',
        }).then(() => {
          router.push('/HomePage'); // Navigate to the homepage
        });
  
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      });
  };
  

  return (
    <>
    <Header/>
    <div className={style.login}>
        
      <h2 className={style.title}>Login</h2>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label className={style.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={style.input}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label}>Password:</label>
          <input
            type={formData.showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={style.input}
            required
          />
          <button type="button" onClick={handleTogglePassword} className={style.toggleButton}>
            {formData.showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <button type="submit" className={style.submitButton}>Login</button>
      </form>
      <div className={style.registerLink}>
        <p>Not registered yet? </p>
        <Link href="/registration">
          Register
        </Link>
      </div>
    </div></>
  );
};

export default LoginPage;
