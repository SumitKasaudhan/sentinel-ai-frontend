"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, LogOut, Upload, Camera, Key } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import "@/styles/dashboard/settings/settings.css";
import { useNotify } from "@/components/dashboard/context/NotificationContext";
import SettingsSkeleton from "@/components/dashboard/skeletons/SettingsSkeleton";
import ChangePasswordModal from "@/app/dashboard/settings/ChangePasswordModal";
import SubscriptionSection from "@/app/dashboard/settings/SubscriptionSection";

export default function SettingsPage() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const notify = useNotify();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* =========================================
     PROFILE STATES
  ========================================= */
  const clerkAvatar = user?.imageUrl || "";
  const [avatar, setAvatar] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  /* =========================================
     FILE INPUT REF
  ========================================= */
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* =========================================
     700ms MINIMUM SKELETON
  ========================================= */
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  /* =========================================
     LOAD DATA — Clerk first, localStorage on top
  ========================================= */
  useEffect(() => {
    if (!isLoaded || !user) return;

    const savedAvatar = localStorage.getItem("user-avatar");
    setAvatar(savedAvatar || clerkAvatar);

    const savedProfile = localStorage.getItem("profile-data");
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    } else {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
        bio: "",
      });
    }
  }, [isLoaded, user, clerkAvatar]);

  /* =========================================
     AVATAR UPLOAD
  ========================================= */
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Invalid File", "Please upload a valid image file", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      localStorage.setItem("user-avatar", base64String);
      window.dispatchEvent(new Event("avatar-updated"));
      notify("Avatar Updated", "Your profile photo has been changed", "success");
    };
    reader.readAsDataURL(file);
  };

  /* =========================================
     PROFILE INPUT CHANGE
  ========================================= */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================================
     SAVE PROFILE
  ========================================= */
  const handleSaveChanges = () => {
    localStorage.setItem("profile-data", JSON.stringify(profileData));
    notify("Profile Saved", "Your profile has been updated successfully", "success");
  };

  /* =========================================
     LOGOUT
  ========================================= */
  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ redirectUrl: "/auth/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* =========================================
     EARLY RETURN — SKELETON
  ========================================= */
  if (pageLoading) return <SettingsSkeleton />;

  /* =========================================
     UI
  ========================================= */
  return (
    <div className="sp-root">

      {/* ── PAGE HEADER ── */}
      <div className="sp-header">
        <h1 className="sp-title">Settings</h1>
        <p className="sp-subtitle">
          Manage your profile information and account details.
        </p>
      </div>

      {/* ── CARD ── */}
      <div className="sp-card">

        {/* Card section header */}
        <div className="sp-card-header">
          <div className="sp-card-header-left">
            <h2 className="sp-section-title">Profile</h2>
            <p className="sp-section-desc">
              Update your personal information and profile details.
            </p>
          </div>
          <button
            className="sp-upload-link"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={13} />
            Upload New Avatar
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            hidden
          />
        </div>

        {/* Divider */}
        <div className="sp-divider" />

        {/* Avatar */}
        <div className="sp-avatar-row">
          <div className="sp-avatar-wrap">
            {avatar || clerkAvatar ? (
              <img
                src={avatar || clerkAvatar}
                alt="avatar"
                className="sp-avatar-img"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="sp-avatar-fallback">
                {user?.firstName?.[0] ?? "U"}
              </span>
            )}
            <button
              className="sp-avatar-cam"
              onClick={() => fileInputRef.current?.click()}
              title="Change avatar"
            >
              <Camera size={11} />
            </button>
          </div>
        </div>

        {/* Form grid — 2 columns */}
        <div className="sp-form-grid">
          <div className="sp-field">
            <label className="sp-label">First Name</label>
            <input
              className="sp-input"
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="sp-field">
            <label className="sp-label">Last Name</label>
            <input
              className="sp-input"
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="sp-field">
            <label className="sp-label">Email Address</label>
            <input
              className="sp-input"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="user@example.com"
            />
          </div>

          <div className="sp-field">
            <label className="sp-label">Phone Number</label>
            <input
              className="sp-input"
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              placeholder="+91 9876543210"
            />
          </div>
        </div>

        {/* Bio — full width */}
        <div className="sp-field sp-field--full">
          <label className="sp-label">Bio</label>
          <textarea
            className="sp-textarea"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            placeholder="Tell us a bit about yourself…"
            rows={3}
          />
        </div>

        {/* Security sub-section */}
        <div className="sp-inner-section">
          <div className="sp-inner-section-title">
            <Shield size={15} strokeWidth={2} style={{ color: "#00D3F2" }} />
            <span>Security Settings</span>
          </div>

          <div className="sp-divider" />

          <div className="sp-security-row">
            <div className="sp-security-text">
              <p className="sp-security-label">Password</p>
              <p className="sp-security-hint">
                Update your password regularly to keep your account secure.
              </p>
            </div>
            <button
              className="sp-btn-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              <Key size={13} />
              Change Password
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="sp-actions">
          <button className="sp-btn-logout" onClick={handleLogout}>
            <LogOut size={13} />
            Logout
          </button>
          <button className="sp-btn-save" onClick={handleSaveChanges}>
            <Upload size={13} />
            Save Changes
          </button>
        </div>

      </div>

      {/* ── SUBSCRIPTION & BILLING CARD ── */}
      <SubscriptionSection />

      {/* ── PASSWORD MODAL ── */}
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}