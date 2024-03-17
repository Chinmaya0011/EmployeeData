'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router instead of next/navigation
import Header from '../Components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import EmployeeList from '../Components/EmployeeList';

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      <EmployeeList/>
      <Footer/>
    </div>
  );
}

export default Page;
