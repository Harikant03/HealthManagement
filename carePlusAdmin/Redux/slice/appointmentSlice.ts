import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoint";


// ✅ GET ALL APPOINTMENTS
export const getAppointments = async () => {
  const res = await AxiosInstance.get(
    endPoints.appointment.list
  );
  return res.data;
};

// ✅ CONFIRM APPOINTMENT
export const confirmAppointment = async (id: string) => {
  const res = await AxiosInstance.put(
    endPoints.appointment.confirm(id)
  );
  return res.data;
};

// ✅ CANCEL APPOINTMENT
export const cancelAppointment = async (id: string) => {
  const res = await AxiosInstance.put(
    endPoints.appointment.cancel(id)
  );
  return res.data;
};