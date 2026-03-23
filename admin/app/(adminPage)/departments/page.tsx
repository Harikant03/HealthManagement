 "use client";

import { useEffect, useState } from "react";
import styles from "./department.module.css";
import { AxiosInstance } from "@/api/axios/axios";

export default function DepartmentPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [departments, setDepartments] = useState<any[]>([]);

  // 📄 Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // 🔥 Load Data
  const loadData = async () => {
    try {
      const res = await AxiosInstance.get("/admin/departments/list");
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔍 Search
  const filtered = departments.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // ➕ Add
  const handleAdd = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  // ✏️ Edit
  const handleEdit = (d: any) => {
    setEditId(d._id);
    setForm({
      name: d.name,
      description: d.description,
    });
    setModalOpen(true);
  };

  // 💾 Save
  const handleSave = async () => {
    try {
      if (editId) {
        await AxiosInstance.post("/admin/department/delete", {
          id: editId,
        });
      }

      await AxiosInstance.post("/admin/doctor/department", form);

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ Delete
  const handleDelete = async (id: string) => {
    try {
      await AxiosInstance.post("/admin/department/delete", { id });
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Department</h1>

      {/* 🔝 TOP BAR */}
      <div className={styles.topBar}>
        <input
          className={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className={`${styles.button} ${styles.primary}`}
        >
          + Add
        </button>
      </div>

      {/* 🧩 CARDS */}
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
                <button
                  onClick={() => handleEdit(d)}
                  className={`${styles.button} ${styles.edit}`}
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this department?")) {
                      handleDelete(d._id);
                    }
                  }}
                  className={`${styles.button} ${styles.delete}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📄 PAGINATION */}
      <div className={styles.pagination}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={styles.pageBtn}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages || 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={styles.pageBtn}>
          Next
        </button>
      </div>

      {/* 🧾 MODAL */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {editId ? "Edit Department" : "Add Department"}
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <div className={styles.modalActions}>
              <button onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>

              <button onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}