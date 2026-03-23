import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from '@/api/axios/axios';

// --- Types ---
interface Slot {
  date: string;
  time: string;
}

interface Doctor {
  id?: string;
  _id?: string;
  name: string;
  fees: string;
  availableSlots: Slot[];
  departmentId: string;
  department?: { name: string }; // Backend lookup data ke liye
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  totalDocs: number;
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  totalDocs: 0,
};

// --- Async Thunks ---

// 1. Create Doctor
export const createDoctor = createAsyncThunk(
  'doctor/create',
  async (doctorData: Doctor, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`/admin/doctor/create`, doctorData);
      return response.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create doctor');
    }
  }
);

// 2. List Doctors
export const fetchDoctors = createAsyncThunk(
  'doctor/fetchList',
  async ({ page, limit, search }: { page: number; limit: number; search?: string }, { rejectWithValue }) => {
    try {
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await AxiosInstance.get(`/admin/doctor/list?page=${page}&limit=${limit}${searchQuery}`);
      // Backend returns: { data: doctors, totalItems: 10, ... }
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

// 3. Update Doctor (Fix: Changed .put to .post as per backend)
export const updateDoctor = createAsyncThunk(
  'doctor/update',
  async (doctorData: any, { rejectWithValue }) => {
    try {
      // Backend expects { id, name, fees, availableSlots } in body
      const response = await AxiosInstance.post(`/admin/doctor/update`, doctorData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// 4. Delete Doctor (Fix: Changed .delete to .post as per backend/curl)
export const deleteDoctor = createAsyncThunk(
  'doctor/delete',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      // Backend controller uses req.body.id, so we use POST
      await AxiosInstance.post(`/admin/doctor/delete`, { id: doctorId });
      return doctorId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// 5. Doctor Details
export const fetchDoctorDetails = createAsyncThunk(
  'doctor/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/admin/doctor/details/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch details');
    }
  }
);

// --- Slice ---
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchDoctors.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        // Backend keys check: data and totalItems
        state.doctors = action.payload.data || []; 
        state.totalDocs = action.payload.totalItems || 0;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
            state.doctors.unshift(action.payload.data);
        }
      })

      // Delete (UI Update)
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(doc => (doc._id || doc.id) !== action.payload);
      })

      // Update (UI Update)
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const updatedDoc = action.payload.data;
        const index = state.doctors.findIndex(doc => (doc._id || doc.id) === updatedDoc._id);
        if (index !== -1) {
          state.doctors[index] = updatedDoc;
        }
      });
  },
});

export const { clearSelectedDoctor, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;