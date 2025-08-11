'use client';

import React, { useState, JSX } from 'react';
import Link from 'next/link';
import { 
  Home, Hammer, ClipboardCheck, CreditCard, Settings,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle2,
  Clock, FileSearch, ClipboardList,
  Plug, Droplet, Paintbrush, DoorOpen, Lock,
  Fan, Sparkles, HardHat, Wrench, X
} from 'lucide-react';

// Types principaux
interface Property {
  address: string;
  type: string;
  surface: number;
}

interface Document {
  name: string;
  type: 'photo' | 'report' | 'invoice' | 'other';
  url: string;
  uploadedAt: string;
}

interface Task {
  id: number;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  materials?: string[];
}

interface Penalty {
  amount: number;
  reason: string;
  status: 'pending' | 'applied' | 'disputed' | 'waived';
}

interface WorkOrder {
  id: number;
  workOrderId: number;
  property: Property;
  workType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  documents: Document[];
  notes?: string;
  tasks: Task[];
  penalties?: Penalty[];
}

// Props des composants
interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

interface WorkOrderCardProps {
  workOrder: Omit<WorkOrder, 'documents' | 'penalties' | 'description' | 'notes'>;
  onClick: () => void;
}

interface WorkOrderDetailsModalProps {
  workOrder: WorkOrder;
  onClose: () => void;
  onUpdate: (workOrder: WorkOrder) => void;
}

// Composants
const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/contractor' },
    { icon: Hammer, label: 'Bons de Travail', href: '/dashboard/contractor/work-orders' },
    { icon: ClipboardCheck, label: 'Réceptions', href: '/dashboard/contractor/receptions' },
    { icon: CreditCard, label: 'Facturation', href: '/dashboard/contractor/billing' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/contractor/settings' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-neutral-200 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Remodash PT
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          aria-label={isExpanded ? "Réduire le menu" : "Étendre le menu"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link 
              key={index} 
              href={item.href} 
              className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition-all duration-300 ${item.label === 'Tableau de Bord' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}`}
            >
              <Icon className="mr-4" />
              <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onClick }) => {
  const getStatusBadge = (status: WorkOrder['status']): string => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getWorkTypeIcon = (type: string): JSX.Element => {
    if (type.includes('électricité')) return <Plug className="h-5 w-5" />;
    if (type.includes('plomberie')) return <Droplet className="h-5 w-5" />;
    if (type.includes('peinture')) return <Paintbrush className="h-5 w-5" />;
    if (type.includes('menuiserie')) return <DoorOpen className="h-5 w-5" />;
    if (type.includes('serrurerie')) return <Lock className="h-5 w-5" />;
    if (type.includes('VMC')) return <Fan className="h-5 w-5" />;
    if (type.includes('nettoyage')) return <Sparkles className="h-5 w-5" />;
    if (type.includes('Gros œuvre')) return <HardHat className="h-5 w-5" />;
    return <Wrench className="h-5 w-5" />;
  };

  const getProgress = (tasks: Task[]): number => {
    const total = tasks.length;
    if (total === 0) return 0;
    const done = tasks.filter(t => t.status === 'done').length;
    return Math.round((done / total) * 100);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center">
            {getWorkTypeIcon(workOrder.workType)}
            <span className="ml-2">BT-{workOrder.workOrderId}</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            {workOrder.property.address}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          getStatusBadge(workOrder.status)
        }`}>
          {workOrder.status === 'pending' ? 'En attente' : 
           workOrder.status === 'in_progress' ? 'En cours' : 
           workOrder.status === 'completed' ? 'Terminé' : 'Annulé'}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Avancement</span>
          <span>{getProgress(workOrder.tasks)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${getProgress(workOrder.tasks)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-medium">
          {workOrder.estimatedCost}€
          {workOrder.actualCost && (
            <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">
              (réel: {workOrder.actualCost}€)
            </span>
          )}
        </span>
        <span className="text-xs text-gray-500 dark:text-neutral-400">
          {new Date(workOrder.startDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({ 
  workOrder, 
  onClose, 
  onUpdate 
}) => {
  const [description] = useState(workOrder.description);
  const [actualCost] = useState(workOrder.actualCost || 0);
  const [tasks] = useState(workOrder.tasks);
  const [notes] = useState(workOrder.notes || '');

  const handleSubmit = () => {
    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      description,
      actualCost,
      tasks,
      notes
    };
    onUpdate(updatedWorkOrder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Détails du Bon de Travail</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <X />
            </button>
          </div>
          
          {/* Contenu du modal */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-1">{workOrder.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="mt-1">{workOrder.property.address}</p>
              </div>
              <div>
                <h3 className="font-medium">Type</h3>
                <p className="mt-1">{workOrder.property.type} ({workOrder.property.surface}m²)</p>
              </div>
            </div>
            
            {/* Ajouter plus de détails selon les besoins */}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Données simulées
const mockWorkOrders: WorkOrder[] = [
  {
    id: 1,
    workOrderId: 1001,
    property: {
      address: "12 Rue de la Paix, Paris",
      type: "T2",
      surface: 45
    },
    workType: "Remise en état",
    status: "pending",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Remise en état complète après départ locataire",
    estimatedCost: 1250,
    documents: [],
    tasks: [
      { id: 1, description: "Peinture des murs", status: "todo" },
      { id: 2, description: "Remplacement robinetterie", status: "todo" }
    ]
  },
  // Ajouter d'autres exemples selon les besoins
];

const ContractorDashboard: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const filteredWorkOrders = workOrders.filter(workOrder => {
    if (filter !== 'all' && workOrder.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workOrder.property.address.toLowerCase().includes(term) ||
        workOrder.workType.toLowerCase().includes(term) ||
        `BT-${workOrder.workOrderId}`.includes(term)
      );
    }
    return true;
  });

  const handleUpdateWorkOrder = (updatedOrder: WorkOrder) => {
    setWorkOrders(prev => 
      prev.map(item => item.id === updatedOrder.id ? updatedOrder : item)
    );
    setSelectedWorkOrder(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <Hammer className="h-8 w-8 mr-3" />
            Tableau de Bord - Prestataire des travaux
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FileSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Statistiques */}
          {[
            { status: 'pending', label: 'En attente', icon: AlertCircle, color: 'yellow' },
            { status: 'in_progress', label: 'En cours', icon: Clock, color: 'blue' },
            { status: 'completed', label: 'Terminés', icon: CheckCircle2, color: 'green' },
            { label: 'Total', icon: ClipboardList, color: 'gray' }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">{item.label}</h3>
                <span className={`bg-${item.color}-100 text-${item.color}-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-${item.color}-900 dark:text-${item.color}-200`}>
                  {item.status 
                    ? workOrders.filter(d => d.status === item.status).length 
                    : workOrders.length}
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {item.status
                  ? workOrders.filter(d => d.status === item.status).length
                  : workOrders.length}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
          {[
            { value: 'pending', label: 'En attente', icon: AlertCircle },
            { value: 'in_progress', label: 'En cours', icon: Clock },
            { value: 'completed', label: 'Terminés', icon: CheckCircle2 },
            { value: 'all', label: 'Tous', icon: ClipboardList }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                filter === item.value
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300'
              }`}
            >
              <item.icon className="h-4 w-4 mr-1" />
              {item.label}
            </button>
          ))}
        </div>

        {filteredWorkOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkOrders.map(workOrder => (
              <WorkOrderCard 
                key={workOrder.id} 
                workOrder={workOrder} 
                onClick={() => setSelectedWorkOrder(workOrder)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-8 text-center">
            <FileSearch className="h-10 w-10 mx-auto text-gray-400 dark:text-neutral-600" />
            <h3 className="mt-2 text-lg font-medium">Aucun bon de travail trouvé</h3>
            <p className="mt-1 text-gray-500 dark:text-neutral-400">
              {filter === 'all' 
                ? "Vous n&apos;avez aucun bon de travail" 
                : `Vous n&apos;avez aucun bon de travail ${filter === 'pending' ? 'en attente' : filter === 'in_progress' ? 'en cours' : 'terminé'}`}
            </p>
          </div>
        )}
      </main>

      {selectedWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onUpdate={handleUpdateWorkOrder}
        />
      )}
    </div>
  );
};

export default ContractorDashboard;