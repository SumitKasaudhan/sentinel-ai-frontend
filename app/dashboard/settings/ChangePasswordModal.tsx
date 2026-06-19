"use client";

import {
  X,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import styles from "@/styles/dashboard/settings/ChangePasswordModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: Props) {

  if (!open) return null;

  const handleRedirect = () => {

    onClose();

    window.location.href = "/user-profile";

  };

  return (
    <div className={styles.overlay}>

      {/* BACKDROP */}

      <div
        className={styles.backdrop}
        onClick={onClose}
      />

      {/* MODAL */}

      <div className={styles.modal}>

        {/* HEADER */}

        <div className={styles.header}>

          <div>

            <div className={styles.titleRow}>
              <KeyRound size={22} />

              <h2>
                Change Password
              </h2>
            </div>

            <p>
              Your account security is managed
              through Clerk secure authentication.
            </p>

          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* BODY */}

        <div className={styles.body}>

          <div className={styles.securityBox}>

            <ShieldCheck
              size={42}
              className={styles.securityIcon}
            />

            <h3>
              Secure Password Management
            </h3>

            <p>
              Continue to Clerk security center
              to safely update your password,
              manage sessions, enable 2FA,
              and verify your identity.
            </p>

          </div>

        </div>

        {/* FOOTER */}

        <div className={styles.footer}>

          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            CANCEL
          </button>

          <button
            className={styles.updateBtn}
            onClick={handleRedirect}
          >
            CONTINUE SECURELY
          </button>

        </div>

      </div>
    </div>
  );
}