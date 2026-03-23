"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, UserCircle } from "lucide-react"; // UserCircle as default icon
import "./Header.css";

const Header = () => {
  const [adminName, setAdminName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const savedName = sessionStorage.getItem("userName");
    if (savedName) {
      setAdminName(savedName);
      setIsLoggedIn(true);
    }
  }, []);

  // First Letter logic (sirf tab jab name available ho)
  const firstLetter = adminName ? adminName.charAt(0).toUpperCase() : "";

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>Doctor Admin Panel</h1>
        <p>Manage Hospital Departments</p>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="header-actions">
          {/* Notification Icon */}
          <div className="notification-wrapper">
            <Bell size={22} className="action-icon" />
            <span className="notification-badge"></span>
          </div>

          <div className="admin-profile-container">
            {isLoggedIn ? (
              /* LOGIN SUCCESSFUL: Show Name and First Letter Icon */
              <div className="profile-row">
                <div className="profile-info">
                  <span className="admin-name">{adminName}</span>
                  <span className="admin-role">Administrator</span>
                </div>
                <div className="user-letter-icon">
                  {firstLetter}
                </div>
              </div>
            ) : (
              /* BEFORE LOGIN: Show Default Icon */
              <div className="profile-row">
                <span className="admin-name">Guest Admin</span>
                <UserCircle size={32} className="default-icon" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;