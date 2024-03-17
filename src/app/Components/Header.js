"use client"
import Link from 'next/link';
import Image from 'next/image';
import style from '../Styles/Header.module.css';
import logo from '../../../public/employee.jpg';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'; // Correct import statement
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { useState, useEffect } from 'react';

const Header = () => {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState('');
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUser(user); // Set the user state if authenticated
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const userSnapshot = await getDocs(usersCollection);
          userSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData && userData.photoURL) {
              setPhotoUrl(userData.photoURL);
            }
          });
        } else {
          console.log('No user is currently authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
          {user?<Link href={'/HomePage'} className={style.heading}>
            MyStaff
          </Link>:<Link href={'/'} className={style.heading}>
            MyStaff
          </Link>}
       
        </div>

        <div className={style.navContainer}>
  <ul className={style.headerUl}>
    <li className={style.headerLi}>
      <div className={style.addStaffLink}> {/* Adding class name here */}
        <Link href={'/CreateEmployee'} className={style.createstaff}>
          Add Staff
        </Link>
      </div>
    </li>
  </ul>
</div>


        <div className={style.navContainer}>
          <nav className={style.headerNav}>
            <ul className={style.headerUl}>
              {user ? (
                <li className={style.headerLi}>
                  {photoUrl ? (
                    <Image src={photoUrl} alt="User Photo" width={100} height={100} className={style.headerUserPic} />
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
