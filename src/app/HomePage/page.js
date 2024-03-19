"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router instead of next/navigation
import Header from '../Components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import EmployeeList from '../Components/EmployeeList';
import AdminDashBoard from '../Components/AdminDashBoard';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Import getDocs from firestore

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/Login');
        // Display SweetAlert for redirection
        Swal.fire({
          icon: 'info',
          title: 'Please Login...',
          text: 'You are being redirected to the login page',
          showConfirmButton: false,
          timer: 2000 // Adjust timer as needed
        });
      } else {
        try {
          const db = getFirestore();
          const q = collection(db, 'users');
          const querySnapshot = await getDocs(q);
          const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Check if any employee has userType set to 'company'
          const  hasCompanyUser= employeeList.find(employee => employee.userType === 'company');
          console.log(hasCompanyUser)
          setIsAdmin(hasCompanyUser);
        } catch (error) {
          console.error('Error fetching employee list:', error);
          // Handle error appropriately
          Swal.fire({
            icon: 'error',
            title: 'Error fetching employee list',
            text: error.message
          });
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      {!isAdmin && <EmployeeList />} {/* Render EmployeeList only if user is not admin */}
      {isAdmin && <AdminDashBoard />} {/* Render AdminDashBoard only if user is admin */}
      <Footer />
    </div>
  );
}

export default Page;
