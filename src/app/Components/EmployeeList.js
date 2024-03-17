import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp from Firestore
import style from '../Styles/EmployeeList.module.css'
import Swal from 'sweetalert2';
import Link from 'next/link';
import Loading from './Loading';
import { getStorage,storage } from 'firebase/storage';// Add this import statement
import EditEmployee from './EditEmployee';

  function EmployeeList() {

    const [employees, setEmployees] = useState([]);
    useEffect(() => {
      fetchEmployeeList();
    }, []);
const[edit,setEdit]=useState(false)
const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployeeList = async () => {
      try {
        const db = getFirestore();
        const employeeCollection = collection(db, 'employeeList');
        const snapshot = await getDocs(employeeCollection);
        const employeeList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const handleDeleteEmployee = async (id) => {
      try {
        // Delete employee document from Firestore
        const db = getFirestore();
        await deleteDoc(doc(db, 'employeeList', id));

            // Create storage reference within the functionff
// Assuming Firebase is initialized elsewhere

        fetchEmployeeList();

        // Show success message
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
      setEdit(true);
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
            <h2 className={style.myh2}>Employee List</h2>
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
                      <img src={employee.photoURL} alt={employee.name} className={style.image} />
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
            {edit && selectedEmployee ? <EditEmployee employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} /> : null}

          </>
        )}
      </div>

    );
  }

export default EmployeeList;
