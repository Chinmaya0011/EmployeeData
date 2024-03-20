// Import the necessary modules
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import statement for useRouter
import Header from '../Components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import EmployeeList from '../Components/EmployeeList';
import AdminDashBoard from '../Components/AdminDashBoard';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore'; // Import where and query from firestore

// Define the Page component
const Page = () => {
  // Initialize state variables
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  // Effect hook to run once on component mount
  useEffect(() => {
    // Get the Firebase authentication instance
    const auth = getAuth();
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If user is not logged in, redirect to the login page
        router.push('/Login');
        // Display a SweetAlert for redirection
        Swal.fire({
          icon: 'info',
          title: 'Please Login...',
          text: 'You are being redirected to the login page',
          showConfirmButton: false,
          timer: 2000 // Adjust timer as needed
        });
      } else {
        try {
          // Get Firestore instance
          const db = getFirestore();
          // Query the 'users' collection
          const q = query(collection(db, 'users'), where('uid', '==', user.uid));
          // Get all documents in the collection that match the current user's uid
          const querySnapshot = await getDocs(q);
          // If there's a document for the current user
          if (!querySnapshot.empty) {
            // Get the user data
            const userData = querySnapshot.docs[0].data();
            // Check if userType is 'company'
            setIsAdmin(userData.userType === 'company');
          } else {
            // If no user document found, user is not admin
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error appropriately
          Swal.fire({
            icon: 'error',
            title: 'Error fetching user data',
            text: error.message
          });
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Render loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the main content based on isAdmin state
  return (
    <div>
      <Header />
      {/* Render EmployeeList if user is not admin */}
      {!isAdmin && <EmployeeList />}
      {/* Render AdminDashBoard if user is admin */}
      {isAdmin && <AdminDashBoard />}
      <Footer />
    </div>
  );
}

export default Page;
