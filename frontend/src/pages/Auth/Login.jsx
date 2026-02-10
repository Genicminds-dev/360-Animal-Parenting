import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { GiCow } from 'react-icons/gi';
import { useAuth } from '../../contexts/AuthContext';
import api from "../../services/api/api";
import { Endpoints } from "../../services/api/EndPoint";

const Login = () => {
  const { loginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    apiError: '',
    lockoutError: '',
  });
 
  // Lockout functionality
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const lockTimerRef = useRef(null);
 
  const navigate = useNavigate();

  // Load login attempts from localStorage on component mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockTime = localStorage.getItem('lockUntil');
   
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
   
    if (storedLockTime) {
      const lockUntil = parseInt(storedLockTime);
      const now = Date.now();
     
      if (lockUntil > now) {
        const timeLeft = Math.ceil((lockUntil - now) / 1000);
        setIsLocked(true);
        setLockTimeLeft(timeLeft);
       
        // Start countdown timer
        lockTimerRef.current = setInterval(() => {
          setLockTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(lockTimerRef.current);
              setIsLocked(false);
              setErrors(prev => ({ ...prev, lockoutError: '', apiError: '' }));
              localStorage.removeItem('lockUntil');
              localStorage.removeItem('loginAttempts');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Lock has expired
        localStorage.removeItem('lockUntil');
        localStorage.removeItem('loginAttempts');
      }
    }
   
    // Cleanup on unmount
    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
      }
    };
  }, []);

  // Format time display for lockout
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Reset login attempts
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setErrors(prev => ({ ...prev, lockoutError: '', apiError: '' }));
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockUntil');
  };

  // Start lockout timer
  const startLockout = () => {
    const lockDuration = 30; // 30 seconds
    const lockUntil = Date.now() + (lockDuration * 1000);
   
    setIsLocked(true);
    setLockTimeLeft(lockDuration);
    setErrors(prev => ({
      ...prev,
      lockoutError: `Account locked. Please try again in ${formatTime(lockDuration)}.`,
      apiError: ''
    }));
    localStorage.setItem('lockUntil', lockUntil.toString());
   
    // Start countdown timer
    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current);
    }
   
    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(lockTimerRef.current);
          setIsLocked(false);
          setErrors(prev => ({ ...prev, lockoutError: '', apiError: '' }));
          resetLoginAttempts();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      apiError: '',
      lockoutError: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else {
      // Check if it contains @ (potentially an email)
      if (email.includes('@')) {
        // Count how many @ symbols are present
        const atSymbolCount = (email.match(/@/g) || []).length;
        
        if (atSymbolCount > 1) {
          newErrors.email = "Email can contain only one @ symbol";
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          // Validate email format only if there's exactly one @
          newErrors.email = "Please enter a valid email address";
          valid = false;
        }
      } else {
        // If no @, validate as username
        if (email.length < 3) {
          newErrors.email = "Username must be at least 3 characters";
          valid = false;
        }
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    if (isLocked) {
      setErrors(prev => ({
        ...prev,
        lockoutError: `Too many failed attempts. Please try again in ${formatTime(lockTimeLeft)}.`,
        apiError: ''
      }));
      return;
    }

    if (!validateForm()) return;

    try {
      setErrors({ email: '', password: '', apiError: '', lockoutError: '' });
      setSuccessMessage('');
      setLoading(true);

      // Using your API
      const response = await api.post(Endpoints.LOGIN, {
        username: email,
        password
      });

      const { token, user } = response.data;

      // Reset login attempts on successful login
      resetLoginAttempts();
     
      // Show success message
      setSuccessMessage('Login successful! Redirecting to dashboard...');

      // Use AuthContext's loginSuccess to update global state
      if (loginSuccess) {
        loginSuccess(token, user, rememberMe);
      }

      // Redirect after success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      // Increment failed login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      let errorMessage = 'Sign In failed. Please try again.';
      let lockoutTriggered = false;
     
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'The password you entered is incorrect. Please try again.';
         
          // Check if this was the 4th failed attempt
          if (newAttempts >= 4) {
            startLockout();
            errorMessage = `Too many failed attempts. Your account has been locked for 30 seconds.`;
            lockoutTriggered = true;
          } else if (newAttempts >= 2) {
            // Show warning after 2 failed attempts
            const remainingAttempts = 4 - newAttempts;
            errorMessage += ` (${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before lockout)`;
          }
        } else if (error.response.status === 404) {
          errorMessage = 'No account found with this email. Please check it.';
         
          // Also count invalid email attempts
          if (newAttempts >= 4) {
            startLockout();
            errorMessage = `Too many failed attempts. Your account has been locked for 30 seconds.`;
            lockoutTriggered = true;
          } else if (newAttempts >= 2) {
            const remainingAttempts = 4 - newAttempts;
            errorMessage += ` (${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before lockout)`;
          }
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
     
      if (!lockoutTriggered) {
        setErrors(prev => ({
          ...prev,
          apiError: errorMessage,
          lockoutError: ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email || errors.lockoutError || errors.apiError) {
      setErrors(prev => ({ ...prev, email: '', lockoutError: '', apiError: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password || errors.lockoutError || errors.apiError) {
      setErrors(prev => ({ ...prev, password: '', lockoutError: '', apiError: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
            <GiCow className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">360 Animal Parenting</h1>
          <p className="text-gray-600">Animal Procurement Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start">
              <CheckCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Lockout Error Message */}
          {errors.lockoutError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
              <Lock className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <span>{errors.lockoutError}</span>
            </div>
          )}

          {/* API Error Message (only show when not locked) */}
          {errors.apiError && !isLocked && !errors.lockoutError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <span>{errors.apiError}</span>
            </div>
          )}

          {/* Lockout Warning (after 2 attempts, before lock) */}
          {loginAttempts >= 2 && loginAttempts < 4 && !isLocked && !successMessage && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-start">
              <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
              <span>
                Warning: {4 - loginAttempts} more failed attempt{4 - loginAttempts > 1 ? 's' : ''} will lock your account for 30 seconds.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLocked || loading || successMessage}
                  className={`w-full pl-10 p-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    isLocked || loading || successMessage ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your email or username"
                  required
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-end pr-3">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <AlertCircle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLocked || loading || successMessage}
                  className={`w-full pl-10 pr-10 p-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    isLocked || loading || successMessage ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || loading || successMessage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg"></div>
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <AlertCircle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLocked || loading || successMessage}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:text-gray-400"
                />
                <span className={`ml-2 text-sm ${isLocked || loading || successMessage ? 'text-gray-400' : 'text-gray-700'}`}>
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className={`text-sm font-medium ${
                  isLocked || loading || successMessage
                    ? 'text-gray-400 pointer-events-none'
                    : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked || successMessage}
              className={`w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium transition-all ${
                loading || isLocked || successMessage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              {isLocked ? (
                <span className="flex items-center justify-center">
                  <Lock className="mr-2" size={18} />
                  Locked ({formatTime(lockTimeLeft)})
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>
              ) : successMessage ? (
                <span className="flex items-center justify-center">
                  <CheckCircle className="mr-2" size={18} />
                  Success! Redirecting...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;