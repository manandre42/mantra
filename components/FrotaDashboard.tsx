import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Users, AlertTriangle, TrendingUp, Search, MoreVertical, LogOut } from 'lucide-react';

interface FrotaDashboardProps {
  onLogout: () => void;
}

const data = [
  { name: 'Fast Food', value: 400 },
  { name: 'Serviços', value: 300 },
  { name: 'Varejo', value: 300 },
  { name: 'Outros', value: 200 },
];

const COLORS = ['#0f62fe', '#8a3ffc', '#42be65', '#6f6f6f'];

const mockBusinesses = [
  { id: 1, name: 'Burger King Luanda', type: 'Fast Food', status: 'Ativo', revenue: '450.000 AKZ' },
  { id: 2, name: 'Geladaria Nice', type: 'Geladaria', status: 'Ativo', revenue: '120.000 AKZ' },
  { id: 3, name: 'Sapataria Silva', type: 'Varejo', status: 'Pendente', revenue: '0 AKZ' },
  { id: 4, name: 'Tech Solutions', type: 'Serviços', status: 'Bloqueado', revenue: '890.000 AKZ' },
];

export const FrotaDashboard: React.FC<FrotaDashboardProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-carbon-900 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 bg-carbon-800 border-b border-carbon-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="font-mono font-bold tracking-widest uppercase text-lg">Frota <span className="text-carbon-blue text-xs align-top">Admin</span></span>
        </div>
        <button onClick={onLogout} className="text-sm text-carbon-secondary hover:text-white flex items-center">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </button>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Negócios" value="1,240" icon={<Users className="text-carbon-blue" />} change="+12% esse mês" />
            <StatCard title="Receita Plataforma" value="12M AKZ" icon={<TrendingUp className="text-green-500" />} change="+5% esse mês" />
            <StatCard title="Alertas Críticos" value="3" icon={<AlertTriangle className="text-red-500" />} change="Integração WhatsApp" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Business Table */}
            <div className="lg:col-span-2 bg-carbon-800 border border-carbon-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Negócios Recentes</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-carbon-secondary" />
                  <input type="text" placeholder="Buscar..." className="bg-carbon-900 text-sm pl-9 pr-4 py-2 border border-carbon-600 focus:border-carbon-blue outline-none w-48" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon-700 text-carbon-secondary uppercase text-xs">
                      <th className="py-3 font-normal">Empresa</th>
                      <th className="py-3 font-normal">Tipo</th>
                      <th className="py-3 font-normal">Status</th>
                      <th className="py-3 font-normal text-right">Faturação</th>
                      <th className="py-3 font-normal"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBusinesses.map((biz) => (
                      <tr key={biz.id} className="border-b border-carbon-700 hover:bg-carbon-700/30 transition-colors group">
                        <td className="py-4 font-medium">{biz.name}</td>
                        <td className="py-4 text-carbon-secondary">{biz.type}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs rounded-sm ${
                            biz.status === 'Ativo' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                            biz.status === 'Pendente' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                            'bg-red-900/30 text-red-400 border border-red-800'
                          }`}>
                            {biz.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-mono">{biz.revenue}</td>
                        <td className="py-4 text-right">
                          <button className="p-1 hover:bg-carbon-600 rounded">
                            <MoreVertical className="w-4 h-4 text-carbon-secondary" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-carbon-800 border border-carbon-700 p-6 flex flex-col">
              <h3 className="font-bold text-lg mb-4">Distribuição por Tipo</h3>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#262626', borderColor: '#393939', color: '#f4f4f4' }}
                      itemStyle={{ color: '#f4f4f4' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                 {data.map((d, i) => (
                   <div key={i} className="flex items-center">
                     <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[i]}}></span>
                     <span className="text-carbon-secondary">{d.name}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, change }: any) => (
  <div className="bg-carbon-800 p-6 border border-carbon-700">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-carbon-900 border border-carbon-700 rounded-sm">{icon}</div>
      <span className="text-xs text-carbon-secondary">{change}</span>
    </div>
    <div className="text-3xl font-bold font-mono text-white mb-1">{value}</div>
    <div className="text-sm text-carbon-secondary">{title}</div>
  </div>
);