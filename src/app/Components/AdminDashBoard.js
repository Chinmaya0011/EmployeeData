"use client"
import React, { useEffect, useState } from 'react';
import style from '../Styles/EmployeeList.module.css'
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';
import EditEmployee from '../Components/EditEmployee';
import { auth } from '../firebase/firebaseconfig';
import { createRoot } from 'react-dom/client';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [creatorList, setCreatorList] = useState([]);
  const [creatorFilter, setCreatorFilter] = useState('');
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
      const q = query(collection(db, 'employeeList'));
      const querySnapshot = await getDocs(q);
      const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeList);
      
      // Fetch the creator list
      const creatorList = [...new Set(employeeList.map(employee => employee.createdBy))];
      setCreatorList(creatorList);
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

  const handleImageClick = (imageUrl) => {
    Swal.fire({
      html: `<img src="${imageUrl}" style="max-width: 200px; max-height: 200px; display: block; margin: auto; border-radius: 50%;" />`,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        container: style.swalContainer,
        closeButton: style.swalCloseButton,
      }
    });
    
  };;

  const handleCloseImage = () => {
    Swal.close();
  };

  const handleCreatorFilter = (e) => {
    setCreatorFilter(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (creatorFilter === '' || employee.createdBy.toLowerCase().includes(creatorFilter.toLowerCase()))
  );
  const getInitials = (name) => {
    // Split the name into individual parts
    const parts = name.split(' ');
    
    // Initialize an empty string for initials
    let initials = '';
  
    // Loop through each part and extract the first character
    // Convert each character to uppercase
    parts.forEach(part => {
      initials += part.charAt(0).toUpperCase();
    });
  
    // Return the concatenated initials
    return initials;
  };

  return (
    <div className={`${style.eList} ${style.employeeListContainer}`}>
      <div className={style.serchEmployeesContainer}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={handleSearch}
          className={style.serchEmployees}
        />
        <select
          value={creatorFilter}
          onChange={handleCreatorFilter}
          className={style.dropdown}
        >
          <option value="">Filter by creator...</option>
          {creatorList.map((creator, index) => (
            <option key={index} value={creator}>{creator}</option>
          ))}
        </select>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className={style.addemployee}>
          <Link href={'/CreateEmployee'} className={style.createstaff}>
            Add Staff
          </Link>
        </div>
      ) : (
        <>
          <h2 className={style.myh2}>Company All Employee</h2>
          <table className={style.employeeTable}>
          <thead className={style.tableHeader}>
  <tr>
    <th className={style.tableHeaderCell}>Created By</th>
    <th className={style.tableHeaderCell}>Image</th>
    <th className={style.tableHeaderCell}>Name</th>
    <th className={style.tableHeaderCell}>Email</th>
    <th className={style.tableHeaderCell}>Mobile No</th>
    <th className={style.tableHeaderCell}>Designation</th>
    <th className={style.tableHeaderCell}>Course</th>
    <th className={style.tableHeaderCell}>Create Date</th>
    <th className={style.tableHeaderCell}>Create Time</th> {/* New column for creation time */}
    <th className={style.tableHeaderCell}>Action</th>
  </tr>
</thead>
<tbody className={style.tableBody}>
  {filteredEmployees.map(employee => (
    <tr key={employee.id} className={style.tableRow}>
      <td className={style.tableCell} title={employee.createdBy}>{getInitials(employee.createdBy)}</td>
      <td className={style.tableCell}>
        <div onClick={() => handleImageClick(employee.image)}>
          <Image src={employee.image} alt={employee.name} width={100} height={100} className={style.image} />
        </div>
      </td>
      <td className={style.tableCell}>{employee.name}</td>
      <td className={style.tableCell}>
        <a href={`tel:${employee.mobile}`}>{employee.mobile}</a>
      </td>
      <td className={style.tableCell}>
        <a href={`mailto:${employee.email}`}>{employee.email}</a>
      </td>
      <td className={style.tableCell}>{employee.designation}</td>
      <td className={style.tableCell}>
        {Array.isArray(employee.courses) ? employee.courses.join(', ') : employee.courses}
      </td>
      <td className={style.tableCell}>
        {employee.createDate ? new Date(employee.createDate.seconds * 1000).toLocaleDateString('de-DE') : ''}
      </td>
      <td className={style.tableCell}>
        {employee.createDate ? new Date(employee.createDate.seconds * 1000).toLocaleTimeString('de-DE') : ''}
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

      {/* Modal for displaying full image */}
      {selectedImage && (
        <div className={style.modalBackdrop} onClick={handleCloseImage}>
          <div className={style.modalContent}>
            <Image src={selectedImage} alt="Full Photo" width={300} height={300} />
          </div>
        </div>
      )}
    </div>      
  );
}

export default EmployeeList;