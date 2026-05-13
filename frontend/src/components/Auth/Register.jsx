import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../services/api';
import { Button, FormField, ErrorBanner, TextInput } from '../ui';

const strengthMeta = [
  { label: '', color: 'bg-bg-overlay', text: 'text-text-tertiary' },
  { label: 'Too weak — add more characters', color: 'bg-red-400', text: 'text-red-400' },
  { label: 'Fair — try mixing in numbers', color: 'bg-amber-400', text: 'text-amber-400' },
  { label: 'Good — almost there', color: 'bg-accent', text: 'text-accent' },
  { label: 'Strong password', color: 'bg-emerald-400', text: 'text-emerald-400' },
  { label: 'Excellent — rock solid', color: 'bg-emerald-400', text: 'text-emerald-400' },
];

const Register = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const getFieldError = (field) => {
    if (!touched[field]) return '';
    switch (field) {
      case 'name': return !formData.name ? 'Name is required' : formData.name.length < 2 ? 'At least 2 characters required' : '';
      case 'email': return !formData.email ? 'Email is required' : !/^\S+@\S+\.\S+$/.test(formData.email) ? 'Enter a valid email address' : '';
      case 'password': return !formData.password ? 'Password is required' : formData.password.length < 6 ? 'Minimum 6 characters required' : '';
      case 'confirmPassword': return !formData.confirmPassword ? 'Please confirm your password' : formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';
      default: return '';
    }
  };

  const getStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) throw new Error('Please fill in all fields');
    if (formData.name.length < 2) throw new Error('Name must be at least 2 characters');
    if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) throw new Error('Please enter a valid email address');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setLoading(true);
    try {
      validateForm();
      const { confirmPassword, ...registrationData } = formData;
      const response = await registerUser(registrationData);
      login(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength();
  const sm = strengthMeta[strength];
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="w-full bg-bg-elevated border border-border rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-1">Start for free</h2>
      <p className="text-sm text-text-secondary mb-7">Set up your account in seconds. No credit card required.</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        <FormField label="Full name" error={getFieldError('name')}>
          <TextInput
            icon={User}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Smith"
            disabled={loading}
            hasError={!!getFieldError('name')}
          />
        </FormField>

        <FormField label="Email address" error={getFieldError('email')}>
          <TextInput
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="xyz@gmail.com"
            disabled={loading}
            hasError={!!getFieldError('email')}
          />
        </FormField>

        <FormField label="Create a password" error={getFieldError('password')}>
          <TextInput
            icon={Lock}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Min. 6 characters"
            disabled={loading}
            hasError={!!getFieldError('password')}
            showToggle
            showValue={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? sm.color : 'bg-bg-overlay'}`} />
                ))}
              </div>
              <p className={`text-[11px] ${sm.text}`}>{sm.label}</p>
            </div>
          )}
        </FormField>

        <FormField label="Confirm password" error={getFieldError('confirmPassword')}>
          <TextInput
            icon={passwordsMatch ? CheckCircle : Lock}
            iconClassName={passwordsMatch ? 'text-emerald-400' : undefined}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter your password"
            disabled={loading}
            hasError={!!getFieldError('confirmPassword')}
            showToggle
            showValue={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            extraBorderClass={passwordsMatch ? 'border-emerald-500/30!' : ''}
          />
        </FormField>

        <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-1 cursor-pointer">
          <span>Create Free Account</span><ArrowRight size={14} />
        </Button>

      </form>

      <p className="text-center text-sm text-text-tertiary mt-6">
        Already have an account?{' '}
        <button onClick={onToggleForm} className="text-accent font-semibold hover:opacity-80 transition-opacity cursor-pointer ml-2">
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;