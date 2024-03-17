
import React, { useState } from 'react';
import { getFirestore, doc, updateDoc, firestore} from 'firebase/firestore';
import styles from '../Styles/Edit.module.css'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function EditEmployee({ employee, onClose }) {
  const [updatedEmployee, setUpdatedEmployee] = useState({
    name: employee.name,
    email: employee.email,
    mobile: employee.mobile,
    designation: employee.designation,
    courses: Array.isArray(employee.courses) ? employee.courses : [], // Initialize courses as an array
    gender: employee.gender, // Assuming gender is present in employee
    image: null, // Add this line for the image, assuming it's handled separately
  });

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      // Handle checkbox changes
      setUpdatedEmployee(prevState => ({
        ...prevState,
        [name]: checked
          ? [...prevState[name], value]
          : prevState[name].filter(course => course !== value)
      }));
    } else if (type === "file") {
      // Handle file input changes
      setUpdatedEmployee(prevState => ({
        ...prevState,
        [name]: files[0] || null // Use files[0] if it exists, otherwise set to null
      }));
    } else {
      // For other input types, update the state normally
      setUpdatedEmployee(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
  
    try {
      const db = getFirestore();
      const employeeDoc = doc(db, 'employeeList', employee.id);
  
      // Check if image file is present
      if (updatedEmployee.image) {
        // Upload the image file to Firebase Storage
        const storageRef = ref(getStorage(), `userPhotos/${employee.id}`);
        await uploadBytes(storageRef, updatedEmployee.image);
        
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update the Firestore document with the image URL
        await updateDoc(employeeDoc, {
          photoURL: downloadURL // Update the photoURL field
        });
      }
  
    //   // Update other fields in the Firestore document
    //   await updateDoc(employeeDoc, {
    //     name: updatedEmployee.name,
    //     email: updatedEmployee.email,
    //     mobile: updatedEmployee.mobile,
    //     designation: updatedEmployee.designation,
    //     courses: updatedEmployee.courses,
    //     gender: updatedEmployee.gender,
    //     // Add other fields as needed
    //   });
  
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
            <button className={styles.closeForm} onClick={onClose}>X</button>
  <div className={styles.inputGroup}>
          <label className={styles.label}>Name:</label>
          <input type="text" name="name" value={updatedEmployee.name} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email:</label>
          <input type="email" name="email" value={updatedEmployee.email} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mobile:</label>
          <input type="tel" name="mobile" value={updatedEmployee.mobile} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Designation:</label>
          <select name="designation" value={updatedEmployee.designation} onChange={handleChange} className={styles.input}>
            <option value="">Select Designation</option>
            <option value="Hr">Hr</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Gender:</label>
          <label className={styles.radioLabel}><input type="radio" name="gender" value="Male" checked={updatedEmployee.gender === 'Male'} onChange={handleChange} className={styles.radio} /> Male</label>
          <label className={styles.radioLabel}><input type="radio" name="gender" value="Female" checked={updatedEmployee.gender === 'Female'} onChange={handleChange} className={styles.radio} /> Female</label>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Courses:</label>
          <label className={styles.checkboxLabel}><input type="checkbox" name="courses" value="Mca" checked={updatedEmployee.courses.includes('Mca')} onChange={handleChange} className={styles.checkbox} /> Mca</label>
          <label className={styles.checkboxLabel}><input type="checkbox" name="courses" value="Bca" checked={updatedEmployee.courses.includes('Bca')} onChange={handleChange} className={styles.checkbox} /> Bca</label>
          <label className={styles.checkboxLabel}><input type="checkbox" name="courses" value="Bsc" checked={updatedEmployee.courses.includes('Bsc')} onChange={handleChange} className={styles.checkbox} /> Bsc</label>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Image:</label>
          <input type="file" name="image" onChange={handleChange} className={styles.fileInput} />
        </div>
        <button type="submit" className={styles.submitButton}>Submit</button>
        <button className={styles.submitButton} onClick={onClose}>X</button>

      </form>
    </div>
  );
}

export default EditEmployee;
