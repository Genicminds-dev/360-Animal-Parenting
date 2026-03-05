import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Type, Save, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { PATHROUTES } from "../../routes/pathRoutes";

const EditScheme = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const schemeData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    schemeName: schemeData?.schemeName || "",
    status: schemeData?.status || "active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.schemeName.trim()) {
      newErrors.schemeName = "Scheme name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      setIsSubmitting(true);

      // API call yaha lagegi
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Scheme updated successfully!");

      setTimeout(() => {
        navigate(PATHROUTES.schemeList);
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Scheme</h1>
        <p className="text-gray-600">Update scheme details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <BookOpen className="text-primary-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Scheme Details
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Scheme Name */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheme Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Type
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-2 border ${
                    errors.schemeName
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-primary-500`}
                  placeholder="Enter scheme name"
                />
              </div>

              {errors.schemeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.schemeName}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(PATHROUTES.schemeList)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            {isSubmitting ? "Updating..." : (
              <>
                <Save size={16} />
                Update Scheme
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScheme;