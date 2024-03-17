'use client'
import React, { useState } from 'react';
import styles from '../Styles/EmployeeCreate.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'; // Include getDocs, query, and where for Firestore queries
import Swal from 'sweetalert2';
import { auth } from '../firebase/firebaseconfig'
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
  const [loading, setLoading] = useState(false); // State variable for loading status


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
      // File type validation
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
    // Client-side validations
    if (validateForm()) {
      try {
        setLoading(true); // Set loading to true when data upload begins
  
        const authUser = auth.currentUser;
  
        // Check if email already exists
        const db = getFirestore();
        const usersCollection = collection(db, 'employeeList');
        const querySnapshot = await getDocs(query(usersCollection, where('email', '==', formData.email)));
        if (!querySnapshot.empty) {
          throw new Error('Email already exists');
        }
  
        // Upload photo to Firebase Storage
        const storage = getStorage();
        const photoRef = ref(storage, `userPhotos/${authUser.uid}/${formData.image.name}`);
        await uploadBytes(photoRef, formData.image);
        const photoURL = await getDownloadURL(photoRef);
  
        // Add user data to Firestore with creation timestamp
        await addDoc(usersCollection, {
          uid: authUser.uid,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          designation: formData.designation,
          gender: formData.gender,
          courses: formData.courses,
          photoURL: photoURL, // Save the download URL of the photo
          createDate: serverTimestamp() // Add server timestamp for creation date
          // Add other user data here if needed
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
  
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'You have successfully registered.',
        }).then(() => {
          setLoading(false); // Set loading to false after success message is closed
        });
      } catch (error) {
        // Handle error
        console.error(error.message);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Registration failed!',
          text: error.message,
        }).then(() => {
          setLoading(false); // Set loading to false after error message is closed
        });
      }
    }
  };
  
  const validateForm = () => {
    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.designation || !formData.gender || formData.courses.length === 0 || !formData.image) {
      alert('Please fill in all fields.');
      return false;
    }
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    // Numeric validation for mobile
    if (isNaN(formData.mobile)) {
      alert('Please enter a numeric value for mobile.');
      return false;
    }
    return true;
  };

  return (<>     <Header/>

    <div className={styles.ecreate}>
     {loading ? (
        <Loading /> // Show loading component when loading is true
      ) :(
        <React.Fragment>
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
          </React.Fragment>)}

          
    </div>
   <Footer/> </>
  );
};

export default EmployeeCreate;
