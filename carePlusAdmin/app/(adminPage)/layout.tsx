"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  LogOut, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  Stethoscope,
  Hospital 
} from 'lucide-react';
import Link from 'next/link';
import styles from './layout.module.css';
import SweetAlert from '@/components/sweetalerts/page';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarProfileOpen, setIsSidebarProfileOpen] = useState(false);
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@hospital.com"
  });

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

  const firstLetter = adminData.name.charAt(0).toUpperCase();

  const triggerLogoutAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/auth/login"; 
  };

  return (
    <div className={styles.wrapper}>
      <SweetAlert 
        isOpen={isAlertOpen}
        type="warning"
        title="Logout"
        message="Are you sure you want to end your session?"
        onClose={() => setIsAlertOpen(false)}
        onConfirm={confirmLogout}
      />

      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.collapsed : ''}`}>
        <div className={styles.logoSection}>
          <Building2 size={30} color="#3b82f6" />
          {isSidebarOpen && <span className={styles.companyName}>CarePlus</span>}
        </div>

        <nav className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          
          
          <Link href="/diagnostic" className={styles.navItem}>
            <Hospital size={20} /> <span>Diagnostic Center</span>
          </Link>

          <Link href="/departments" className={styles.navItem}>
            <Building2 size={20} /> <span>Department</span>
          </Link>
          <Link href="/doctors/list" className={styles.navItem}>
            <Stethoscope size={20} /> <span>Doctors</span>
          </Link>
          <Link href="/appointments" className={styles.navItem}>
            <CalendarCheck size={20} /> <span>Appointment</span>
          </Link>
        </nav>

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
              <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={triggerLogoutAlert}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.mainArea}>
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

            <div className={styles.headerProfileWrapper}>
               <div className={styles.headerAvatar} onClick={() => setIsHeaderProfileOpen(!isHeaderProfileOpen)}>
                  {firstLetter}
               </div>
               
               {isHeaderProfileOpen && (
                 <div className={styles.headerDropdown}>
                    <p className={styles.dropAdminName}>{adminData.name}</p>
                    <p className={styles.dropAdminEmail}>{adminData.email}</p>
                    <hr className={styles.divider} />
                    <div className={styles.dropLogout} onClick={confirmLogout}>
                      <LogOut size={14} /> Logout
                    </div>
                 </div>
               )}
            </div>
          </div>
        </header>

        <section className={styles.content}>
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;