
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { MantraDashboard } from './components/MantraDashboard';
import { FrotaDashboard } from './components/FrotaDashboard';
import { AppState, BusinessProfile, UserRole } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'login',
    currentUser: null,
    role: UserRole.GUEST,
  });

  const handleLogin = (email: string) => {
    if (email.includes('admin@frota')) {
      setState({
        view: 'frota',
        currentUser: null,
        role: UserRole.ADMIN
      });
    } else {
      // Simulate existing business login
      setState({
        view: 'mantra',
        currentUser: {
          id: '1',
          name: 'Negócio Exemplo',
          type: 'Fast Food',
          address: 'Luanda',
          hours: '08-20',
          agent: {
            name: 'AtendiBot',
            tone: 'Casual',
            permissions: [],
            additionalInfo: 'Teste',
            isActive: true
          },
          socials: { whatsapp: true, instagram: false, messenger: false }
        },
        role: UserRole.BUSINESS
      });
    }
  };

  const handleSignup = () => {
    setState({ ...state, view: 'onboarding' });
  };

  const handleOnboardingComplete = (profile: BusinessProfile) => {
    setState({
      view: 'mantra',
      currentUser: profile,
      role: UserRole.BUSINESS
    });
  };

  const handleLogout = () => {
    setState({
      view: 'login',
      currentUser: null,
      role: UserRole.GUEST
    });
  };

  return (
    <div className="font-sans antialiased text-carbon-text bg-carbon-900 min-h-screen">
      {state.view === 'login' && (
        <Login onLogin={handleLogin} onSignup={handleSignup} />
      )}
      {state.view === 'onboarding' && (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          onCancel={() => setState({...state, view: 'login'})} 
        />
      )}
      {state.view === 'mantra' && state.currentUser && (
        <MantraDashboard 
          business={state.currentUser} 
          onLogout={handleLogout} 
        />
      )}
      {state.view === 'frota' && (
        <FrotaDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
