import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    email: '', password: '', username: '', role: searchParams.get('role') || 'client'
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: searchParams.get('role') || 'client' }));
  }, [searchParams]);

  if (authLoading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" />;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await register(formData);
        showToast('Account created successfully!', 'success');
      } else {
        const loggedInUser = await login({ email: formData.email, password: formData.password });
        showToast(`Welcome back, ${loggedInUser.username}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            as a <span className="font-medium text-teal-600">{formData.role}</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <div>
                <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Username" />
              </div>
            )}
            <div>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isSignUp ? '' : 'rounded-t-md'} focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm`} placeholder="Email address" />
            </div>
            <div>
              <br></br>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm " placeholder="Password" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300">
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-teal-600 hover:text-teal-500 cursor-pointer ml-1">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;