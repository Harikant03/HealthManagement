"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  CalendarCheck, 
  Settings, 
  LogOut,
  User
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
      {/* Brand Logo / Name */}
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <Stethoscope className="me-2" size={30} color="#0d6efd" />
        <span className="fs-4 fw-bold">Sanjeevi Hospital</span>
      </a>
      <hr />

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link active d-flex align-items-center gap-2" aria-current="page">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="nav-link active d-flex align-items-center gap-2" aria-current="page">
            <LayoutDashboard size={18} />
            Department
          </a>
          <a href="#" className="nav-link active d-flex align-items-center gap-2" aria-current="page">
            <LayoutDashboard size={18} />
            Doctors
          </a>
          <a href="#" className="nav-link active d-flex align-items-center gap-2" aria-current="page">
            <LayoutDashboard size={18} />
            Appointment
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
            <Building2 size={18} />
            Department
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
            <Stethoscope size={18} />
            Doctors
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
            <CalendarCheck size={18} />
            Appointments
          </a>
        </li>
      </ul>

      <hr />

      {/* Settings & Sign Out */}
      <ul className="nav nav-pills flex-column mb-3">
        <li>
          <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
            <Settings size={18} />
            Settings
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-danger d-flex align-items-center gap-2" 
             onClick={() => { sessionStorage.clear(); window.location.reload(); }}>
            <LogOut size={18} />
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;