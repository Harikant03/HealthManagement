"use client";
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../../Redux/provider/provider";
import { createDoctor } from "../../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios"; 
import SweetAlert from "@/components/sweetalerts/page"; 
import './CreateDoctor.css';

const CreateDoctor = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.doctor);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  });

  const [departments, setDepartments] = useState<any[]>([]);
  
  // ✅ Added 'date' in state
  const [formData, setFormData] = useState({
    name: '',
    fees: '', 
    departmentId: '', 
    date: '', // 👈 New field added
    schedule: {
      startTime: '',
      endTime: '',
      slotDuration: 30 
    }
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

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [name]: name === 'slotDuration' ? Number(value) : value 
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Payload exactly as backend expects
    const payload = {
      ...formData,
      fees: formData.fees.toString(),
      date: formData.date, // 👈 Passing date
      schedule: {
        ...formData.schedule,
        slotDuration: Number(formData.schedule.slotDuration)
      }
    };

    dispatch(createDoctor(payload as any))
      .unwrap()
      .then(() => {
        setAlertConfig({
          isOpen: true,
          type: 'success',
          title: 'Success!',
          message: 'Doctor created successfully.'
        });
        
        setFormData({ 
          name: '', 
          fees: '', 
          departmentId: '', 
          date: '', 
          schedule: { startTime: '', endTime: '', slotDuration: 30 } 
        });
      })
      .catch((err) => {
        setAlertConfig({
          isOpen: true,
          type: 'error',
          title: 'Oops!',
          message: err || 'Something went wrong.'
        });
      });
  };

  return (
    <div className="form-container">
      <h2>Add New Doctor</h2>
      
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
            placeholder="e.g. Dr. Hari Yadav"
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

        {/* ✅ Specific Date for Slots */}
        <div className="form-group">
          <label>📅 Available Date (For Slots Generation)</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="slots-section">
          <h3>🕒 Duty Schedule Time</h3>
          <div className="form-row">
             <div className="form-group">
                <label>Start Time</label>
                <input 
                  type="time" 
                  name="startTime"
                  value={formData.schedule.startTime}
                  onChange={handleScheduleChange}
                  required 
                />
             </div>
             <div className="form-group">
                <label>End Time</label>
                <input 
                  type="time" 
                  name="endTime"
                  value={formData.schedule.endTime}
                  onChange={handleScheduleChange}
                  required 
                />
             </div>
          </div>
          <div className="form-group">
             <label>Slot Duration (Minutes)</label>
             <input 
                type="number" 
                name="slotDuration"
                value={formData.schedule.slotDuration}
                onChange={handleScheduleChange}
                required 
             />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '🚀 Saving Data...' : 'Confirm & Create Doctor'}
        </button>
      </form>
    </div>
  );
};

export default CreateDoctor;