"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Redux/provider/provider";
import { fetchDoctors, deleteDoctor } from "../../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios";
import Link from "next/link";
import SweetAlert from "@/components/sweetalerts/page"; // 👈 SweetAlert Import
import "./DoctorList.css";

const DoctorList = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.doctor);

  // States for Pagination & Search
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  // States for Modals
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // 🔔 SweetAlert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
    confirmAction: null as (() => void) | null
  });

  useEffect(() => {
    dispatch(fetchDoctors({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // --- Handlers ---

  const handleDelete = (id: string) => {
    // ब्राउज़र confirm हटाकर SweetAlert warning दिखाएंगे
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Are you sure?',
      message: 'This doctor profile will be permanently deleted!',
      confirmAction: () => {
        dispatch(deleteDoctor(id))
          .unwrap()
          .then(() => {
            setAlertConfig({
              isOpen: true,
              type: 'success',
              title: 'Deleted!',
              message: 'Doctor record removed successfully.',
              confirmAction: null
            });
          })
          .catch(() => {
            setAlertConfig({
              isOpen: true,
              type: 'error',
              title: 'Error!',
              message: 'Failed to delete the doctor.',
              confirmAction: null
            });
          });
      }
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/admin/doctor/update", {
        id: selectedDoc._id,
        name: selectedDoc.name,
        fees: selectedDoc.fees,
        availableSlots: selectedDoc.availableSlots,
      });
      
      // ✅ Success Alert
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Updated!',
        message: 'Doctor details have been saved.',
        confirmAction: null
      });

      setEditModal(false);
      dispatch(fetchDoctors({ page, limit, search }));
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update doctor info.',
        confirmAction: null
      });
    }
  };

  const openViewModal = async (id: string) => {
    try {
      const res = await AxiosInstance.get(`/admin/doctor/details/${id}`);
      setSelectedDoc(res.data.data);
      setViewModal(true);
    } catch (err) { console.error(err); }
  };

  const openEditModal = async (id: string) => {
    try {
      const res = await AxiosInstance.get(`/admin/doctor/details/${id}`);
      setSelectedDoc(res.data.data);
      setEditModal(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="list-container">
      {/* 🧾 Custom SweetAlert */}
      <SweetAlert 
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        onConfirm={alertConfig.confirmAction ? () => {
          alertConfig.confirmAction?.();
          setAlertConfig({ ...alertConfig, isOpen: false });
        } : undefined}
      />

      <div className="list-header">
        <h2>Doctor Management</h2>
        <Link href="/doctors/create" className="add-btn">+ Add New Doctor</Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <table className="doctor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Fees</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="text-center">Loading Data...</td></tr>
          ) : (
            doctors.map((doc: any) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>₹{doc.fees}</td>
                <td>{doc.department?.name || "N/A"}</td>
                <td className="actions">
                  <button onClick={() => openViewModal(doc._id)} className="view-btn">View</button>
                  <button onClick={() => openEditModal(doc._id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(doc._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* --- View Modal --- */}
      {viewModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setViewModal(false)}>
          <div className="modal-content view-card" onClick={(e) => e.stopPropagation()}>
            <div className="view-card-header">
              <div className="profile-avatar">{selectedDoc.name.charAt(0).toUpperCase()}</div>
              <div className="header-info">
                <h3>{selectedDoc.name}</h3>
                <span className="status-badge">Active</span>
              </div>
            </div>
            <div className="view-card-body">
              <div className="info-grid">
                <div className="info-item"><label>Fees</label><p>₹{selectedDoc.fees}</p></div>
                <div className="info-item"><label>Dept</label><p>{selectedDoc.department?.name || "General"}</p></div>
              </div>
            </div>
            <div className="view-card-footer">
              <button className="close-btn" onClick={() => setViewModal(false)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {editModal && selectedDoc && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Info</h3>
            <form onSubmit={handleUpdateSubmit}>
              <label>Name</label>
              <input value={selectedDoc.name} onChange={(e) => setSelectedDoc({...selectedDoc, name: e.target.value})} />
              <label>Fees</label>
              <input value={selectedDoc.fees} onChange={(e) => setSelectedDoc({...selectedDoc, fees: e.target.value})} />
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" onClick={() => setEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={doctors.length < limit} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default DoctorList;