import React, { useState } from 'react';
import { signIn, signUp } from '../services/firebaseService';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email already in use.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-museum-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-museum-200">
        <div className="bg-museum-900 p-8 text-center text-museum-50">
          <div className="mx-auto w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4 text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-wider">Life Museum</h1>
          <p className="text-museum-400 text-sm mt-2 uppercase tracking-widest">Digital Legacy</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-museum-800 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Your Museum'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-museum-500 uppercase mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-museum-50 border border-museum-200 rounded p-3 text-museum-800 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-museum-500 uppercase mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-museum-50 border border-museum-200 rounded p-3 text-museum-800 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-museum-800 text-white font-bold py-3 rounded hover:bg-museum-900 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Sign In' : 'Start Curator Journey'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-museum-100 pt-6">
            <p className="text-museum-500 text-sm">
              {isLogin ? "Don't have an archive yet?" : "Already have an archive?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-amber-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};