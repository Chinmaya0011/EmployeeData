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
    <header>
      <div className={style.header}>
        <div className={style.logoContainer}>
          {user ? (
            <Link href={'/HomePage'} className={style.heading}>
              MyStaff
            </Link>
          ) : (
            <Link href={'/'} className={style.heading}>
              MyStaff
            </Link>
          )}
        </div>
        {user && (
          <div className={style.navContainer}>
            <ul className={style.headerUl}>
              <li className={style.headerLi}>
                <div className={style.addStaffLink}>
                  <Link href={'/CreateEmployee'} className={style.createstaff}>
                    Add Staff
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        )}
        <div className={style.navContainer}>
          <nav className={style.headerNav}>
            <ul className={style.headerUl}>
              {user ? (
                <li className={style.headerLi}>
                  {photoUrl ? (
                    <div className={style.userContainer}>
                      <Image src={photoUrl} alt="User Photo" width={100} height={100} className={style.headerUserPic} />
                      <span>{userName}</span>
                    </div>
                  ) : (
                    <Image src={logo} alt="Company Logo" width={100} height={100} className={style.headerUserPic} />
                  )}
                </li>
              ) : null}
              {user ? (
                <li className={style.headerLi}>
                  <button className={style.headerButton} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
