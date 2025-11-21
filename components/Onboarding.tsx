import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Check, Store, User, Share2, ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { BusinessProfile, AgentConfig } from '../types';
import { generateBusinessDescription } from '../services/geminiService';

const motion = m as any;

interface OnboardingProps {
  onComplete: (profile: BusinessProfile) => void;
  onCancel: () => void;
}

const steps = [
  { id: 1, title: 'Negócio', icon: Store },
  { id: 2, title: 'Agente AI', icon: User },
  { id: 3, title: 'Conexões', icon: Share2 },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    name: '',
    type: 'Fast Food',
    address: '',
    hours: '09:00 - 22:00',
    agent: {
      name: 'MantraBot',
      tone: 'Amigável',
      permissions: ['Responder Dúvidas', 'Receber Pedidos'],
      additionalInfo: '',
      isActive: true
    },
    socials: {
      whatsapp: false,
      instagram: false,
      messenger: false
    }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFinish = () => {
    const profile = { ...formData, id: `biz_${Date.now()}` } as BusinessProfile;
    onComplete(profile);
  };

  const handleAiGenerateInfo = async () => {
    if (!formData.name || !formData.type) return;
    setIsGenerating(true);
    const desc = await generateBusinessDescription(formData.name, formData.type);
    setFormData(prev => ({
      ...prev,
      agent: { ...prev.agent!, additionalInfo: desc }
    }));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-carbon-900 text-white flex flex-col items-center pt-10 px-4 font-sans">
      {/* Stepper Header */}
      <div className="w-full max-w-3xl mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-carbon-800 -z-0"></div>
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center bg-carbon-900 px-2">
                <div 
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                    isActive || isCompleted ? 'border-carbon-blue bg-carbon-800 text-carbon-blue' : 'border-carbon-700 bg-carbon-800 text-carbon-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                </div>
                <span className={`mt-2 text-xs font-mono uppercase ${isActive ? 'text-white' : 'text-carbon-600'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <motion.div 
        className="w-full max-w-2xl bg-carbon-800 border border-carbon-700 p-8 shadow-xl min-h-[450px] flex flex-col justify-between rounded-sm"
        layout
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <StepBusiness 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}

          {currentStep === 2 && (
            <StepAgent 
              formData={formData} 
              setFormData={setFormData}
              onGenerate={handleAiGenerateInfo}
              isGenerating={isGenerating}
            />
          )}

          {currentStep === 3 && (
            <StepConnections 
              formData={formData} 
              setFormData={setFormData} 
            />
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-carbon-700">
          <button 
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="text-carbon-secondary hover:text-white flex items-center px-4 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          
          <button 
            onClick={currentStep === 3 ? handleFinish : nextStep}
            className="bg-carbon-blue hover:bg-carbon-blueHover text-white px-6 py-2 flex items-center font-semibold transition-colors shadow-md"
          >
            {currentStep === 3 ? 'Criar Agente' : 'Próximo'}
            {currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Sub-components for cleaner organization

const StepBusiness = ({ formData, setFormData }: any) => (
  <motion.div 
    key="step1"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-bold border-l-4 border-carbon-blue pl-4">Sobre o seu Negócio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-xs uppercase text-carbon-secondary">Nome da Empresa</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none transition-colors text-white"
          placeholder="Ex: Burger King Luanda"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase text-carbon-secondary">Tipo</label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none text-white"
        >
          <option>Fast Food</option>
          <option>Restaurante</option>
          <option>Loja de Roupa</option>
          <option>Serviços</option>
          <option>Outro</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs uppercase text-carbon-secondary">Endereço</label>
        <input 
          type="text" 
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none text-white"
          placeholder="Rua, Bairro, Cidade"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs uppercase text-carbon-secondary">Horário de Funcionamento</label>
        <input 
          type="text" 
          value={formData.hours}
          onChange={(e) => setFormData({...formData, hours: e.target.value})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none text-white"
          placeholder="Ex: 09:00 - 22:00"
        />
      </div>
    </div>
  </motion.div>
);

const StepAgent = ({ formData, setFormData, onGenerate, isGenerating }: any) => (
  <motion.div 
    key="step2"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-center border-l-4 border-carbon-blue pl-4">
      <h2 className="text-2xl font-bold">Personalize o Agente</h2>
      <span className="text-xs text-carbon-secondary bg-carbon-700 px-2 py-1 rounded">
        Pode ser alterado depois
      </span>
    </div>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs uppercase text-carbon-secondary">Nome do Agente</label>
        <input 
          type="text" 
          value={formData.agent?.name}
          onChange={(e) => setFormData({...formData, agent: {...formData.agent!, name: e.target.value}})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase text-carbon-secondary">Tom de Voz</label>
        <div className="flex gap-2 flex-wrap">
          {['Casual', 'Formal', 'Divertido', 'Amigável'].map(tone => (
            <button
              key={tone}
              onClick={() => setFormData({...formData, agent: {...formData.agent!, tone: tone as any}})}
              className={`px-4 py-2 text-sm border transition-all ${
                formData.agent?.tone === tone 
                  ? 'bg-carbon-blue border-carbon-blue text-white' 
                  : 'border-carbon-600 text-carbon-secondary hover:border-white hover:text-white'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
           <label className="text-xs uppercase text-carbon-secondary">Informações do Negócio (Menu, Promoções)</label>
           <button 
              onClick={onGenerate}
              disabled={isGenerating || !formData.name}
              className="text-xs flex items-center text-carbon-blue hover:text-white disabled:opacity-50 transition-colors"
           >
             {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
             Gerar com IA
           </button>
        </div>
        <p className="text-[10px] text-carbon-secondary mb-1">
          Escreva os itens essenciais, o resto a IA improvisa.
        </p>
        <textarea 
          value={formData.agent?.additionalInfo}
          onChange={(e) => setFormData({...formData, agent: {...formData.agent!, additionalInfo: e.target.value}})}
          className="w-full bg-carbon-700 p-3 border-b-2 border-transparent focus:border-carbon-blue outline-none h-24 resize-none text-white placeholder-carbon-600"
          placeholder="Ex: Temos hambúrgueres a partir de 1500 AKZ. Entrega grátis no Talatona. Aceitamos Multicaixa."
        />
      </div>
    </div>
  </motion.div>
);

const StepConnections = ({ formData, setFormData }: any) => (
  <motion.div 
    key="step3"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-bold border-l-4 border-carbon-blue pl-4">Conectar Canais</h2>
    <p className="text-carbon-secondary">Selecione os canais onde o agente irá atender automaticamente.</p>

    <div className="space-y-4">
      {[
        { key: 'whatsapp', label: 'WhatsApp Business' },
        { key: 'instagram', label: 'Instagram Direct' },
        { key: 'messenger', label: 'Facebook Messenger' }
      ].map(social => (
        <div key={social.key} className="flex items-center justify-between p-4 bg-carbon-700 border border-carbon-600 hover:border-carbon-500 transition-colors">
          <span className="font-semibold text-white">{social.label}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={(formData.socials as any)[social.key]}
              onChange={(e) => setFormData({
                ...formData, 
                socials: { ...formData.socials!, [social.key]: e.target.checked }
              })}
            />
            <div className="w-11 h-6 bg-carbon-900 border border-carbon-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-carbon-blue peer-checked:border-carbon-blue"></div>
          </label>
        </div>
      ))}
    </div>
  </motion.div>
);