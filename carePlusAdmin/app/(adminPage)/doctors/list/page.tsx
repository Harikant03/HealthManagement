"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Redux/provider/provider";
import { fetchDoctors, deleteDoctor } from "../../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios";
import Link from "next/link";
import SweetAlert from "@/components/sweetalerts/page";
import "./DoctorList.css";
import { X, User, DollarSign, Calendar, Clock, Briefcase } from "lucide-react"; // Icons for card

const DoctorList = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.doctor);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

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

  const filteredDoctors = doctors.filter((doc: any) => {
    const searchTerm = search.toLowerCase();
    return doc.name?.toLowerCase().includes(searchTerm) || doc.department?.name?.toLowerCase().includes(searchTerm);
  });

  const handleDelete = (id: string) => {
    setAlertConfig({
      isOpen: true,
      type: 'warning',
      title: 'Are you sure?',
      message: 'This doctor profile will be permanently deleted!',
      confirmAction: () => {
        dispatch(deleteDoctor(id))
          .unwrap()
          .then(() => {
            setAlertConfig({ isOpen: true, type: 'success', title: 'Deleted!', message: 'Doctor record removed successfully.', confirmAction: null });
          })
          .catch(() => {
            setAlertConfig({ isOpen: true, type: 'error', title: 'Error!', message: 'Failed to delete the doctor.', confirmAction: null });
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
      });
      setAlertConfig({ isOpen: true, type: 'success', title: 'Updated!', message: 'Doctor details have been saved.', confirmAction: null });
      setEditModal(false);
      dispatch(fetchDoctors({ page, limit, search }));
    } catch (err) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Update Failed', message: 'Error updating doctor', confirmAction: null });
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
          placeholder="Search by Name or Department..."
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
          ) : filteredDoctors.length === 0 ? (
            <tr><td colSpan={4} className="text-center">No results found</td></tr>
          ) : (
            filteredDoctors.map((doc: any) => (
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

      {/* ✅ 1. View Doctor Card Modal */}
      {viewModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setViewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>Doctor Details</h3>
              <button className="close-icon" onClick={() => setViewModal(false)}><X size={20}/></button>
            </div>
            <div className="modal-card-body">
              <div className="detail-item"><User size={18}/> <strong>Name:</strong> <span>{selectedDoc.name}</span></div>
              <div className="detail-item"><DollarSign size={18}/> <strong>Fees:</strong> <span>₹{selectedDoc.fees}</span></div>
              <div className="detail-item"><Briefcase size={18}/> <strong>Department:</strong> <span>{selectedDoc.department?.name || "N/A"}</span></div>
              <div className="detail-item"><Calendar size={18}/> <strong>Date:</strong> <span>{selectedDoc.date}</span></div>
              <div className="detail-item"><Clock size={18}/> <strong>Duty Time:</strong> <span>{selectedDoc.schedule?.startTime} - {selectedDoc.schedule?.endTime}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 2. Edit Doctor Card Modal */}
      {editModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>Edit Profile</h3>
              <button className="close-icon" onClick={() => setEditModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="modal-card-form">
              <div className="input-field">
                <label>Full Name</label>
                <input type="text" value={selectedDoc.name} onChange={(e) => setSelectedDoc({...selectedDoc, name: e.target.value})} />
              </div>
              <div className="input-field">
                <label>Consultation Fees (₹)</label>
                <input type="text" value={selectedDoc.fees} onChange={(e) => setSelectedDoc({...selectedDoc, fees: e.target.value})} />
              </div>
              <div className="modal-card-footer">
                <button type="button" className="cancel-btn-alt" onClick={() => setEditModal(false)}>Cancel</button>
                <button type="submit" className="save-btn-alt">Update Now</button>
              </div>
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