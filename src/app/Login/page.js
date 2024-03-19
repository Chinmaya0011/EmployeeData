"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../Components/Header';
import style from '../Styles/Login.module.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2';
import Link from 'next/link';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect to homepage
        router.push('/HomePage');
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'You have successfully logged in.',
      }).then(() => {
        router.push('/HomePage'); // Navigate to the homepage
      });
    } catch (error) {
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  return (
    <>
      <Header />
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
      </div>
    </>
  );
};

export default LoginPage;
