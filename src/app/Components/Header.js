// use client directive (if rendering in Next.js 13+)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import style from '../Styles/Header.module.css';
import logo from '../../../public/employee.jpg';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import { useState, useEffect } from 'react';

const Header = () => {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState('');
  const [user, setUser] = useState(null); // State to hold user data
  const [userName, setUserName] = useState(''); // Added state for user name
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    // Correctly get the user and fetch profile data
    const fetchUserProfile = async () => {
      try {
        const currentUser = auth.currentUser; // Use currentUser directly
        if (currentUser) {
          setUser(currentUser);
          const db = getFirestore();
          const usersCollection = collection(db, 'users'); // Using collection directly

          // Using query for flexibility (optional)
          const q = query(usersCollection, where('uid', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData) {
              setPhotoUrl(userData.photoURL);
              setUserName(userData.name);
            }
          });
        } else {
          console.log('No user is currently authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error state here
      }
    };

    fetchUserProfile();
  }, []);


  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Swal.fire({
        title: 'Logged out',
        text: 'You have been logged out successfully',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        router.push('/');
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while logging out',
        icon: 'error',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };
  return (
    <header className="bg-gray-900 text-white py-4 px-8 flex items-center justify-between">
    <div className="flex items-center">
      {user ? (
        <Link href="/HomePage" className="text-xl font-bold mr-4">
          MyStaff
        </Link>
      ) : (
        <Link href="/" className="text-xl font-bold mr-4">
          MyStaff
        </Link>
      )}
    
    </div>
    <div className="flex justify-center flex-grow">
      {/* Centered navigation */}
      <ul className="flex space-x-4">
      <li>
          {user && (
        <div className="mr-4">
          <Link href="/CreateEmployee" className="text-white hover:text-gray-300">
            Add Staff
          </Link>
        </div>
      )}
    </li>
  
   
        {/* Add more navigation links as needed */}
      </ul>
    </div>
    {user && (
      <div className="relative">
        <button
          className="focus:outline-none"
          onClick={toggleDropdown}
        >
          <img
            src={photoUrl || '/default-user-photo.jpg'} // Use default photo if user photo not available
            alt="User Photo"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </button>
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-10">
          <div className="px-4 py-3">
  <p className="text-gray-800 font-medium">{userName}</p>
  <p className="text-gray-500 text-sm">{user.email}</p> {/* Replace userEmail with the appropriate variable */}
</div>

            <div className="border-t border-gray-200">
              <button
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </header>
  );
};

export default Header;
