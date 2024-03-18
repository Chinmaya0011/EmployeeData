'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router instead of next/navigation
import Header from '../Components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import EmployeeList from '../Components/EmployeeList';
import AdminDashBoard from '../Components/AdminDashBoard';

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
        // Check if the user's email address is equal to the admin email
        if (user.email === 'imchinu17@gmail.com') {
          setIsAdmin(true);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header/>
      {!isAdmin && <EmployeeList/>} {/* Render EmployeeList only if user is not admin */}
      {isAdmin && <AdminDashBoard/>} {/* Render AdminDashBoard only if user is admin */}
      <Footer/>
    </div>
  );
}

export default Page;
