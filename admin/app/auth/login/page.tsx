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
    setCookie("token", token, { path: "/", maxAge: 86400 });
    dispatch(setLogin({ user, token }));

    // User details ko localStorage ya sessionStorage mein save karein backup ke liye
    const fullName = user.name || user.first_name || "Admin";
    const email = user.email || ""; // Email ko save karein
    sessionStorage.setItem("userName", fullName);
    sessionStorage.setItem("userEmail", email); // 👈 New line
    sessionStorage.setItem("token", token);

    alert("Login successful");

    // Redirect to Dashboard
    window.location.href = "/dashboard"; // 👈 Update path
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