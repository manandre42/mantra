import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Clock, CheckCircle, Truck, 
  Settings, MessageSquare, BarChart2, Bell, LogOut, Send, Plus,
  Menu, X, Users, Brain, Save, Edit3, Power, Share2, Smartphone, 
  QrCode, Link, Globe, ChevronDown, Copy, Facebook, Instagram
} from 'lucide-react';
import { BusinessProfile, Order, OrderStatus } from '../types';
import { generateAgentResponse, simulateIncomingOrder, analyzeBusinessStats } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const motion = m as any;

interface MantraDashboardProps {
  business: BusinessProfile;
  onLogout: () => void;
}

// CRM Interface
interface Client {
  id: string;
  name: string;
  contact: string;
  lastInteraction: string;
  hasOrdered: boolean;
}

export const MantraDashboard: React.FC<MantraDashboardProps> = ({ business, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'agent' | 'stats' | 'connections'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Edit Business State
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [tempBusiness, setTempBusiness] = useState<BusinessProfile>(business);

  // Agent Chat Simulation State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: `Olá! Eu sou ${business.agent.name}. Como posso ajudar seus clientes hoje?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [simChannel, setSimChannel] = useState<'WhatsApp' | 'Instagram' | 'Messenger'>('WhatsApp');

  // Stats & CRM State
  const [clients, setClients] = useState<Client[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // Connections State
  const [whatsappNumber, setWhatsappNumber] = useState('+244');
  const [telegramToken, setTelegramToken] = useState('');

  // Initial Mock Data
  useEffect(() => {
    const initialOrders: Order[] = [
      { id: '101', customerName: 'João Silva', items: ['X-Bacon', 'Coca-Cola'], total: 2500, status: OrderStatus.PENDING, timestamp: new Date(), type: 'delivery', channel: 'WhatsApp' },
      { id: '102', customerName: 'Maria Ana', items: ['Açaí 500ml'], total: 1800, status: OrderStatus.IN_PROGRESS, timestamp: new Date(), type: 'pickup', channel: 'Instagram' },
    ];
    setOrders(initialOrders);

    const mockClients: Client[] = [
      { id: 'c1', name: 'João Silva', contact: '+244 923 000 000', lastInteraction: 'Hoje', hasOrdered: true },
      { id: 'c2', name: 'Pedro Manuel', contact: '+244 923 111 222', lastInteraction: 'Ontem', hasOrdered: false },
      { id: 'c3', name: 'Maria Ana', contact: '@maria.ana', lastInteraction: 'Hoje', hasOrdered: true },
      { id: 'c4', name: 'Sofia Costa', contact: '+244 933 444 555', lastInteraction: 'Semana passada', hasOrdered: false },
    ];
    setClients(mockClients);
  }, []);

  const handleSimulateOrder = async () => {
    try {
      const newOrderData = await simulateIncomingOrder(business.type);
      const newOrder: Order = {
        ...newOrderData as any,
        id: Math.floor(Math.random() * 1000).toString(),
        status: OrderStatus.PENDING,
        timestamp: new Date()
      };
      setOrders(prev => [newOrder, ...prev]);
    } catch (error) {
      console.error("Simulation failed", error);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    // Check if agent is active
    if (!tempBusiness.agent.isActive) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'agent', text: "[Resposta Automática]: O agente está atualmente desativado." }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    const response = await generateAgentResponse(userMsg, tempBusiness.agent, tempBusiness.name);
    setChatHistory(prev => [...prev, { role: 'agent', text: response }]);
    setIsTyping(false);
  };

  const handleGenerateAnalysis = async () => {
    setIsLoadingAnalysis(true);
    const stats = {
      revenue: orders.reduce((acc, o) => acc + o.total, 0) * 120, // Mock monthly multiplier
      totalOrders: orders.length * 50,
      totalClients: clients.length * 60
    };
    const analysis = await analyzeBusinessStats(stats);
    setAiAnalysis(analysis);
    setIsLoadingAnalysis(false);
  };

  const saveBusinessSettings = () => {
    setIsEditingBusiness(false);
    if (tempBusiness.agent.isActive) {
        setChatHistory([{ role: 'agent', text: `Olá! Eu sou ${tempBusiness.agent.name} (Atualizado). Como posso ajudar?` }]);
    }
  };

  const toggleAgentActive = () => {
    setTempBusiness(prev => ({
      ...prev,
      agent: { ...prev.agent, isActive: !prev.agent.isActive }
    }));
  };

  const cycleSimChannel = () => {
    const channels: ('WhatsApp' | 'Instagram' | 'Messenger')[] = ['WhatsApp', 'Instagram', 'Messenger'];
    const idx = channels.indexOf(simChannel);
    setSimChannel(channels[(idx + 1) % channels.length]);
  };

  const chartData = [
    { name: 'Seg', val: 4000 },
    { name: 'Ter', val: 3000 },
    { name: 'Qua', val: 2000 },
    { name: 'Qui', val: 2780 },
    { name: 'Sex', val: 1890 },
    { name: 'Sab', val: 2390 },
    { name: 'Dom', val: 3490 },
  ];

  return (
    <div className="min-h-screen bg-carbon-900 text-white flex relative overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-carbon-800 w-[80%] max-w-sm shadow-2xl border-r border-carbon-700 flex flex-col md:hidden"
          >
             <div className="p-6 border-b border-carbon-700 flex justify-between items-center">
               <div>
                  <h1 className="text-xl font-bold tracking-tight">Mantra</h1>
                  <p className="text-xs text-carbon-secondary truncate max-w-[150px]">{business.name}</p>
               </div>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white bg-carbon-700 rounded-full">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <nav className="flex-1 p-4 space-y-2">
               <SidebarItem icon={<ShoppingBag />} label="Pedidos" active={activeTab === 'orders'} onClick={() => {setActiveTab('orders'); setMobileMenuOpen(false);}} />
               <SidebarItem icon={<MessageSquare />} label="Agente AI" active={activeTab === 'agent'} onClick={() => {setActiveTab('agent'); setMobileMenuOpen(false);}} />
               <SidebarItem icon={<BarChart2 />} label="Relatórios" active={activeTab === 'stats'} onClick={() => {setActiveTab('stats'); setMobileMenuOpen(false);}} />
               <SidebarItem icon={<Share2 />} label="Conexões" active={activeTab === 'connections'} onClick={() => {setActiveTab('connections'); setMobileMenuOpen(false);}} />
             </nav>
             <div className="p-4 border-t border-carbon-700">
                <button onClick={onLogout} className="flex items-center space-x-2 text-red-400 p-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-carbon-800 border-r border-carbon-700 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-carbon-700">
          <h1 className="text-xl font-bold tracking-tight">Mantra</h1>
          <p className="text-xs text-carbon-secondary mt-1 truncate">{business.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<ShoppingBag />} label="Pedidos" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={<MessageSquare />} label="Agente AI" active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} />
          <SidebarItem icon={<BarChart2 />} label="Relatórios" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <SidebarItem icon={<Share2 />} label="Conexões" active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} />
        </nav>
        <div className="p-4 border-t border-carbon-700">
          <button onClick={onLogout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm w-full p-2 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-carbon-700 bg-carbon-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 mr-2 text-white hover:bg-carbon-700 rounded">
               <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg">Mantra</span>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button onClick={handleSimulateOrder} className="bg-carbon-blue hover:bg-carbon-blueHover text-white px-3 py-1.5 text-xs font-semibold flex items-center shadow-lg transition-all active:scale-95">
              <Plus className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Simular Pedido</span>
              <span className="sm:hidden">Simular</span>
            </button>
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-carbon-secondary hover:text-white transition-colors" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-8 h-8 rounded-full bg-carbon-700 flex items-center justify-center text-xs font-bold border border-carbon-600">
              {business.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full content-start">
              <OrderColumn title="Pendente" icon={<Clock className="w-4 h-4" />} color="border-yellow-500" orders={orders.filter(o => o.status === OrderStatus.PENDING)} onStatusChange={handleStatusChange} nextStatus={OrderStatus.IN_PROGRESS} />
              <OrderColumn title="Em Execução" icon={<ShoppingBag className="w-4 h-4" />} color="border-blue-500" orders={orders.filter(o => o.status === OrderStatus.IN_PROGRESS)} onStatusChange={handleStatusChange} nextStatus={OrderStatus.READY} />
              <OrderColumn title="Pronto" icon={<CheckCircle className="w-4 h-4" />} color="border-green-500" orders={orders.filter(o => o.status === OrderStatus.READY)} onStatusChange={handleStatusChange} nextStatus={OrderStatus.DELIVERED} />
              <OrderColumn title="Entregue" icon={<Truck className="w-4 h-4" />} color="border-gray-500" orders={orders.filter(o => o.status === OrderStatus.DELIVERED)} onStatusChange={handleStatusChange} />
            </div>
          )}

          {activeTab === 'agent' && (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-full lg:h-[calc(100%-20px)]">
              {/* Left Panel: Config/Review (Big on mobile via flex-1, 66% on desktop) */}
              <div className="flex-1 min-h-[400px] lg:min-h-0 lg:col-span-2 bg-carbon-800 p-6 border border-carbon-700 shadow-lg flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-carbon-blue" />
                    Configuração & Status
                  </h2>
                  <div className="flex items-center space-x-2">
                     {!isEditingBusiness ? (
                      <button 
                        onClick={() => setIsEditingBusiness(true)}
                        className="text-xs flex items-center bg-carbon-700 px-3 py-1.5 hover:bg-carbon-600 transition-colors text-white"
                      >
                        <Edit3 className="w-3 h-3 mr-1" /> Editar
                      </button>
                    ) : (
                      <button 
                        onClick={saveBusinessSettings}
                        className="text-xs flex items-center bg-green-700 px-3 py-1.5 hover:bg-green-600 transition-colors text-white"
                      >
                        <Save className="w-3 h-3 mr-1" /> Salvar
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  {!isEditingBusiness ? (
                     // View Mode
                     <>
                        <div className="flex items-center justify-between bg-carbon-900 p-4 border border-carbon-700 rounded-sm">
                           <span className="text-sm font-semibold flex items-center text-carbon-secondary">
                              <Power className="w-4 h-4 mr-2" />
                              Status do Agente
                           </span>
                           <button
                              onClick={toggleAgentActive}
                              className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer hover:brightness-110 ${
                                tempBusiness.agent.isActive 
                                  ? 'bg-green-900/40 text-green-400 border-green-800 hover:bg-green-900/60' 
                                  : 'bg-red-900/40 text-red-400 border-red-800 hover:bg-red-900/60'
                              }`}
                           >
                             {tempBusiness.agent.isActive ? 'ONLINE' : 'OFFLINE'}
                             <div className={`w-2 h-2 rounded-full ml-2 ${tempBusiness.agent.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                           </button>
                        </div>
                        <InfoRow label="Nome Agente" value={tempBusiness.agent.name} />
                        <InfoRow label="Tom de Voz" value={tempBusiness.agent.tone} />
                        <InfoRow label="Horário" value={tempBusiness.hours} />
                        <div className="pt-4 border-t border-carbon-700">
                          <label className="text-xs uppercase text-carbon-secondary mb-2 block">Conhecimento (Menu/Info)</label>
                          <p className="text-sm text-gray-300 bg-carbon-900 p-4 border border-carbon-700 rounded-sm leading-relaxed">
                            {tempBusiness.agent.additionalInfo || "Nenhuma informação adicional configurada."}
                          </p>
                        </div>
                     </>
                  ) : (
                    // Edit Mode
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                       <div className="flex items-center justify-between bg-carbon-900 p-4 border border-carbon-700 rounded-sm mb-4">
                          <span className="text-sm font-semibold flex items-center text-white">
                             <Power className="w-4 h-4 mr-2" />
                             Habilitar Agente
                          </span>
                          <button
                            onClick={toggleAgentActive}
                            className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${tempBusiness.agent.isActive ? 'bg-green-500 justify-end' : 'bg-carbon-600 justify-start'}`}
                          >
                            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
                          </button>
                       </div>

                       <div className="space-y-2">
                         <label className="text-xs uppercase text-carbon-secondary">Nome do Agente</label>
                         <input 
                           type="text" 
                           value={tempBusiness.agent.name}
                           onChange={(e) => setTempBusiness({...tempBusiness, agent: {...tempBusiness.agent, name: e.target.value}})}
                           className="w-full bg-carbon-700 p-2 text-sm text-white border border-carbon-600 focus:border-carbon-blue outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs uppercase text-carbon-secondary">Tom de Voz</label>
                         <select 
                           value={tempBusiness.agent.tone}
                           onChange={(e) => setTempBusiness({...tempBusiness, agent: {...tempBusiness.agent, tone: e.target.value as any}})}
                           className="w-full bg-carbon-700 p-2 text-sm text-white border border-carbon-600 focus:border-carbon-blue outline-none"
                         >
                            {['Casual', 'Formal', 'Divertido', 'Amigável'].map(t => <option key={t}>{t}</option>)}
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs uppercase text-carbon-secondary">Horário</label>
                         <input 
                           type="text" 
                           value={tempBusiness.hours}
                           onChange={(e) => setTempBusiness({...tempBusiness, hours: e.target.value})}
                           className="w-full bg-carbon-700 p-2 text-sm text-white border border-carbon-600 focus:border-carbon-blue outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs uppercase text-carbon-secondary">Informações (Menu/Regras)</label>
                         <textarea 
                           value={tempBusiness.agent.additionalInfo}
                           onChange={(e) => setTempBusiness({...tempBusiness, agent: {...tempBusiness.agent, additionalInfo: e.target.value}})}
                           className="w-full h-32 bg-carbon-700 p-2 text-sm text-white border border-carbon-600 focus:border-carbon-blue outline-none resize-none"
                         />
                       </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Panel: Simulator (Small fixed height on mobile, 33% on desktop) */}
              <div className="h-[300px] lg:h-auto lg:col-span-1 bg-carbon-900 border border-carbon-700 flex flex-col shadow-lg">
                <div className="p-4 border-b border-carbon-700 bg-carbon-800 flex justify-between items-center">
                  <h3 className="font-semibold text-sm flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
                    Simulador
                  </h3>
                  
                  <button 
                    onClick={cycleSimChannel}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                      simChannel === 'WhatsApp' ? 'text-green-400 border-green-900 bg-green-900/20' :
                      simChannel === 'Instagram' ? 'text-purple-400 border-purple-900 bg-purple-900/20' :
                      'text-blue-400 border-blue-900 bg-blue-900/20'
                    }`}
                  >
                    {simChannel}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
                  simChannel === 'WhatsApp' ? 'bg-[#0b141a]' : 
                  simChannel === 'Messenger' ? 'bg-black' : 
                  'bg-carbon-900'
                }`}> 
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 text-sm shadow-md relative ${
                        msg.role === 'user' 
                          ? (simChannel === 'WhatsApp' ? 'bg-[#005c4b] text-white' : 'bg-blue-600 text-white') + ' rounded-bl-lg rounded-tr-lg rounded-tl-lg'
                          : (simChannel === 'WhatsApp' ? 'bg-[#202c33] text-gray-100' : 'bg-carbon-700 text-gray-100') + ' rounded-br-lg rounded-tr-lg rounded-bl-lg'
                      }`}>
                        {msg.text}
                        <span className="text-[9px] opacity-70 block text-right mt-1">10:00</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                     <div className="flex justify-start">
                       <div className="bg-carbon-700 text-carbon-secondary p-2 text-xs rounded-lg animate-pulse">Digitando...</div>
                     </div>
                  )}
                </div>
                <form onSubmit={handleChatSubmit} className="p-3 border-t border-carbon-700 flex gap-2 bg-carbon-800">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Conversar via ${simChannel}...`}
                    disabled={!tempBusiness.agent.isActive}
                    className="flex-1 bg-carbon-700 border border-carbon-600 p-2 text-sm text-white focus:border-carbon-blue rounded-full px-4 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button 
                    type="submit" 
                    disabled={!tempBusiness.agent.isActive}
                    className="bg-carbon-blue p-2 rounded-full hover:bg-carbon-blueHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'connections' && (
            <div className="max-w-6xl mx-auto space-y-6">
               <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Conexões & Integrações</h2>
                  <p className="text-carbon-secondary">Vincule seu agente às principais plataformas de atendimento.</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* WhatsApp Card */}
                 <div className="bg-carbon-800 border border-carbon-700 overflow-hidden">
                    <div className="p-6 border-b border-carbon-700 flex justify-between items-center bg-green-900/10">
                       <div className="flex items-center">
                          <div className="p-2 bg-green-600 rounded-full mr-3">
                             <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                             <h3 className="font-bold text-lg">WhatsApp Business</h3>
                             <p className="text-xs text-green-400">Canal Principal</p>
                          </div>
                       </div>
                       <div className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded uppercase font-bold">Ativo</div>
                    </div>
                    <div className="p-6 space-y-6">
                       <div>
                          <label className="text-xs uppercase text-carbon-secondary block mb-2">Número Vinculado</label>
                          <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={whatsappNumber}
                               onChange={(e) => setWhatsappNumber(e.target.value)}
                               className="flex-1 bg-carbon-900 border border-carbon-600 p-3 text-white focus:border-green-500 outline-none font-mono"
                             />
                             <button className="bg-carbon-700 hover:bg-carbon-600 p-3 border border-carbon-600 text-white">
                                <Edit3 className="w-5 h-5" />
                             </button>
                          </div>
                       </div>

                       <div className="bg-carbon-900 p-4 border border-carbon-700 rounded-sm flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                             <div className="bg-white p-2 rounded">
                                <QrCode className="w-12 h-12 text-black" />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm">QR Code de Atendimento</h4>
                                <p className="text-xs text-carbon-secondary max-w-[200px]">Escaneie para iniciar conversa direta.</p>
                             </div>
                          </div>
                          <button className="text-carbon-blue hover:underline text-sm font-medium">Baixar PNG</button>
                       </div>
                    </div>
                 </div>

                 {/* Instagram & Facebook */}
                 <div className="bg-carbon-800 border border-carbon-700 overflow-hidden">
                    <div className="p-6 border-b border-carbon-700 flex justify-between items-center bg-purple-900/10">
                       <div className="flex items-center">
                          <div className="p-2 bg-gradient-to-tr from-yellow-500 to-purple-600 rounded-full mr-3">
                             <Instagram className="w-5 h-5 text-white" />
                          </div>
                          <div>
                             <h3 className="font-bold text-lg">Instagram & Facebook</h3>
                             <p className="text-xs text-purple-400">Meta Suite</p>
                          </div>
                       </div>
                       <button className="text-xs bg-carbon-700 hover:bg-carbon-600 px-3 py-1.5 rounded text-white transition-colors">Conectar</button>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                       <div className="w-16 h-16 bg-carbon-700 rounded-full flex items-center justify-center mb-2">
                          <Share2 className="w-8 h-8 text-carbon-secondary" />
                       </div>
                       <h4 className="font-bold">Conecte sua Página</h4>
                       <p className="text-sm text-carbon-secondary max-w-xs">
                          Vincule sua conta profissional do Instagram e Página do Facebook para responder DMs e comentários automaticamente.
                       </p>
                       <button className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-2 rounded font-semibold flex items-center">
                          <Facebook className="w-4 h-4 mr-2" />
                          Continuar com Facebook
                       </button>
                    </div>
                 </div>

                 {/* Telegram */}
                 <div className="bg-carbon-800 border border-carbon-700 overflow-hidden">
                    <div className="p-6 border-b border-carbon-700 flex justify-between items-center bg-blue-900/10">
                       <div className="flex items-center">
                          <div className="p-2 bg-blue-500 rounded-full mr-3">
                             <Send className="w-5 h-5 text-white" />
                          </div>
                          <div>
                             <h3 className="font-bold text-lg">Telegram Bot</h3>
                          </div>
                       </div>
                       <div className="px-2 py-1 bg-carbon-700 text-carbon-secondary text-xs rounded uppercase font-bold">Inativo</div>
                    </div>
                    <div className="p-6 space-y-4">
                       <div>
                          <label className="text-xs uppercase text-carbon-secondary block mb-2">Bot Token</label>
                          <input 
                             type="password" 
                             placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                             value={telegramToken}
                             onChange={(e) => setTelegramToken(e.target.value)}
                             className="w-full bg-carbon-900 border border-carbon-600 p-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                          />
                          <p className="text-[10px] text-carbon-secondary mt-1">Obtenha com o @BotFather</p>
                       </div>
                       <button className="w-full bg-carbon-700 hover:bg-carbon-600 text-white py-2 border border-carbon-600 transition-colors">Salvar Token</button>
                    </div>
                 </div>

                 {/* Web Widget */}
                 <div className="bg-carbon-800 border border-carbon-700 overflow-hidden">
                    <div className="p-6 border-b border-carbon-700 flex justify-between items-center bg-carbon-900">
                       <div className="flex items-center">
                          <div className="p-2 bg-carbon-600 rounded-full mr-3">
                             <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                             <h3 className="font-bold text-lg">Web Widget</h3>
                          </div>
                       </div>
                    </div>
                    <div className="p-6 space-y-4">
                       <div className="bg-carbon-900 p-3 border border-carbon-700 rounded font-mono text-xs text-green-400 overflow-x-auto whitespace-nowrap">
                          {`<script src="https://mantra.ai/widget.js?id=${business.id}"></script>`}
                       </div>
                       <button className="flex items-center text-carbon-blue hover:text-white text-sm font-medium transition-colors">
                          <Copy className="w-4 h-4 mr-2" /> Copiar Código
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Economic Stats */}
                <div className="lg:col-span-2 bg-carbon-800 border border-carbon-700 p-6">
                   <h3 className="font-bold text-lg mb-6 flex items-center">
                     <BarChart2 className="w-5 h-5 mr-2 text-carbon-blue" />
                     Performance Financeira
                   </h3>
                   <div className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                         <XAxis dataKey="name" stroke="#525252" fontSize={12} />
                         <YAxis stroke="#525252" fontSize={12} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#262626', borderColor: '#393939', color: '#fff' }}
                            cursor={{fill: '#393939'}}
                         />
                         <Bar dataKey="val" fill="#0f62fe" radius={[4, 4, 0, 0]} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* AI Insight Card */}
                <div className="bg-carbon-800 border border-carbon-700 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      Consultor IA
                    </h3>
                  </div>
                  
                  <div className="flex-1 bg-carbon-900 p-4 border border-carbon-700 rounded-sm text-sm text-gray-300 mb-4 overflow-y-auto max-h-[200px]">
                    {aiAnalysis ? (
                      <div className="whitespace-pre-line">{aiAnalysis}</div>
                    ) : (
                      <div className="text-center py-8 text-carbon-secondary">
                        Clique para gerar uma análise dos seus dados.
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleGenerateAnalysis}
                    disabled={isLoadingAnalysis}
                    className="w-full py-3 bg-carbon-blue hover:bg-carbon-blueHover text-white font-semibold text-sm flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingAnalysis ? 'Analisando...' : 'Analisar Negócio com IA'}
                  </button>
                </div>
              </div>

              {/* Clients CRM */}
              <div className="bg-carbon-800 border border-carbon-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-400" />
                    Gestão de Clientes
                  </h3>
                  <div className="flex space-x-4 text-xs">
                     <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>Comprou</div>
                     <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>Interessado</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-carbon-700 text-carbon-secondary uppercase text-xs">
                        <th className="py-3 font-normal">Nome</th>
                        <th className="py-3 font-normal">Contato</th>
                        <th className="py-3 font-normal">Última Interação</th>
                        <th className="py-3 font-normal text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className="border-b border-carbon-700 hover:bg-carbon-700/50 transition-colors group">
                          <td className="py-3 font-medium">{client.name}</td>
                          <td className="py-3 text-carbon-secondary font-mono text-xs">{client.contact}</td>
                          <td className="py-3 text-carbon-secondary">{client.lastInteraction}</td>
                          <td className="py-3 text-center">
                            <span className={`inline-block w-2 h-2 rounded-full ${client.hasOrdered ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-2.5 transition-colors text-sm font-medium rounded-sm ${
      active ? 'bg-carbon-700 text-white border-l-4 border-carbon-blue' : 'text-carbon-secondary hover:bg-carbon-700 hover:text-white border-l-4 border-transparent'
    }`}
  >
    <div className={active ? 'text-carbon-blue' : ''}>{icon}</div>
    <span>{label}</span>
  </button>
);

const OrderColumn = ({ title, icon, color, orders, onStatusChange, nextStatus }: any) => (
  <div className="flex flex-col h-full max-h-[600px] bg-carbon-800 border border-carbon-700">
    <div className={`p-3 border-t-4 ${color} flex items-center justify-between bg-carbon-700/50 shrink-0`}>
      <div className="flex items-center space-x-2 font-semibold text-sm">
        {icon}
        <span>{title}</span>
      </div>
      <span className="text-xs font-mono bg-carbon-900 px-2 py-0.5 rounded text-gray-300">{orders.length}</span>
    </div>
    <div className="flex-1 p-2 space-y-2 overflow-y-auto bg-carbon-900/30 scrollbar-thin">
      {orders.map((order: Order) => (
        <motion.div 
          key={order.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-carbon-800 p-3 border border-carbon-700 shadow-sm group hover:border-carbon-500 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-sm text-white">{order.customerName}</span>
            <span className="text-[10px] bg-carbon-700 px-1.5 py-0.5 rounded text-carbon-secondary border border-carbon-600">{order.channel}</span>
          </div>
          <div className="space-y-1 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="text-xs text-carbon-secondary flex items-center">
                <span className="w-1 h-1 bg-carbon-blue rounded-full mr-2"></span>
                {item}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-carbon-700">
            <span className="text-xs font-mono font-bold text-carbon-blue">{order.total} AKZ</span>
            {nextStatus && (
              <button 
                onClick={() => onStatusChange(order.id, nextStatus)}
                className="text-[10px] uppercase bg-carbon-700 hover:bg-carbon-600 text-white px-2 py-1 transition-colors border border-carbon-600 rounded-sm"
              >
                Avançar
              </button>
            )}
          </div>
        </motion.div>
      ))}
      {orders.length === 0 && (
        <div className="text-center py-8 text-carbon-600 text-xs">Sem pedidos</div>
      )}
    </div>
  </div>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between border-b border-carbon-700 pb-2">
    <span className="text-sm text-carbon-secondary">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);