import React, { use, useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import CharAvatar from '../../components/cards/CharAvatar';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { useNavigate } from 'react-router-dom';
import DeleteAlert from '../../components/DeleteAlert';
import Modal from '../../components/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const ProfileSettings = () => {
  useUserAuth();

  const [profileData, setProfileData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalProfileData, setOriginalProfileData] = useState([]);
  const [savedChanges, setSavedChanges] = useState(false);
  const [error, setError] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setOriginalProfileData(user);
      setSelectedImage(null);
      setSavedChanges(false);
      console.log("Profile Data:", user);
    }
  }, [user]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_pics");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dnzmxvfq1/image/upload",
      formData
    );

    return response.data.secure_url;
  };

  const handleCancelChanges = () => {
    setProfileData(originalProfileData);
    setSelectedImage(null);
    setSavedChanges(false);
  }

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token"); // or wherever you store it
      const response = await axiosInstance.delete(
        `${API_PATHS.SETTINGS.DELETE_ACCOUNT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        toast.success("Account deleted successfully");
        setOpenDeleteAlert({ show: false, data: null });
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete account"
      );
      console.error("Error deleting account", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      let profileImageUrl = profileData?.profileUrl || "";
      if (selectedImage) {
        profileImageUrl = await uploadToCloudinary(selectedImage);
      }

      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `${API_PATHS.SETTINGS.UPDATE_PROFILE}`,
        {
          fullName: profileData.fullName,
          profileUrl: profileImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setOriginalProfileData(profileData);
        setSavedChanges(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
      console.error("Error updating profile", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">

            {/* Profile Picture */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </h2>

              <div className="flex align-items-center gap-6">
                {profileData?.profileUrl ? (
                  <img
                    src={profileData?.profileUrl || ""}
                    alt="Profile Image"
                    className='w-20 h-20 bg-slate-400 rounded-full'
                  />
                ) : (
                  <CharAvatar
                    fullName={profileData?.fullName}
                    width="w-20"
                    height="h-20"
                    style="text-xl"
                  />
                )}
                <ProfilePhotoSelector
                  image={selectedImage}
                  setImage={(file) => {
                    setSelectedImage(file);
                    setSavedChanges(true);
                  }} onChange={(file) => {
                    setSelectedImage(file);
                    setSavedChanges(true);
                  }}
                />
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.fullName || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      });
                      setSavedChanges(true);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData?.email || ""}
                    disabled
                    className="w-full rounded-md border border-gray-200 px-3 py-2
                bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Security
              </h2>

              <button
                className="inline-flex items-center justify-center
            rounded-md border border-gray-300 px-4 py-2 text-sm
            text-gray-700 hover:bg-gray-50 transition"
                onClick={() => navigate("/reset-password")}
              >
                Reset Password
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                className="rounded-md px-5 py-2 text-sm font-medium
          text-gray-700 border border-gray-300 hover:bg-gray-50"
                disabled={!savedChanges}
                hidden={!savedChanges}
                onClick={handleCancelChanges}
              >
                Cancel
              </button>

              <button
                disabled={!savedChanges}
                className={`rounded-md px-5 py-2 text-sm font-medium transition ${!savedChanges
                  ? "bg-indigo-100 opacity-50 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-gray-200 align-items-center justify-content-center">
              <h2 className="text-sm font-medium text-red-600 mb-2">
                Danger Zone
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Deleting your account is permanent and cannot be undone.
              </p>

              <button
                className="rounded-md px-4 py-2 text-sm font-medium
            bg-red-600 text-white hover:bg-red-700"
                onClick={() => setOpenDeleteAlert({ show: true, data: user?.id })}
              >
                Delete Account
              </button>
            </div>

          </div>
        </div>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Account"
        >
          <DeleteAlert
            content="Are you sure you want to delete your account ?"
            onDelete={() => deleteAccount(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default ProfileSettings