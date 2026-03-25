"use client";
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './SweetAlert.module.css';

interface AlertProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const SweetAlert = ({ isOpen, type, title, message, onClose, onConfirm }: AlertProps) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className={styles.successIcon} size={60} />,
    error: <XCircle className={styles.errorIcon} size={60} />,
    warning: <AlertTriangle className={styles.warningIcon} size={60} />,
    info: <Info className={styles.infoIcon} size={60} />,
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.alertBox}>
        <button className={styles.closeCross} onClick={onClose}><X size={20}/></button>
        
        <div className={styles.iconWrapper}>
          {icons[type]}
        </div>
        
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          {onConfirm ? (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button className={`${styles.confirmBtn} ${styles[type]}`} onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className={`${styles.okBtn} ${styles[type]}`} onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetAlert;