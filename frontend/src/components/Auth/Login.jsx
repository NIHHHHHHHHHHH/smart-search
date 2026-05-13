import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser, guestLogin } from '../../services/api';
import { Button, FormField, ErrorBanner, TextInput } from '../ui';


const Login = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const getFieldError = (field) => {
    if (!touched[field]) return '';
    if (field === 'email' && formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      return 'Enter a valid email address';
    if (field === 'password' && formData.password.length < 1)
      return 'Password is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    setLoading(true);
    try {
      if (!formData.email || !formData.password) throw new Error('Please fill in all fields');
      const response = await loginUser(formData);
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
      setFormData((prev) => ({ ...prev, password: '' }));
      setTouched((prev) => ({ ...prev, password: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setGuestLoading(true);
    try {
      const response = await guestLogin();
      login(response.data);
    } catch (err) {
      setError(err.message || 'Guest login failed. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  const isDisabled = loading || guestLoading;

  return (
    <div className="w-full bg-bg-elevated border border-border rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-1">Welcome back</h2>
      <p className="text-sm text-text-secondary mb-7">Sign in to your account and pick up right where you left off.</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField label="Email address" error={getFieldError('email')}>
          <TextInput
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="xyz@gmail.com"
            disabled={isDisabled}
            hasError={!!getFieldError('email')}
          />
        </FormField>

        <FormField
          label="Password"
          error={getFieldError('password')}
          rightLabel={<button type="button" className="text-[10px] text-accent hover:opacity-80 transition-opacity font-medium cursor-pointer">Forgot password?</button>}
        >
          <TextInput
            icon={Lock}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            disabled={isDisabled}
            hasError={!!getFieldError('password')}
            showToggle
            showValue={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </FormField>

        <Button type="submit" variant="primary" fullWidth loading={loading} disabled={isDisabled} className="mt-1 cursor-pointer">
          <span>Sign In to Workspace</span><ArrowRight size={14} />
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-bg-elevated text-[10px] font-semibold tracking-widest uppercase text-text-tertiary">or</span>
        </div>
      </div>

      <Button className="cursor-pointer" variant="demo" fullWidth loading={guestLoading} disabled={isDisabled} onClick={handleGuestLogin}>
        <Users size={15} /><span>Explore as Guest - No Sign Up Required</span>
      </Button>

      <p className="text-center text-sm text-text-tertiary mt-6">
        New to Smart Search?{' '}
        <button onClick={onToggleForm} className="text-accent font-semibold hover:opacity-80 transition-opacity cursor-pointer ml-2">
          Create a free account
        </button>
      </p>
    </div>
  );
};

export default Login;