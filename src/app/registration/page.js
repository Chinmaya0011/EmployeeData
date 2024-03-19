'use client'
import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import style from '../Styles/Signup.module.css';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    mobileNumber: '',
    userType: 'company' // Default value for user type
  });
const router=useRouter()
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
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      // Upload photo to Firebase Storage
      const storage = getStorage();
      const photoRef = ref(storage, `userPhotos/${user.uid}/${formData.photo.name}`);
      await uploadBytes(photoRef, formData.photo);
  
      // Get download URL for the photo
      const photoURL = await getDownloadURL(photoRef);
  
      // Add user data to Firestore
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      await addDoc(usersCollection, {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        photoURL: photoURL,
        userType: formData.userType // Add userType to Firestore
      });
  
      // Clear form data
      setFormData({
        name: '',
        email: '',
        password: '',
        photo: '',
        mobileNumber: '',
        userType: 'company' // Reset user type to default
      });
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Registration successful!',
        text: 'You have successfully registered.',
      });
    } catch (error) {
      // Handle error
      console.error(error.message);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Registration failed!',
        text: error.message,
      });
    }
  };

  return (
    <div>
      <Header />
      <h2 className={style.title}>Registration</h2>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.formGroup}>
          <label className={style.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={style.input}
            required
          />
        </div>
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={style.input}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label}>Upload Photo:</label>
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/*"
            className={style.input}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label}>Mobile Number:</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={style.input}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label}>User Type:</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className={style.input}
          >
            <option value="company">Company</option>
            <option value="team">Team</option>
          </select>
        </div>
        <button type="submit" className={style.submitButton}>Register</button>
        <div className={style.loginLink}>
          <p>Already registered?</p>
          <Link className={style.loginButton} href="/Login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Page;
