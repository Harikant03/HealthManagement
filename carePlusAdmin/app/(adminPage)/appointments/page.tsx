"use client";

import { useEffect, useState } from "react";
import styles from "./appointment.module.css";
import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoint";
import SweetAlert from "@/components/sweetalerts/page"; 

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");

  // --- Alert State ---
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (type: any, title: string, message: string, onConfirm?: () => void) => {
    setAlertConfig({ isOpen: true, type, title, message, onConfirm });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const loadData = async () => {
    try {
      const res = await AxiosInstance.get(endPoints.appointment.list);
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      showAlert('error', 'Fetch Failed', 'Could not load appointments.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filtered = appointments.filter((a) => {
    const statusMatch = a.status === activeTab;
    const nameMatch = a.name?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && nameMatch;
  });

  // --- Pagination Calculation ---
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirm = async (id: string) => {
    try {
      const url = endPoints.appointment.confirm(id);
      await AxiosInstance.put(url, {});
      showAlert('success', 'Confirmed!', 'The appointment has been successfully confirmed.');
      loadData();
    } catch (err) {
      showAlert('error', 'Error', 'Failed to confirm the appointment.');
    }
  };

  // Logic 
  const handleCancelClick = (id: string) => {
    showAlert(
      'warning', 
      'Are you sure?', 
      'Do you really want to cancel this appointment?', 
      () => executeCancel(id) 
    );
  };

  const executeCancel = async (id: string) => {
    try {
      const url = endPoints.appointment.cancel(id);
      await AxiosInstance.put(url, {});
      closeAlert(); 
      setTimeout(() => {
        showAlert('success', 'Cancelled!', 'Appointment has been removed.');
      }, 100);
      loadData();
    } catch (err) {
      showAlert('error', 'Error', 'Cancel failed.');
    }
  };

  return (
    <div className={styles.container}>
      {/*  SweetAlert Integration */}
      <SweetAlert 
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
      />

      <h1 className={styles.title}>Appointments Management</h1>

      <div className={styles.headerRow}>
        <input
          className={styles.search}
          placeholder="Search patient name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className={styles.tabs}>
          <button
            onClick={() => { setActiveTab("Pending"); setCurrentPage(1); }}
            className={activeTab === "Pending" ? styles.activeTab : ""}
          >
            Pending ({appointments.filter((a) => a.status === "Pending").length})
          </button>

          <button
            onClick={() => { setActiveTab("Confirmed"); setCurrentPage(1); }}
            className={activeTab === "Confirmed" ? styles.activeTab : ""}
          >
            Confirmed ({appointments.filter((a) => a.status === "Confirmed").length})
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {pagedData.length === 0 ? (
          <p className={styles.noData}>No {activeTab} appointments found.</p>
        ) : (
          pagedData.map((a) => (
            <div key={a._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{a.name}</h3>
                <span className={a.status === "Confirmed" ? styles.confirmed : styles.pending}>
                  {a.status}
                </span>
              </div>

              <div className={styles.details}>
                <p>📅 {new Date(a.date).toLocaleDateString()}</p>
                <p>⏰ {a.time}</p>
                <p className={styles.id}>ID: {a._id}</p>
              </div>

              <div className={styles.actions}>
                {a.status === "Pending" && (
                  <button onClick={() => handleConfirm(a._id)} className={styles.confirmBtn}>
                    Confirm
                  </button>
                )}
                <button onClick={() => handleCancelClick(a._id)} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageText}>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}