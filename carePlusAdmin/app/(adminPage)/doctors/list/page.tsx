"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Redux/provider/provider";
import { fetchDoctors, deleteDoctor } from "../../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios";
import Link from "next/link";
import SweetAlert from "@/components/sweetalerts/page";
import "./DoctorList.css";

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

  // Filter Logic for Name and Department
  const filteredDoctors = doctors.filter((doc: any) => {
    const searchTerm = search.toLowerCase();
    const nameMatch = doc.name?.toLowerCase().includes(searchTerm);
    const deptMatch = doc.department?.name?.toLowerCase().includes(searchTerm);
    return nameMatch || deptMatch;
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
      });
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

      {/* View & Edit Modals  */}
      {/* ... */}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={doctors.length < limit} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default DoctorList;