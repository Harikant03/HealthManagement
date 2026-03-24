"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  User, 
  LogOut, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  Stethoscope 
} from 'lucide-react';
import Link from 'next/link';
import styles from './layout.module.css';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarProfileOpen, setIsSidebarProfileOpen] = useState(false);
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🟢 1. Local State for Dynamic Admin Data
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@hospital.com"
  });

  // 🟢 2. Login ke baad session se data load karna
  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");

    if (storedName || storedEmail) {
      setAdminData({
        name: storedName || "Admin",
        email: storedEmail || "admin@hospital.com"
      });
    }
  }, []);

  // 🟢 3. Name ka first letter nikalna Avatar ke liye
  const firstLetter = adminData.name.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      // Cookies clear karne ka logic agar use kar rahe ho toh
      window.location.href = "/auth/login"; 
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 🟢 SIDEBAR (LEFT SIDE) */}
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.collapsed : ''}`}>
        <div className={styles.logoSection}>
          <Building2 size={30} color="#3b82f6" />
          {!isSidebarOpen ? null : <span className={styles.companyName}>CarePlus</span>}
        </div>

        <nav className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navItem}><LayoutDashboard size={20} /> <span>Dashboard</span></Link>
          <Link href="/departments" className={styles.navItem}><Building2 size={20} /> <span>Department</span></Link>
          <Link href="/doctors/list" className={styles.navItem}><Stethoscope size={20} /> <span>Doctors</span></Link>
          <Link href="/appointments" className={styles.navItem}><CalendarCheck size={20} /> <span>Appointment</span></Link>
        </nav>

        {/* 👤 BOTTOM PROFILE (SIDEBAR) */}
        <div className={styles.sidebarProfile} onClick={() => setIsSidebarProfileOpen(!isSidebarProfileOpen)}>
          <div className={styles.profileAvatarCircle}>
            {firstLetter}
          </div>
          {isSidebarOpen && (
            <div className={styles.adminInfo}>
              <p className={styles.adminName}>{adminData.name}</p>
              <p className={styles.adminEmail}>{adminData.email}</p>
            </div>
          )}
          
          {isSidebarProfileOpen && isSidebarOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.dropdownItem}><Settings size={16} /> Setting</div>
              <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT AREA */}
      <main className={styles.mainArea}>
        {/* 🔝 HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.menuBtn}>
              <Menu size={20} />
            </button>
            <h1 className={styles.panelTitle}>Hospital Management Panel</h1>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Search data..." />
            </div>
            
            <div className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.notiBadge}></span>
            </div>

            {/* 👤 HEADER PROFILE ICON (Updated to Avatar) */}
            <div className={styles.headerProfileWrapper}>
               <div className={styles.headerAvatar} onClick={() => setIsHeaderProfileOpen(!isHeaderProfileOpen)}>
                  {firstLetter}
               </div>
               
               {isHeaderProfileOpen && (
                 <div className={styles.headerDropdown}>
                    <p className={styles.dropAdminName}>{adminData.name}</p>
                    <p className={styles.dropAdminEmail}>{adminData.email}</p>
                 </div>
               )}
            </div>
          </div>
        </header>

        {/* 🧩 CONTENT */}
        <section className={styles.content}>
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;