
export enum OrderStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em execução',
  READY = 'Pronto',
  DELIVERED = 'Entregue',
}

export enum UserRole {
  GUEST = 'guest',
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
  type: 'delivery' | 'pickup';
  channel: 'WhatsApp' | 'Instagram' | 'Web';
}

export interface AgentConfig {
  name: string;
  tone: 'Casual' | 'Formal' | 'Divertido' | 'Amigável';
  permissions: string[];
  additionalInfo: string;
  isActive: boolean;
}

export interface BusinessProfile {
  id: string;
  name: string;
  type: string;
  address: string;
  hours: string;
  agent: AgentConfig;
  socials: {
    whatsapp: boolean;
    instagram: boolean;
    messenger: boolean;
  };
}

export interface AppState {
  view: 'login' | 'onboarding' | 'mantra' | 'frota';
  currentUser: BusinessProfile | null;
  role: UserRole;
}
