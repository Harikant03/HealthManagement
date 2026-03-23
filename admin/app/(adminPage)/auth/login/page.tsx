"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoint";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/Redux/provider/provider"; // Redux Dispatch hook
import { setLogin } from "@/Redux/slice/authSlice"; // Redux Action
import styles from "./signin.module.css";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["token"]);

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

      // Backend response se token aur user nikalna
      const token = resData.token || resData.data?.token;
      const user = resData.data || resData.user;

      if (token) {
        // 1. Cookie set karein (Taki Axios Interceptor token bhej sake)
        setCookie("token", token, { path: "/", maxAge: 86400 });

        // 2. Redux State update karein
        dispatch(setLogin({ user, token }));

        // 3. Header ke liye name aur token backup session mein save karein
        const fullName = user.name || user.first_name || "Admin";
        sessionStorage.setItem("userName", fullName);
        sessionStorage.setItem("token", token);

        alert("Login successful");

        // 4. Redirect - window.location use karne se Header fresh data utha lega
        window.location.href = "/admin/doctor";
      } else {
        alert("Token not found in response");
      }
    } catch (error: any) {
      console.error("Full Error Object:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred";

      alert(`Login Failed: ${errorMessage}`);
    }
  };

  return (
    <div className={styles.mainContainer}>
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
        
        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <a href="#" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}