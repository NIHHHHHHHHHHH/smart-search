import React, { useState } from 'react';
import { FileSearch, Zap, Shield, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { guestLogin } from '../../services/api';
import Login from './Login';
import Register from './Register';

/**
 * AuthPage Component
 * 
 * Authentication page that toggles between login and register forms
 */
const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const response = await guestLogin();
      login(response.data);
    } catch (error) {
      console.error('Guest login failed:', error);
      alert('Guest login failed. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="space-y-6">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileSearch className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Smart Search</h1>
                <p className="text-slate-600">AI-Powered Document Management</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Instant AI Processing</h3>
                  <p className="text-slate-600 text-sm">Automatically categorize and tag documents with AI</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileSearch className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Semantic Search</h3>
                  <p className="text-slate-600 text-sm">Find documents using natural language queries</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Secure Storage</h3>
                  <p className="text-slate-600 text-sm">Your documents are encrypted and safely stored</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Team Collaboration</h3>
                  <p className="text-slate-600 text-sm">Share and manage documents with your team</p>
                </div>
              </div>
            </div>

            {/* Quick Access Card for Recruiters */}
            <div className="mt-8 p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">For Recruiters</h3>
                  <p className="text-sm text-purple-700">Instant demo access</p>
                </div>
              </div>
              <p className="text-sm text-purple-800 mb-4">
                Skip the signup and explore the app instantly with a demo account. Perfect for quick portfolio reviews!
              </p>
              <button
                onClick={handleGuestLogin}
                disabled={guestLoading}
                className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-300 transition-all font-medium flex items-center justify-center space-x-2 shadow-md"
              >
                {guestLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Try Demo Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div>
          {isLogin ? (
            <Login onToggleForm={toggleForm} />
          ) : (
            <Register onToggleForm={toggleForm} />
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;