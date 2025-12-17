import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import {
  MdAddCircle,
  MdCloudUpload,
  MdClose,
  MdCategory,
  MdInventory,
  MdVideocam,
  MdHome,
  MdCheckCircle,
} from 'react-icons/md';
import { FiPackage, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import axios from 'axios';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Container from '../../../../components/common/Container/Container';

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      shortDescription: '',
      longDescription: '',
      category: '',
      price: '',
      availableQuantity: '',
      minimumOrderQuantity: '',
      demoVideo: '',
      paymentOptions: [],
      showOnHomePage: false,
    },
  });

  const watchShowOnHome = watch('showOnHomePage');

  // Handle Image Upload to ImgBB
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 images
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);

    try {
      const ImgBB_API_KEY = import.meta.env.VITE_IMGBB_APIKEY;

      if (!ImgBB_API_KEY) {
        throw new Error('ImgBB API key not configured');
      }

      const uploadPromises = files.map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a valid image`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }

        const formData = new FormData();
        formData.append('image', file);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${ImgBB_API_KEY}`,
          formData
        );

        return res.data.data.display_url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...imageUrls]);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  // Form Submit
  const onSubmit = async (data) => {
    // Validate images
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Validate payment options
    if (!data.paymentOptions || data.paymentOptions.length === 0) {
      toast.error('Please select at least one payment option');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: data.name,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        category: data.category,
        price: parseFloat(data.price),
        availableQuantity: parseInt(data.availableQuantity),
        minimumOrderQuantity: parseInt(data.minimumOrderQuantity),
        images: uploadedImages,
        demoVideo: data.demoVideo || '',
        paymentOptions: data.paymentOptions,
        showOnHomePage: data.showOnHomePage,
      };

      const response = await axiosSecure.post('/manager/products', productData);

      if (response.data.success) {
        toast.success('Product created successfully! 🎉');
        reset();
        setUploadedImages([]);
        // Navigate to manage products
        navigate('/dashboard/manage-products');
      }
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10 min-h-screen bg-base-200/30">
      <title>GarFlex | Add New Product</title>

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-success text-success-content rounded-2xl shadow-lg shadow-success/20">
              <MdAddCircle className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Add New Product
              </h1>
              <p className="opacity-60 font-medium">
                Create and publish products to your inventory
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <div className="space-y-6">
              {/* Product Name & Category */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-sm uppercase opacity-60">
                      Product Name *
                    </span>
                  </label>
                  <div className="relative">
                    <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                    <input
                      type="text"
                      {...register('name', {
                        required: 'Product name is required',
                        minLength: {
                          value: 3,
                          message: 'Minimum 3 characters required',
                        },
                      })}
                      placeholder="e.g., Premium Cotton T-Shirt"
                      className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-error text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-sm uppercase opacity-60">
                      Category *
                    </span>
                  </label>
                  <div className="relative">
                    <MdCategory className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg z-40" />
                    <select
                      {...register('category', {
                        required: 'Category is required',
                      })}
                      className="select select-bordered w-full pl-11 rounded-xl bg-base-200 border-none focus:ring-2 ring-primary/20"
                    >
                      <option value="">Select Category</option>
                      <option value="Shirt">Shirt</option>
                      <option value="Pant">Pant</option>
                      <option value="Jacket">Jacket</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  {errors.category && (
                    <p className="text-error text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm uppercase opacity-60">
                    Short Description *
                  </span>
                </label>
                <input
                  type="text"
                  {...register('shortDescription', {
                    required: 'Short description is required',
                    maxLength: {
                      value: 150,
                      message: 'Maximum 150 characters allowed',
                    },
                  })}
                  placeholder="Brief product description (max 150 characters)"
                  className="input input-bordered w-full rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                />
                {errors.shortDescription && (
                  <p className="text-error text-sm mt-1">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              {/* Long Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm uppercase opacity-60">
                    Detailed Description *
                  </span>
                </label>
                <textarea
                  {...register('longDescription', {
                    required: 'Detailed description is required',
                    minLength: {
                      value: 50,
                      message: 'Minimum 50 characters required',
                    },
                  })}
                  placeholder="Provide comprehensive product details, features, materials, etc..."
                  rows={5}
                  className="textarea textarea-bordered w-full rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20 resize-none"
                ></textarea>
                {errors.longDescription && (
                  <p className="text-error text-sm mt-1">
                    {errors.longDescription.message}
                  </p>
                )}
              </div>

              {/* Price & Quantities */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-sm uppercase opacity-60">
                      Price (৳) *
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('price', {
                        required: 'Price is required',
                        min: { value: 1, message: 'Price must be positive' },
                      })}
                      placeholder="0.00"
                      className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-error text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-sm uppercase opacity-60">
                      Available Quantity *
                    </span>
                  </label>
                  <div className="relative">
                    <MdInventory className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg" />
                    <input
                      type="number"
                      min="1"
                      {...register('availableQuantity', {
                        required: 'Available quantity is required',
                        min: {
                          value: 1,
                          message: 'Minimum 1 unit required',
                        },
                      })}
                      placeholder="e.g., 500"
                      className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  {errors.availableQuantity && (
                    <p className="text-error text-sm mt-1">
                      {errors.availableQuantity.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-sm uppercase opacity-60">
                      Min Order Quantity (MOQ) *
                    </span>
                  </label>
                  <div className="relative">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                    <input
                      type="number"
                      min="1"
                      {...register('minimumOrderQuantity', {
                        required: 'MOQ is required',
                        min: { value: 1, message: 'Minimum 1 unit required' },
                      })}
                      placeholder="e.g., 50"
                      className="input input-bordered w-full pl-11 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                  {errors.minimumOrderQuantity && (
                    <p className="text-error text-sm mt-1">
                      {errors.minimumOrderQuantity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm uppercase opacity-60">
                    Product Images * (Max 5)
                  </span>
                </label>

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden ring-2 ring-base-300"
                      >
                        <img
                          src={img}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                <label
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-base-200/50 hover:bg-base-200 transition-colors ${
                    uploadedImages.length >= 5
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <span className="font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <MdCloudUpload className="text-5xl text-primary mb-2" />
                      <span className="font-medium mb-1">
                        Click to upload images
                      </span>
                      <span className="text-xs opacity-50">
                        PNG, JPG, WEBP (Max 5MB each)
                      </span>
                      <span className="text-xs opacity-50 mt-1">
                        {uploadedImages.length} / 5 uploaded
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading || uploadedImages.length >= 5}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Demo Video */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm uppercase opacity-60">
                    Demo Video URL (Optional)
                  </span>
                </label>
                <div className="relative">
                  <MdVideocam className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-xl" />
                  <input
                    type="url"
                    {...register('demoVideo')}
                    placeholder="https://youtube.com/watch?v=..."
                    className="input input-bordered w-full pl-12 rounded-xl bg-base-200/50 border-none focus:ring-2 ring-primary/20"
                  />
                </div>
              </div>

              {/* Payment Options */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-sm uppercase opacity-60">
                    Payment Options * (Select at least one)
                  </span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-3 cursor-pointer px-6 py-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors border-2 border-transparent has-checked:border-primary has-checked:bg-primary/5">
                    <input
                      type="checkbox"
                      value="Cash on Delivery"
                      {...register('paymentOptions', {
                        required: 'Select at least one payment option',
                      })}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-xs opacity-60">
                        Pay when receiving product
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer px-6 py-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors border-2 border-transparent has-checked:border-primary has-checked:bg-primary/5">
                    <input
                      type="checkbox"
                      value="PayFirst"
                      {...register('paymentOptions')}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <p className="font-semibold">PayFirst</p>
                      <p className="text-xs opacity-60">
                        Secure online payment
                      </p>
                    </div>
                  </label>
                </div>
                {errors.paymentOptions && (
                  <p className="text-error text-sm mt-1">
                    {errors.paymentOptions.message}
                  </p>
                )}
              </div>

              {/* Show on Home Page */}
              <div className="form-control">
                <label className="flex items-center gap-4 cursor-pointer p-5 bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl border-2 border-transparent has-checked:border-primary has-checked:shadow-lg transition-all">
                  <input
                    type="checkbox"
                    {...register('showOnHomePage')}
                    className="checkbox checkbox-primary checkbox-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MdHome className="text-2xl text-primary" />
                      <span className="font-bold text-lg">
                        Display on Home Page
                      </span>
                    </div>
                    <p className="text-sm opacity-60 mt-1">
                      Featured products get more visibility and higher
                      conversion rates
                    </p>
                  </div>
                  {watchShowOnHome && (
                    <MdCheckCircle className="text-3xl text-success" />
                  )}
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="grid md:grid-cols-2 gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setUploadedImages([]);
                  }}
                  className="btn btn-ghost rounded-2xl"
                  disabled={isSubmitting}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="btn btn-primary rounded-2xl shadow-lg shadow-primary/30"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Product...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdAddCircle className="text-xl" />
                      Create Product
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </Container>
    </div>
  );
};

export default AddProduct;
