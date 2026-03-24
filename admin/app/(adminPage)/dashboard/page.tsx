"use client";
import React, { useEffect, useState } from 'react';
import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoint";
import { 
  Users, 
  LayoutGrid, 
  CalendarCheck, 
  CheckCircle, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const DashboardOverview = () => {
  const [counts, setCounts] = useState({
    doctors: 0,
    departments: 0,
    totalAppointments: 0,
    confirmed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Doctors & Departments API call
        const [docRes, depRes, appRes] = await Promise.all([
            AxiosInstance.get(endPoints.doctor.list(1, 1000)),
            AxiosInstance.get(endPoints.department.list),
            AxiosInstance.get(endPoints.appointment.list)
        ]);

        const allAppointments = appRes.data.data || [];

        // 2. Calculate Counts
        const confirmedApps = allAppointments.filter((a: any) => a.status === "Confirmed").length;
        const pendingApps = allAppointments.filter((a: any) => a.status === "Pending").length;

        setCounts({
          doctors: docRes.data.totalItems || docRes.data.data.length,
          departments: depRes.data.data.length,
          totalAppointments: allAppointments.length,
          confirmed: confirmedApps,
          pending: pendingApps
        });

        // 3. Set Recent Appointments (Latest 5) 👈 यह हिस्सा मिसिंग था
        setRecentAppointments(allAppointments.slice(0, 5));

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Doctors", count: counts.doctors, icon: <Users />, color: "from-blue-500 to-cyan-400" },
    { title: "Departments", count: counts.departments, icon: <LayoutGrid />, color: "from-purple-500 to-indigo-400" },
    { title: "Total Appointments", count: counts.totalAppointments, icon: <CalendarCheck />, color: "from-amber-500 to-orange-400" },
    { title: "Confirmed", count: counts.confirmed, icon: <CheckCircle />, color: "from-emerald-500 to-teal-400" },
    { title: "Pending", count: counts.pending, icon: <Clock />, color: "from-rose-500 to-pink-400" },
  ];

  if (loading) {
    return <div className="p-6 text-center text-white min-h-screen bg-[#0f172a]">Loading Dashboard Stats...</div>;
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard Overview</h2>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{item.title}</p>
                <h3 className="text-3xl font-bold mt-2">{item.count}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg shadow-black/20`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- RECENT APPOINTMENTS SECTION --- */}
      <div className="mt-10 bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck size={20} className="text-blue-400" /> Recent Appointments
            </h3>
            <p className="text-slate-500 text-xs mt-1">Showing the latest patient bookings</p>
          </div>
          <Link href="/appointments" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-300">Patient Name</th>
                <th className="px-6 py-4 font-bold text-slate-300">Date & Time</th>
                <th className="px-6 py-4 font-bold text-slate-300 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{app.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{new Date(app.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500">{app.time}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${
                        app.status === 'Confirmed' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">
                    No recent records found 🏥
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-lg font-semibold mb-4 text-blue-400">System Activity</h4>
          <p className="text-slate-400 text-sm">
            Current system has <span className="text-white font-bold">{counts.doctors}</span> registered doctors 
            across <span className="text-white font-bold">{counts.departments}</span> departments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;