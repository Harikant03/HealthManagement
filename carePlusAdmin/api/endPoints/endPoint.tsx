export const endPoints = {
    auth: {
        signin: "/admin/auth/login", 
        refreshToken: "/admin/refresh-token",
        logout: "/admin/logout",
    },
    department: {
        create: "/admin/doctor/department",
        list: "/admin/departments/list",
        details: (id: string) => `/admin/departments/details/${id}`,
        doctors: (id: string) => `/admin/departments/${id}/doctors`,
        delete: "/admin/department/delete",
        
    },
    doctor: {
        create: "/admin/doctor/create",
        list: (page: number, limit: number, search: string = "") => 
            `/admin/doctor/list?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
        delete: "/admin/doctor/delete",
        update: "/admin/doctor/update",
        details: (id: string) => `/admin/doctor/details/${id}`,
    },
    appointment: {
        list: "/admin/doctor/appointment/list",
        acceptedList: "/admin/appointment/acceptedlist",
        confirm: (id: string) => `/admin/doctor/appointment/${id}`,
        cancel: (id: string) => `/admin/doctor/appointment/cancelld/${id}`,
    },
    diagnostic: {
        create: "/admin/diagnostic/create",
        
    }
};