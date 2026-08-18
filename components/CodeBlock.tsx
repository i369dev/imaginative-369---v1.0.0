import React, { useState } from 'react';
import { UserIcon, LockIcon } from './common/Icons';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  clearError: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, clearError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
        clearError();
    }
    setter(e.target.value);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <div className="h-20 flex items-center justify-center">
          <h1 className="font-logo text-5xl text-white whitespace-nowrap">imaginative 369</h1>
        </div>
        <p className="text-neutral-400 mt-2">Sign in to access your dashboard</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card shadow-2xl rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-neutral-400 text-sm font-bold mb-2 sr-only" htmlFor="username">
            Username
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <UserIcon className="h-5 w-5 text-neutral-500" />
             </div>
             <input
              className="bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full text-sm rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleInputChange(setUsername)}
              autoComplete="username"
            />
           </div>
        </div>
        <div>
          <label className="block text-neutral-400 text-sm font-bold mb-2 sr-only" htmlFor="password">
            Password
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <LockIcon className="h-5 w-5 text-neutral-500" />
             </div>
            <input
              className="bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full text-sm rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword)}
              autoComplete="current-password"
            />
           </div>
        </div>
        {error && <p className="text-red-400 text-xs italic text-center pt-2">{error}</p>}
        <div className="flex items-center justify-center pt-4">
          <button
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
      <p className="text-center text-neutral-500 text-sm mt-6">
        <span>&copy;{new Date().getFullYear()} </span>
        <span className="font-logo">imaginative 369</span>
        <span>. All rights reserved.</span>
      </p>
    </div>
  );
};

export default LoginPage;