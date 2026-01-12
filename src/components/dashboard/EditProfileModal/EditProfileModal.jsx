import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MdClose, MdCloudUpload, MdPerson } from 'react-icons/md';
import { FiUser, FiImage } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const EditProfileModal = ({ user, userData, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const { updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState(user?.photoURL || '');
  const [imageFile, setImageFile] = useState(null);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch('/users/profile', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to ImgBB
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoURL = formData.photoURL;

      // Upload new image if selected
      if (imageFile) {
        toast.loading('Uploading image...', { id: 'upload' });
        photoURL = await uploadImage(imageFile);
        toast.success('Image uploaded!', { id: 'upload' });
      }

      // Update Firebase Auth profile
      await updateUserProfile({
        displayName: formData.name,
        photoURL: photoURL,
      });

      // Update database
      await updateMutation.mutateAsync({
        name: formData.name,
        photoURL: photoURL,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-base-100 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative border border-base-300 z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-base-100 p-8 pb-6 border-b border-base-300 rounded-t-[2.5rem] z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <MdPerson className="text-2xl text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Edit Profile</h3>
                <p className="text-xs opacity-60 font-medium">
                  Update your personal information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm hover:bg-error/10 hover:text-error"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold opacity-70">
              <FiImage /> Profile Image
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* Image Preview */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-4xl overflow-hidden border-4 border-base-300 shadow-lg">
                  <img
                    src={
                      imagePreview ||
                      'https://i.ibb.co/3S3s8Vj/user-placeholder.png'
                    }
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-4xl flex items-center justify-center">
                  <MdCloudUpload className="text-white text-3xl" />
                </div>
              </div>

              {/* Upload Button */}
              <label className="btn btn-outline btn-primary rounded-xl gap-2 cursor-pointer">
                <MdCloudUpload size={20} />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs opacity-50 text-center">
                Supported: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold opacity-70">
              <FiUser /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
              className="input input-bordered w-full rounded-xl bg-base-200/50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
              minLength={3}
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold opacity-70">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input input-bordered w-full rounded-xl bg-base-200 border-base-300 opacity-60 cursor-not-allowed"
            />
            <p className="text-xs opacity-50">Email cannot be changed</p>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold opacity-70">
              Role
            </label>
            <input
              type="text"
              value={userData?.role || 'User'}
              disabled
              className="input input-bordered w-full rounded-xl bg-base-200 border-base-300 opacity-60 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-xl shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
