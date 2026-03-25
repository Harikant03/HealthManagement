"use client";
import React, { useState, useEffect } from "react";
import { AxiosInstance } from "@/api/axios/axios";
import { MapPin, Phone, Navigation, Plus, Trash2, Hospital } from "lucide-react";
import SweetAlert from "@/components/sweetalerts/page"; 
import styles from "./diagnostic.module.css";

const AdminDiagnostic = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", lat: "", lng: ""
  });

  // Alert State
  const [alert, setAlert] = useState({ isOpen: false, type: 'info' as any, title: '', message: '', onConfirm: undefined as any });

  const showAlert = (type: any, title: string, message: string, onConfirm?: any) => {
    setAlert({ isOpen: true, type, title, message, onConfirm });
  };

  //  Current Location Fetch (For Admin standing at the center)
  const autoFillLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString()
        });
        showAlert('success', 'Location Captured', 'Coordinates updated from your GPS.');
      });
    }
  };

  // Add Center
  const handleAddCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/aadmin/diagnostic/create", formData);
      showAlert('success', 'Success', 'Diagnostic Center registered successfully!');
      setFormData({ name: "", address: "", phone: "", lat: "", lng: "" });
      loadAllCenters(); 
    } catch (err) {
      showAlert('error', 'Error', 'Could not save center.');
    }
  };

  // Load Centers 
  const loadAllCenters = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(`/diagnostic/nearby?lat=22.5726&lng=88.3639&distance=50000`);
      setCenters(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllCenters(); }, []);

  return (
    <div className={styles.container}>
      <SweetAlert {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Diagnostic Management</h1>
        <p className={styles.subtitle}>Register and monitor diagnostic centers</p>
      </div>

      <div className={styles.mainGrid}>
        {/* --- Left Side: Add Form --- */}
        <section className={styles.formSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><Plus size={20} /> Register New Center</h3>
            <form onSubmit={handleAddCenter} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Center Name</label>
                <input required value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="e.g. Apollo Diagnostics" />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Address</label>
                <input required value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} placeholder="Full address..." />
              </div>

              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input required value={formData.phone} onChange={(e)=>setFormData({...formData, phone:e.target.value})} placeholder="Contact info" />
              </div>

              <div className={styles.geoGrid}>
                <div className={styles.inputGroup}>
                  <label>Latitude</label>
                  <input value={formData.lat} readOnly placeholder="0.0000" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Longitude</label>
                  <input value={formData.lng} readOnly placeholder="0.0000" />
                </div>
              </div>

              <button type="button" onClick={autoFillLocation} className={styles.gpsBtn}>
                <Navigation size={16} /> Get My Current GPS
              </button>

              <button type="submit" className={styles.submitBtn}>Save Center to Database</button>
            </form>
          </div>
        </section>

        {/* --- Right Side: Registered List --- */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h3>Registered Centers ({centers.length})</h3>
            <button onClick={loadAllCenters} className={styles.refreshBtn}>Refresh List</button>
          </div>

          <div className={styles.scrollArea}>
            {loading ? <p className={styles.msg}>Loading centers...</p> : 
             centers.length === 0 ? <p className={styles.msg}>No centers found.</p> :
             centers.map((c: any) => (
              <div key={c._id} className={styles.centerCard}>
                <div className={styles.centerMain}>
                  <div className={styles.iconCircle}><Hospital size={24} /></div>
                  <div className={styles.centerDetails}>
                    <h4>{c.name}</h4>
                    <p><MapPin size={14} /> {c.address}</p>
                    <p><Phone size={14} /> {c.phone}</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                   <span className={styles.distBadge}>{(c.distance / 1000).toFixed(1)} km</span>
                   {/* Delete button logic can be added here */}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDiagnostic;