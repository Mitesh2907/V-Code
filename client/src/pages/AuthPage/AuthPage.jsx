import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Code, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import { SkeletonBox, SkeletonText } from '../../components/common/Skeleton';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(searchParams.get('tab') !== 'signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    return; // ⛔ yahin stop
  }

  try {
    if (isLogin) {
      await login(formData.email, formData.password);
      navigate('/profile');
    } else {
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      navigate('/profile');
    }
  } catch (error) {
    setErrors({
      form: error?.response?.data?.message || "Something went wrong"
    });
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <SkeletonBox height="h-8" width="w-3/4" className="mx-auto mb-4" shimmer />
              <SkeletonText lines={2} />
            </div>

            <div className="space-y-4">
              {!isLogin && <SkeletonBox height="h-12" shimmer />}
              <SkeletonBox height="h-12" shimmer />
              <SkeletonBox height="h-12" shimmer />
              {!isLogin && <SkeletonBox height="h-12" shimmer />}
            </div>

            <div className="mt-6">
              <SkeletonBox height="h-12" shimmer />
            </div>

            <div className="mt-6">
              <SkeletonBox height="h-6" width="w-full" shimmer />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/5 dark:bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  V-Code
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Collaborative Editor</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {isLogin ? (
                  <>
                    Welcome <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Back!</span>
                  </>
                ) : (
                  <>
                    Start Coding <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Together</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {isLogin
                  ? 'Sign in to continue your collaborative coding journey'
                  : 'Join thousands of developers building amazing projects together in real-time'
                }
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              {[
                { icon: Zap, text: 'Real-time collaboration', color: 'text-yellow-500' },
                { icon: Shield, text: 'Secure & encrypted', color: 'text-green-500' },
                // { icon: Sparkles, text: '50+ languages supported', color: 'text-purple-500' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-shadow ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            {/* <div className="flex items-center space-x-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rooms Created</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <div className="p-8">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  V-Code
                </h2>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin
                  ? 'Sign in to your V-Code account to continue'
                  : 'Join thousands of developers coding together'
                }
              </p>
            </div>

            {/* Desktop Header */}
            <div className="text-center mb-8 hidden lg:block">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin
                  ? 'Sign in to continue'
                  : 'Get started in seconds'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  icon={User}
                  required
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                icon={Lock}
                required
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  icon={Lock}
                  required
                />
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset would be implemented')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={authLoading}
                icon={ArrowRight}
                fullWidth
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Demo Credentials Hint */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">Demo Credentials:</span>
                  <div className="mt-1 space-y-1">
                    <div>Email: <span className="font-mono text-blue-600 dark:text-blue-400">demo@example.com</span></div>
                    <div>Password: <span className="font-mono text-blue-600 dark:text-blue-400">any 6+ characters</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-500">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => alert('Terms of Service would be shown')}
                className="text-blue-600 hover:text-blue-700"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => alert('Privacy Policy would be shown')}
                className="text-blue-600 hover:text-blue-700"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;