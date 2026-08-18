import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, LockIcon } from './common/Icons';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error: string | null;
  clearError: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, clearError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  // Smoother mouse move effect for parallax and card glow
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const easing = 0.08; // Smoothing factor. Lower is smoother.

    const animate = () => {
      // Lerp towards target rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * easing;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * easing;

      // Apply transform if the component is still mounted
      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { top, left, width, height } = containerRef.current.getBoundingClientRect();
      
      // Reduced max rotation for a more subtle effect
      const xRotate = -((clientY - top - height / 2) / (height / 2)) * 5; 
      const yRotate = ((clientX - left - width / 2) / (width / 2)) * 5;
      
      targetRotation.current = { x: xRotate, y: yRotate };

      const card = containerRef.current.querySelector('.glass-card') as HTMLFormElement;
      if (card) {
        const mouseX = clientX - left;
        const mouseY = clientY - top;
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);
      }
    };

    const handleMouseLeave = () => {
      targetRotation.current = { x: 0, y: 0 };
    };

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);
    
    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Reset transform on cleanup just in case
      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
      }
    };
  }, []);


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
    <div 
      ref={containerRef} 
      className="w-full max-w-md"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="text-center mb-10" style={{ transform: 'translateZ(40px)' }}>
        <div className="h-20 flex items-center justify-center animate-float">
          <h1 className="font-logo text-5xl text-white whitespace-nowrap">imaginative 369</h1>
        </div>
        <div 
            className="logo-shadow animate-float-shadow"
            style={{ transform: 'translateZ(15px)' }}
        ></div>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 font-medium mt-4">Sign in to access your dashboard</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card shadow-2xl rounded-2xl p-8 space-y-6" style={{ transform: 'translateZ(20px)' }}>
        <div>
          <label className="block text-neutral-400 text-sm font-bold mb-2 sr-only" htmlFor="username">
            Username
          </label>
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <UserIcon className="h-5 w-5 text-neutral-400" />
             </div>
             <input
              className="bg-neutral-900/60 border border-neutral-700 placeholder-neutral-400 text-white block w-full text-sm rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
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
               <LockIcon className="h-5 w-5 text-neutral-400" />
             </div>
            <input
              className="bg-neutral-900/60 border border-neutral-700 placeholder-neutral-400 text-white block w-full text-sm rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
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
      <p className="text-center text-neutral-400 text-sm mt-6" style={{ transform: 'translateZ(10px)' }}>
        <span>&copy;{new Date().getFullYear()} </span>
        <span className="font-logo">imaginative 369</span>
        <span>. All rights reserved.</span>
      </p>
    </div>
  );
};

export default LoginPage;