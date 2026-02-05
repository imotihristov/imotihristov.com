import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, go straight to admin dashboard
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Грешно потребителско име или парола');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium">
        <span className="material-symbols-outlined">arrow_back</span>
        Към сайта
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7f3eb] p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
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
            <label className="text-sm font-bold text-[#0d1b12]">Потребителско име</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Въведете потребителско име"
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
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Вход</span>
            <span className="material-symbols-outlined text-lg">login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;