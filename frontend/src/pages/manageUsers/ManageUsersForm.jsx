import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  RiErrorWarningLine,
  RiArrowLeftLine,
  RiArrowDownSLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { Toaster, toast } from "react-hot-toast";
import { Endpoints } from "../../services/api/EndPoint";
import api from "../../services/api/api";
import { PATHROUTES } from "../../routes/pathRoutes";

const ManageUsersForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes(PATHROUTES.editUsers);
  const userToEdit = location.state?.user;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    roleId: "",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Initialize form when editing
  useEffect(() => {
    if (isEditMode && userToEdit) {
      const sanitizeApiValue = (value) => {
        if (
          value === "N/A" ||
          value === "null" ||
          value === "undefined" ||
          value === null ||
          value === undefined
        ) {
          return "";
        }
        return value || "";
      };

      setFormData({
        firstName: sanitizeApiValue(userToEdit.firstName),
        lastName: sanitizeApiValue(userToEdit.lastName),
        mobile: sanitizeApiValue(userToEdit.mobile),
        email: sanitizeApiValue(userToEdit.email),
        roleId: sanitizeApiValue(userToEdit.roleId || userToEdit.role?.roleId),
        status: userToEdit.status || "active",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isEditMode, userToEdit]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Validate password on change
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation({
        length: formData.password.length >= 8 && formData.password.length <= 30,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[^a-zA-Z0-9]/.test(formData.password),
      });
    } else {
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
    }
  }, [formData.password]);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await api.get(Endpoints.GET_ROLES);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setRoles(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        console.error("Unexpected roles response structure:", response.data);
        toast.error("Failed to load user roles - unexpected response");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load user roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input values
    let sanitizedValue = value;
    if (name === "firstName" || name === "lastName") {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50);
    } else if (name === "mobile") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "email") {
      sanitizedValue = value.slice(0, 50);
    } else if (name === "password" || name === "confirmPassword") {
      sanitizedValue = value.slice(0, 30);
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First Name can only contain letters and spaces";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last Name can only contain letters and spaces";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Must be a valid 10-digit Indian number starting with 6-9";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    // Role validation
    if (!formData.roleId) {
      newErrors.roleId = "User Role is required";
    }

    // Password validation (only for create mode or if password is provided in edit mode)
    if (!isEditMode || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (
        formData.password.length < 8 ||
        formData.password.length > 30
      ) {
        newErrors.password = "Password must be 8-30 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character";
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const preparePayloadForBackend = () => {
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      status: formData.status,
    };

    if (formData.roleId) {
      payload.roleId = Number(formData.roleId);
    }

    // Append password only if provided
    if (formData.password) {
      payload.password = formData.password;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = preparePayloadForBackend();

      let response;
      if (isEditMode) {
        const userId = userToEdit?.id;
        if (!userId) {
          toast.error("User ID not found");
          setIsSubmitting(false);
          return;
        }
        response = await api.put(Endpoints.UPDATE_USER(userId), payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await api.post(Endpoints.CREATE_USER, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (response.data.success) {
        toast.success(
          isEditMode
            ? response.data.message || "User updated successfully!"
            : response.data.message || "User created successfully!"
        );

        // Reset form for create mode
        if (!isEditMode) {
          setFormData({
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
            roleId: "",
            status: "active",
            password: "",
            confirmPassword: "",
          });
        }

        setErrors({});

        // Navigate to manage users page after a short delay
        setTimeout(() => {
          navigate(PATHROUTES.manageUsers);
        }, 1500);
      } else {
        const errorMessage = response.data.message || "Failed to process request";
        toast.error(errorMessage);

        // Set specific field errors based on error message
        const errorMessageLower = errorMessage.toLowerCase();
        if (errorMessageLower.includes("email")) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        }
        if (errorMessageLower.includes("mobile")) {
          setErrors((prev) => ({ ...prev, mobile: "Mobile number already exists" }));
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred";

        // Set specific field errors based on error message
        const errorMessageLower = errorMessage.toLowerCase();
        if (errorMessageLower.includes("email")) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        }
        if (errorMessageLower.includes("mobile")) {
          setErrors((prev) => ({ ...prev, mobile: "Mobile number already exists" }));
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#363636", color: "#fff" },
          success: { style: { background: "#10b981" } },
          error: { style: { background: "#ef4444" } },
          duration: 3000,
        }}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit User Details" : "Add New User"}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? "Update user information" : "Register new user for the system"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaUser className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
          </div>

          {/* Personal Details Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.mobile ? "border-red-500" : ""}`}
                  placeholder="10-digit number starting with 6-9"
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.mobile}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className={`input-field pl-10 appearance-none ${
                    errors.roleId ? "border-red-500" : ""
                  } ${!formData.roleId ? "text-gray-500" : "text-gray-900"}`}
                  disabled={isSubmitting || loadingRoles}
                >
                  <option value="" disabled>
                    {loadingRoles ? "Loading roles..." : "Select User Role"}
                  </option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <RiArrowDownSLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              {errors.roleId && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.roleId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {formData.status === "active" ? (
                    <FaCheckCircle className="text-green-500" size={18} />
                  ) : (
                    <FaTimesCircle className="text-red-500" size={18} />
                  )}
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field pl-10 appearance-none text-gray-900"
                  disabled={isSubmitting}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <RiArrowDownSLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <RiErrorWarningLine className="mr-1" />
                  {errors.status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Information Section */}
        {(!isEditMode || formData.password) && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <FaLock className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Security Information
                {isEditMode && formData.password === "" && (
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (Leave blank to keep current password)
                  </span>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder={
                      isEditMode
                        ? "Enter new password (optional)"
                        : "Enter password"
                    }
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <RiErrorWarningLine className="mr-1" />
                    {errors.password}
                  </p>
                )}

                {formData.password && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Password must contain:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation.length ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordValidation.length ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          8-30 characters
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation.uppercase ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordValidation.uppercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          At least one uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation.lowercase ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordValidation.lowercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          At least one lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation.number ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordValidation.number ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          At least one number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation.special ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            passwordValidation.special
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          At least one special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password{" "}
                  {(!isEditMode || formData.password) && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine size={18} />
                    ) : (
                      <RiEyeLine size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <RiErrorWarningLine className="mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="mt-2 flex items-center text-green-600 text-xs">
                      <FaCheck className="mr-1" size={12} /> Passwords match
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(PATHROUTES.manageUsers)}
            className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FaCheck className="mr-2 w-4 h-4" />
                {isEditMode ? "Update User" : "Create User"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageUsersForm;