
import React, { useState, useCallback, useEffect } from 'react';
import { Category, Transaction, SavingsGoal, User, UserRole, Bill, WishlistItem, SavingsChallenge } from './types';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Aspirations from './components/Aspirations';
import Bills from './components/Bills';
import AIAssistant from './components/AIAssistant';
import Challenges from './components/Challenges';
import Circle from './components/Circle';
import Login from './components/Login';
import Identity from './components/Identity';
import LumiCompanion from './components/LumiCompanion';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vesta_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'bills' | 'aspirations' | 'challenges' | 'circle' | 'ai' | 'identity'>('dashboard');
  const [lumiMood, setLumiMood] = useState<'happy' | 'thinking' | 'resting' | 'excited'>('happy');
  
  // Data State - Scoped to familyId
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('vesta_transactions') || '[]'));
  const [bills, setBills] = useState<Bill[]>(() => JSON.parse(localStorage.getItem('vesta_bills') || '[]'));
  const [visions, setVisions] = useState<SavingsGoal[]>(() => JSON.parse(localStorage.getItem('vesta_visions') || '[]'));
  const [desires, setDesires] = useState<WishlistItem[]>(() => JSON.parse(localStorage.getItem('vesta_desires') || '[]'));
  const [challenges, setChallenges] = useState<SavingsChallenge[]>(() => JSON.parse(localStorage.getItem('vesta_challenges') || '[]'));

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('vesta_transactions', JSON.stringify(transactions));
    localStorage.setItem('vesta_bills', JSON.stringify(bills));
    localStorage.setItem('vesta_visions', JSON.stringify(visions));
    localStorage.setItem('vesta_desires', JSON.stringify(desires));
    localStorage.setItem('vesta_challenges', JSON.stringify(challenges));
  }, [transactions, bills, visions, desires, challenges]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('vesta_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('vesta_current_user');
  }, [currentUser]);

  // Filtered data for current family
  const familyTransactions = transactions.filter(t => t.familyId === currentUser?.familyId);
  const familyBills = bills.filter(b => b.familyId === currentUser?.familyId);
  const familyVisions = visions.filter(v => v.familyId === currentUser?.familyId);
  const familyDesires = desires.filter(d => d.familyId === currentUser?.familyId);
  const familyChallenges = challenges.filter(c => c.familyId === currentUser?.familyId);

  const triggerCelebration = useCallback(() => {
    const layer = document.getElementById('animation-layer');
    if (!layer) return;
    const colors = ['#b497ff', '#ff9d8c', '#1e1b29', '#fcfaff'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'celebration-fly';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.bottom = `-20px`;
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animationDelay = `${Math.random() * 0.5}s`;
      layer.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
    setLumiMood('excited');
    setTimeout(() => setLumiMood('happy'), 2500);
  }, []);

  const addTransaction = (t: Omit<Transaction, 'id' | 'userId' | 'userName' | 'familyId'>) => {
    if (!currentUser) return;
    setTransactions(prev => [...prev, { 
      ...t, 
      id: Math.random().toString(36).substr(2, 9), 
      userId: currentUser.id,
      userName: currentUser.name,
      familyId: currentUser.familyId
    }]);
    triggerCelebration();
  };

  const handleUpdateChallenge = (id: string, amount: number) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, current: Math.min(c.target, c.current + amount) } : c));
    triggerCelebration();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row mesh-gradient animate-bloom">
      {/* Premium Sidebar */}
      <nav className="w-full md:w-80 bg-white/40 backdrop-blur-3xl text-[#1e1b29] flex flex-col p-8 md:p-12 z-30 relative border-r border-white/50">
        <div className="mb-20">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-14 h-14 bg-[#1a1625] rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-[15deg]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl serif font-bold tracking-tight title-shimmer">Vesta</h1>
              <p className="text-[9px] uppercase tracking-[0.6em] text-gray-400 font-black">Household</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1 relative z-10">
          {[
            { id: 'dashboard', label: 'Hearth', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'expenses', label: 'Logs', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'bills', label: 'Dues', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
            { id: 'aspirations', label: 'Visions', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'challenges', label: 'Sprints', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z' },
            { id: 'circle', label: 'Circle', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'ai', label: 'Oracle', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.139-4.17l.054.09m-11.633-1.62c.38.647.822 1.251 1.317 1.807m4.358-1.807c-.38.647-.822 1.251-1.317 1.807M12 11V7a4 4 0 018 0v4M6 11v-4a4 4 0 018 0v4m-8 0a4 4 0 008 0' },
            { id: 'identity', label: 'Identity', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          ].map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-6 px-8 py-5 rounded-2xl transition-all duration-500 group border-none text-[10px] uppercase font-black tracking-[0.4em] ${
                activeTab === item.id 
                ? 'nav-active' 
                : 'hover:bg-white/60 text-gray-400'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <svg className={`w-5 h-5 transition-all ${activeTab === item.id ? 'text-white' : 'group-hover:text-[#b497ff]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-10 border-t border-white/40">
          <div onClick={() => setActiveTab('identity')} className="flex items-center gap-4 group cursor-pointer p-4 hover:bg-white/60 rounded-3xl transition-all">
            <div className="relative overflow-hidden rounded-2xl shadow-xl w-12 h-12">
               <img src={currentUser.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-125" alt="Profile" />
               <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[#1e1b29] truncate">{currentUser.name}</p>
              <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest leading-none mt-1">Hearth Member</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 relative z-10">
        <div key={activeTab} className="max-w-6xl mx-auto pb-48 animate-bloom">
          {activeTab === 'dashboard' && <Dashboard transactions={familyTransactions} goals={familyVisions} bills={familyBills} currentUser={currentUser} />}
          {activeTab === 'expenses' && <Expenses transactions={familyTransactions} onAdd={addTransaction} />}
          {activeTab === 'bills' && <Bills bills={familyBills} onToggle={(id) => setBills(prev => prev.map(b => b.id === id ? {...b, isPaid: !b.isPaid} : b))} onAdd={(b) => setBills(prev => [...prev, {...b, id: Math.random().toString(), familyId: currentUser.familyId}])} />}
          {activeTab === 'aspirations' && (
            <Aspirations 
              visions={familyVisions} 
              desires={familyDesires} 
              onAddVision={(v) => setVisions(prev => [...prev, {...v, id: Math.random().toString(), familyId: currentUser.familyId}])} 
              onUpdateVision={(id, amt) => setVisions(prev => prev.map(v => v.id === id ? {...v, currentAmount: v.currentAmount + amt} : v))}
              onAddDesire={(d) => setDesires(prev => [...prev, {...d, id: Math.random().toString(), familyId: currentUser.familyId, votes: 1, suggestedBy: currentUser.name}])}
              onVoteDesire={(id) => setDesires(prev => prev.map(d => d.id === id ? {...d, votes: d.votes + 1} : d))}
            />
          )}
          {activeTab === 'challenges' && <Challenges challenges={familyChallenges} onUpdate={handleUpdateChallenge} />}
          {activeTab === 'circle' && <Circle currentUser={currentUser} onUpdateUser={setCurrentUser} />}
          {activeTab === 'ai' && <AIAssistant transactions={familyTransactions} goals={familyVisions} />}
          {activeTab === 'identity' && <Identity user={currentUser} onLogout={handleLogout} />}
        </div>
      </main>

      <LumiCompanion mood={lumiMood} onSparkleClick={triggerCelebration} />
    </div>
  );
};

export default App;
