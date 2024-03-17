// EditEmployee.js
'use client'
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

function EditEmployee() {
    const router = useRouter();
    const employeeId = router.query?.employeeId;

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee(employeeId);
    }
  }, [employeeId]);

  const fetchEmployee = async (id) => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'employeeList', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmployee({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Update employee document in Firestore with new data
    try {
      const db = getFirestore();
      const employeeRef = doc(db, 'employeeList', employeeId);
      await updateDoc(employeeRef, {
        // Update fields with new values from the form
        // For example:
        // name: event.target.name.value,
        // email: event.target.email.value,
        // mobile: event.target.mobile.value,
        // designation: event.target.designation.value,
        // courses: [event.target.courses.value],
        // Add other fields as needed
      });
      // Redirect back to EmployeeList after successful update
      router.push('/EmployeeList');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Form fields for editing employee details */}
        {/* Example:
            <input type="text" defaultValue={employee.name} name="name" />
            <input type="email" defaultValue={employee.email} name="email" />
            <input type="tel" defaultValue={employee.mobile} name="mobile" />
            <input type="text" defaultValue={employee.designation} name="designation" />
            <input type="text" defaultValue={employee.courses.join(', ')} name="courses" />
            Add other fields as needed
        */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEmployee;
