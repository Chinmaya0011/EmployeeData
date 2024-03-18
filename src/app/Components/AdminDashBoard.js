'use client'
import React, { useEffect, useState } from 'react';
import style from '../Styles/EmployeeList.module.css'
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';
import EditEmployee from '../Components/EditEmployee';
import { auth } from '../firebase/firebaseconfig';
import { createRoot } from 'react-dom'; // Updated import to use createRoot
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const fetchEmployeeList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found.');
        return;
      }

      const db = getFirestore();
      const q = query(collection(db, 'employeeList'))
      const querySnapshot = await getDocs(q);
      const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'employeeList', id));
      fetchEmployeeList();
      Swal.fire({
        icon: 'success',
        title: 'Employee Deleted!',
        text: 'The employee has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    Swal.fire({
      title: 'Edit Employee',
      html: '<div id="editEmployeeForm"></div>',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      didOpen: () => {
        createRoot(document.getElementById('editEmployeeForm')).render(<EditEmployee employee={employee} onClose={handleCloseEditEmployee} />);
      },
    });
  };

  const handleCloseEditEmployee = () => {
    setSelectedEmployee(null);
    Swal.close();
  };

  return (
   
    <div className={`${style.eList} ${style.employeeListContainer}`}>
      
      {employees.length === 0 ? (
        <div className={style.addemployee}>
          <Link href={'/CreateEmployee'} className={style.createstaff}>
            Add Staff
          </Link>
        </div>
      ) : (
        <>
          <h2 className={style.myh2}>All Employee</h2>
          <table className={style.employeeTable}>
            <thead className={style.tableHeader}>
              <tr>
                <th className={style.tableHeaderCell}>Image</th>
                <th className={style.tableHeaderCell}>Name</th>
                <th className={style.tableHeaderCell}>Email</th>
                <th className={style.tableHeaderCell}>Mobile No</th>
                <th className={style.tableHeaderCell}>Designation</th>
                <th className={style.tableHeaderCell}>Course</th>
                <th className={style.tableHeaderCell}>Create Date</th>
                <th className={style.tableHeaderCell}>Action</th>
              </tr>
            </thead>
            <tbody className={style.tableBody}>
              {employees.map(employee => (
                <tr key={employee.id} className={style.tableRow}>
                  <td className={style.tableCell}>
                    <Image src={employee.image} alt={employee.name} width={100} height={100} className={style.image} />
                  </td>
                  <td className={style.tableCell}>{employee.name}</td>
                  <td className={style.tableCell}>{employee.email}</td>
                  <td className={style.tableCell}>{employee.mobile}</td>
                  <td className={style.tableCell}>{employee.designation}</td>
                  <td className={style.tableCell}>
                    {Array.isArray(employee.courses) ? employee.courses.join(', ') : employee.courses}
                  </td>
                  <td className={style.tableCell}>
                    {employee.createDate ? new Date(employee.createDate.seconds * 1000).toLocaleDateString('de-DE') : ''}
                  </td>
                  <td className={style.tableCell}>
                    <button onClick={() => handleEditEmployee(employee)} className={style.editButton}>Edit</button>
                    <button onClick={() => handleDeleteEmployee(employee.id)} className={style.deleteButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </>
      )}
    </div>      

  );
}

export default EmployeeList;
