"use client";

import { useEffect, useState } from "react";
import styles from "./department.module.css";
import { AxiosInstance } from "@/api/axios/axios";
import SweetAlert from "@/components/sweetalerts/page"; 

export default function DepartmentPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  //  Alert State
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
  const loadData = async () => {
    try {
      const res = await AxiosInstance.get("/admin/departments/list");
      setDepartments(res.data.data || []);
    } catch (err) {
      console.log(err);
      showAlert('error', 'Error', 'Failed to load departments');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search & Pagination
  const filtered = departments.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAdd = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleEdit = (d: any) => {
    setEditId(d._id);
    setForm({ name: d.name, description: d.description });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await AxiosInstance.post("/admin/department/delete", { id: editId });
      }
      await AxiosInstance.post("/admin/doctor/department", form);
      
      setModalOpen(false);
      showAlert('success', 'Saved!', `Department ${editId ? 'updated' : 'added'} successfully.`);
      loadData();
    } catch (err) {
      showAlert('error', 'Save Failed', 'Could not save department details.');
    }
  };

  // Delete Flow
  const confirmDelete = (id: string) => {
    showAlert(
      'warning',
      'Are you sure?',
      'This department will be permanently removed.',
      () => executeDelete(id)
    );
  };

  const executeDelete = async (id: string) => {
    try {
      await AxiosInstance.post("/admin/department/delete", { id });
      closeAlert();
      // Small timeout to allow the first modal to close before showing success
      setTimeout(() => showAlert('success', 'Deleted', 'Department has been removed.'), 200);
      loadData();
    } catch (err) {
      showAlert('error', 'Error', 'Delete operation failed.');
    }
  };

  return (
    <div className={styles.container}>
      <SweetAlert 
        {...alertConfig}
        onClose={closeAlert}
      />

      <h1 className={styles.title}>Department</h1>

      <div className={styles.topBar}>
        <input
          className={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <button onClick={handleAdd} className={`${styles.button} ${styles.primary}`}>
          + Add
        </button>
      </div>

      <div className={styles.grid}>
        {paginated.length === 0 ? (
          <p className={styles.noResult}>No Result Found ❌</p>
        ) : (
          paginated.map((d: any) => (
            <div key={d._id} className={styles.card}>
              <span className={styles.activeBadge}>Active</span>
              <h3>{d.name}</h3>
              <p>{d.description}</p>
              <small>{d._id}</small>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(d)} className={`${styles.button} ${styles.edit}`}>
                  Edit
                </button>
                <button onClick={() => confirmDelete(d._id)} className={`${styles.button} ${styles.delete}`}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className={styles.pageBtn}>Prev</button>
        <span>{page} / {totalPages || 1}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className={styles.pageBtn}>Next</button>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editId ? "Edit Department" : "Add Department"}</h2>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={styles.textarea} 
            />
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveBtn}>
                {editId ? "Update" : "Save"}
              </button>
              <button onClick={() => setModalOpen(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}