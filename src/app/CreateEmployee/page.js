'use client'
import React, { useState } from 'react';
import styles from '../Styles/EmployeeCreate.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { auth } from '../firebase/firebaseconfig';
import Loading from '../Components/Loading';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const EmployeeCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          courses: [...formData.courses, value]
        });
      } else {
        setFormData({
          ...formData,
          courses: formData.courses.filter(course => course !== value)
        });
      }
    } else if (type === 'file') {
      const file = files[0];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        setFormData({
          ...formData,
          [name]: file
        });
      } else {
        alert('Please upload a JPG or PNG file.');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        const db = getFirestore();
        const usersCollection = collection(db, 'employeeList');
        
        // Check if the email already exists
        const querySnapshot = await getDocs(query(usersCollection, where('email', '==', formData.email), where('userId', '==', currentUser.uid)));
        if (!querySnapshot.empty) {
          setEmailExistsError('Email already exists');
          setLoading(false);
          return;
        }
        
        const storage = getStorage();
        const photoRef = ref(storage, `userPhotos/${currentUser.uid}/${formData.image.name}`);
        await uploadBytes(photoRef, formData.image);
        const photoURL = await getDownloadURL(photoRef);
  
        // Add the current user's ID to the form data
        const formDataWithUserId = {
          ...formData,
          userId: currentUser.uid,
          image: photoURL // Set the image field to the URL of the uploaded image
        };
  
        await addDoc(usersCollection, {
          ...formDataWithUserId,
          createDate: serverTimestamp()
        });
  
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          courses: [],
          image: null
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'You have successfully registered.',
        });
      } catch (error) {
        console.error(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Registration failed!',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.designation || !formData.gender || formData.courses.length === 0 || !formData.image) {
      alert('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (isNaN(formData.mobile)) {
      alert('Please enter a numeric value for mobile.');
      return false;
    }
    return true;
  };

  return (
    <>
      <Header/>
      <div className={styles.ecreate}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <h2 className={styles.title}>Employee Create</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Mobile:</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Designation:</label>
                <select name="designation" value={formData.designation} onChange={handleChange} className={styles.input}>
                  <option value="">Select Designation</option>
                  <option value="Hr">Hr</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Gender:</label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className={styles.radio} /> Male</label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className={styles.radio} /> Female</label>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Courses:</label>
                <label className={styles.checkboxLabel}><input type="checkbox" name="course" value="Mca" checked={formData.courses.includes('Mca')} onChange={handleChange} className={styles.checkbox} /> Mca</label>
                <label className={styles.checkboxLabel}><input type="checkbox" name="course" value="Bca" checked={formData.courses.includes('Bca')} onChange={handleChange} className={styles.checkbox} /> Bca</label>
                <label className={styles.checkboxLabel}><input type="checkbox" name="course" value="Bsc" checked={formData.courses.includes('Bsc')} onChange={handleChange} className={styles.checkbox} /> Bsc</label>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Image:</label>
                <input type="file" name="image" onChange={handleChange} className={styles.fileInput} />
              </div>
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
            {emailExistsError && (
              <p className={styles.error}>{emailExistsError}</p>
            )}
          </>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default EmployeeCreate;
