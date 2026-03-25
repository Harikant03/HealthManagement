"use client";

import React, { useState } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoint";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/Redux/provider/provider";
import { setLogin } from "@/Redux/slice/authSlice";
import SweetAlert from "@/components/sweetalerts/page"; 
import styles from "./signin.module.css";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["token"]);

  // --- Alert State ---
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (type: any, title: string, message: string) => {
    setAlertConfig({ isOpen: true, type, title, message });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
    if (alertConfig.type === 'success') {
      window.location.href = "/dashboard";
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await AxiosInstance.post(endPoints.auth.signin, data);
      const resData = response.data;

      const token = resData.token || resData.data?.token;
      const user = resData.data || resData.user;

      if (token) {
        setCookie("token", token, { path: "/", maxAge: 86400 });
        dispatch(setLogin({ user, token }));

        sessionStorage.setItem("userName", user.name || user.first_name || "Admin");
        sessionStorage.setItem("userEmail", user.email || "");
        sessionStorage.setItem("token", token);

        // Success Alert
        showAlert('success', 'Success!', 'Login successful. Welcome back!');
      } else {
        showAlert('error', 'Authentication Error', 'Token not found in response');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred";

      // Error Alert
      showAlert('error', 'Login Failed', errorMessage);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Custom Alert Component */}
      <SweetAlert 
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />

      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>
          Please enter your admin credentials
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              {...register("email")}
              type="email"
              placeholder="Admin Email"
              className={styles.inputField}
            />
            {errors.email && <p className={styles.errorText}>{errors.email?.message}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={styles.inputField}
            />
            {errors.password && <p className={styles.errorText}>{errors.password?.message}</p>}
          </div>

          <button type="submit" className={styles.loginBtn}>
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}