
import { AxiosInstance } from "@/api/axios/axios";

// 📋 GET
export const getDepartments = async () => {
  const res = await AxiosInstance.get("/admin/departments/list");
  return res.data;
};

// ➕ CREATE
export const createDepartment = async (data: any) => {
  const res = await AxiosInstance.post(
    "/admin/doctor/department",
    data
  );
  return res.data;
};

// ❌ DELETE
export const deleteDepartment = async (id: string) => {
  const res = await AxiosInstance.post(
    "/admin/department/delete",
    { id }
  );
  return res.data;
};
