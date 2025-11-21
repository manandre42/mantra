import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { User, Lock, ArrowRight, ShoppingBag, CreditCard, Shield } from 'lucide-react';

const motion = m as any;

interface LoginProps {
  onLogin: (email: string) => void;
  onSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-carbon-900 p-4 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-2 bg-carbon-blue" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-carbon-800 rounded-full blur-3xl opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-carbon-800 p-8 border border-carbon-700 shadow-2xl relative z-10"
      >
        <div className="mb-8 border-l-4 border-carbon-blue pl-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">Mantra</h1>
          <p className="text-carbon-secondary text-sm mt-1">Plataforma Inteligente de Negócios</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-carbon-secondary uppercase">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-carbon-600" />
              <input
                type="email"
                className="w-full bg-carbon-700 text-white p-3 pl-10 border-b-2 border-transparent focus:border-carbon-blue focus:bg-carbon-600 outline-none transition-all placeholder-carbon-600"
                placeholder="admin@frota.com ou seu@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-carbon-secondary uppercase">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-carbon-600" />
              <input
                type="password"
                className="w-full bg-carbon-700 text-white p-3 pl-10 border-b-2 border-transparent focus:border-carbon-blue focus:bg-carbon-600 outline-none transition-all placeholder-carbon-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-carbon-blue hover:bg-carbon-blueHover text-white p-4 flex justify-between items-center transition-colors group"
          >
            <span className="font-semibold">Entrar</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={onSignup}
            className="text-carbon-blue text-sm hover:underline hover:text-white transition-colors"
          >
            Criar conta de negócio
          </button>
        </div>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
      >
        <QuickLink icon={<ShoppingBag />} title="Ver Pedidos" desc="Acompanhe status sem login" />
        <QuickLink icon={<CreditCard />} title="Subscrição" desc="Planos e renovação" />
        <QuickLink icon={<Shield />} title="Direitos" desc="Termos e privacidade" />
      </motion.div>
    </div>
  );
};

const QuickLink = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <a href="#" className="flex items-center space-x-4 bg-carbon-800 p-4 border border-carbon-700 hover:border-carbon-blue transition-colors group">
    <div className="text-carbon-secondary group-hover:text-carbon-blue transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-semibold text-sm">{title}</h3>
      <p className="text-carbon-secondary text-xs">{desc}</p>
    </div>
  </a>
);