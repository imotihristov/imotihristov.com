import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAdmin, loading } = useAuth();

  useEffect(() => {
    // If already logged in, go straight to admin dashboard
    if (!loading && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        // Translate common error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Грешен имейл или парола');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Имейлът не е потвърден. Моля, проверете входящата си поща.');
        } else {
          setError(signInError.message || 'Възникна грешка при вход');
        }
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('Възникна неочаквана грешка');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium">
        <span className="material-symbols-outlined">arrow_back</span>
        Към сайта
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7f3eb] p-8 md:p-10">
        <div className="flex justify-center">
          <Link to="/">
            <img src="/logo.png" alt="Имоти Христов" className="h-36 w-auto object-contain" />
          </Link>
        </div>
        
        <h1 className="text-2xl font-black text-center text-[#0d1b12] mb-2">Административен вход</h1>
        <p className="text-center text-text-secondary mb-8">Моля, въведете своите данни за достъп</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#0d1b12]">Имейл адрес</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="admin@imotihristov.bg"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#0d1b12]">Парола</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Въведете парола"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Вход...</span>
              </>
            ) : (
              <>
                <span>Вход</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            За създаване на акаунт се свържете с администратор.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
