"use client";
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../../Redux/provider/provider";
import { createDoctor } from "../../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios"; 
import SweetAlert from "@/components/sweetalerts/page"; // 👈 SweetAlert Import करें
import './CreateDoctor.css';

const CreateDoctor = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.doctor);

  // 🔔 SweetAlert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    fees: '', 
    departmentId: '', 
    availableSlots: [{ date: '', time: '' }]
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await AxiosInstance.get("/admin/departments/list");
        setDepartments(res.data.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatTimeToAMPM = (time24: string) => {
    if (!time24) return "";
    let [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const formattedHours = h < 10 ? `0${h}` : h;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleSlotChange = (index: number, field: string, value: string) => {
    const newSlots = [...formData.availableSlots];
    newSlots[index] = { 
        ...newSlots[index], 
        [field]: field === 'time' ? formatTimeToAMPM(value) : value 
    };
    setFormData({ ...formData, availableSlots: newSlots });
  };

  const addSlot = () => {
    setFormData({
      ...formData,
      availableSlots: [...formData.availableSlots, { date: '', time: '' }]
    });
  };

  const removeSlot = (index: number) => {
    const newSlots = formData.availableSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, availableSlots: newSlots });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createDoctor(formData as any))
      .unwrap()
      .then(() => {
        // ✅ Success SweetAlert
        setAlertConfig({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Doctor has been created successfully.'
        });
        
        setFormData({ 
          name: '', 
          fees: '', 
          departmentId: '', 
          availableSlots: [{ date: '', time: '' }] 
        });
      })
      .catch((err) => {
        // ❌ Error SweetAlert
        setAlertConfig({
          isOpen: true,
          type: 'error',
          title: 'Oops!',
          message: err || 'Something went wrong while saving.'
        });
      });
  };

  return (
    <div className="form-container">
      <h2>Add New Doctor</h2>
      
      {/* 🧾 SweetAlert Component */}
      <SweetAlert 
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />

      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-group">
          <label>Doctor Full Name</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Dr. Nill Datta"
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Consultation Fees</label>
            <input 
              type="text" 
              name="fees" 
              value={formData.fees} 
              onChange={handleChange} 
              placeholder="Amount in ₹"
              required 
            />
          </div>

          <div className="form-group">
            <label>Specialist Department</label>
            <select 
              name="departmentId" 
              value={formData.departmentId} 
              onChange={handleChange} 
              className="select-dropdown"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="slots-section">
          <h3>📅 Available Slots</h3>
          {formData.availableSlots.map((slot, index) => (
            <div key={index} className="slot-row">
              <input 
                type="date" 
                value={slot.date}
                onChange={(e) => handleSlotChange(index, 'date', e.target.value)} 
                required 
              />
              <input 
                type="time" 
                onChange={(e) => handleSlotChange(index, 'time', e.target.value)} 
                required 
                className="time-picker-input"
              />
              {index > 0 && (
                <button type="button" className="remove-slot" onClick={() => removeSlot(index)}>
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-slot-btn" onClick={addSlot}>
            + Add Another Slot
          </button> 
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '🚀 Saving Data...' : 'Confirm & Create Doctor'}
        </button>
      </form>
    </div>
  );
};

export default CreateDoctor;