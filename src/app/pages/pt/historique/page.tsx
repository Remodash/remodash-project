'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  Hammer,
  ClipboardCheck,
  FileText,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileSearch,
  Filter,
  Search,
  Download,
  Printer,
  HardHat,
  Wrench,
  Paintbrush,
  Plug,
  Droplet,
  DoorOpen,
  Lock,
  Fan,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  FileImage,
  Camera,
  FileDigit,
  FileArchive,
  File,
  CalendarCheck
} from 'lucide-react';


interface WorkOrder {
  id: number;
  workOrderId: number;
  property: {
    address: string;
    type: string;
    surface: number;
  };
  workType: string;
  status: 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  technician: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  documents: {
    name: string;
    type: 'photo' | 'report' | 'invoice' | 'other';
    url: string;
    uploadedAt: string;
  }[];
  notes?: string;
  tasks: {
    id: number;
    description: string;
    status: 'done' | 'cancelled';
  }[];
  penalties?: {
    amount: number;
    reason: string;
    status: 'applied' | 'disputed' | 'waived';
  }[];
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/contractor' },
    { icon: Hammer, label: 'Travaux à Réaliser', href: '/dashboard/contractor/work-orders' },
    { icon: ClipboardCheck, label: 'Historique', href: '/dashboard/contractor/history' },
    { icon: CreditCard, label: 'Facturation', href: '/dashboard/contractor/billing' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/contractor/settings' }
  ];

  return (
    <div className={`
      fixed left-0 top-0 h-full 
      bg-white dark:bg-neutral-900 
      border-r border-gray-200 dark:border-neutral-800 
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-64' : 'w-20'}
      flex flex-col
      z-50
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`
          font-bold text-xl text-gray-800 dark:text-neutral-200 
          transition-opacity duration-300
          ${isExpanded ? 'opacity-100' : 'opacity-0'}
        `}>
          Remodash
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href} 
            className={`
              flex items-center p-4 
              hover:bg-gray-100 dark:hover:bg-neutral-800
              text-gray-700 dark:text-neutral-300
              transition-all duration-300
              ${item.label === 'Historique' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
            `}
          >
            <item.icon className="mr-4" />
            <span 
              className={`
                transition-opacity duration-300
                ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}
              `}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const WorkOrderDetailsModal: React.FC<{
  workOrder: WorkOrder;
  onClose: () => void;
}> = ({ workOrder, onClose }) => {
  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      case 'invoice': return <FileDigit className="h-4 w-4" />;
      case 'other': return <FileArchive className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getTaskIcon = (type: string) => {
    if (type.includes('électricité')) return <Plug className="h-4 w-4" />;
    if (type.includes('plomberie')) return <Droplet className="h-4 w-4" />;
    if (type.includes('peinture')) return <Paintbrush className="h-4 w-4" />;
    if (type.includes('menuiserie')) return <DoorOpen className="h-4 w-4" />;
    if (type.includes('serrurerie')) return <Lock className="h-4 w-4" />;
    if (type.includes('VMC')) return <Fan className="h-4 w-4" />;
    if (type.includes('nettoyage')) return <Sparkles className="h-4 w-4" />;
    return <Wrench className="h-4 w-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Bon de Travail #{workOrder.workOrderId}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <X />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Informations du logement</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Référence:</span> BT-{workOrder.workOrderId}</p>
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                <p><span className="font-medium">Type:</span> {workOrder.property.type} ({workOrder.property.surface}m²)</p>
                <p><span className="font-medium">Type de travaux:</span> {workOrder.workType}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Statut et dates</h3>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Statut:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  workOrder.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {workOrder.status === 'completed' ? 'Terminé' : 'Annulé'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Date de début: {new Date(workOrder.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  <span>Date de fin: {new Date(workOrder.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Description des travaux</h3>
            <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              {workOrder.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Coûts</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Coût estimé</label>
                  <div className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg">
                    {workOrder.estimatedCost}€
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût réel</label>
                  <div className={`p-2 rounded-lg ${
                    workOrder.actualCost > workOrder.estimatedCost ? 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  }`}>
                    {workOrder.actualCost}€
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Tâches réalisées</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {workOrder.tasks.map((task) => (
                  <div key={task.id} className="flex items-center p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <div className={`p-1 rounded-full mr-2 ${
                      task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {task.status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 flex items-center">
                      {getTaskIcon(task.description)}
                      <span className="ml-2">{task.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {workOrder.penalties && workOrder.penalties.length > 0 && (
            <div className="mb-6 border border-red-200 dark:border-red-900 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <h3 className="font-medium text-lg mb-2 text-red-800 dark:text-red-200 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Pénalités
              </h3>
              <div className="space-y-3">
                {workOrder.penalties.map((penalty, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-neutral-700 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Montant: {penalty.amount}€ HT</span>
                      <span className={`text-sm ${
                        penalty.status === 'applied' ? 'text-red-600 dark:text-red-400' :
                        penalty.status === 'disputed' ? 'text-blue-600 dark:text-blue-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {penalty.status === 'applied' ? 'Appliquée' : 
                         penalty.status === 'disputed' ? 'Contestée' : 'Annulée'}
                      </span>
                    </div>
                    <p className="text-sm mt-1">Raison: {penalty.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Documents joints</h3>
            </div>
            
            {workOrder.documents.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {workOrder.documents.map((doc, index) => (
                  <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <div className="ml-2">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {new Date(doc.uploadedAt).toLocaleDateString()} - {doc.type}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Voir
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500 dark:text-neutral-400">
                <FileImage className="h-10 w-10 mx-auto mb-2" />
                <p>Aucun document joint</p>
              </div>
            )}
          </div>

          {workOrder.notes && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Notes complémentaires</h3>
              <div className="p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                {workOrder.notes}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Printer className="h-5 w-5 mr-2" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<{
  filters: {
    year: string;
    workType: string;
    status: string;
  };
  setFilters: (filters: any) => void;
  workTypes: string[];
}> = ({ filters, setFilters, workTypes }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const years = ['2024', '2023', '2022', '2021'];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow mb-6">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Filtres</h3>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Année</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              <option value="">Toutes</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type de travaux</label>
            <select
              value={filters.workType}
              onChange={(e) => setFilters({...filters, workType: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              <option value="">Tous</option>
              {workTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              <option value="">Tous</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ContractorHistory() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    workType: '',
    status: ''
  });

  // Données simulées
  const [workOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      workOrderId: 2042,
      property: {
        address: '12 Rue de la Paix, 75002 Paris',
        type: 'T2',
        surface: 45
      },
      workType: 'Remise en état',
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      technician: 'Équipe A',
      description: 'Remise en état complète après départ locataire',
      estimatedCost: 1250,
      actualCost: 1200,
      documents: [
        {
          name: 'Rapport final.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2024-01-20'
        },
        {
          name: 'Facture travaux.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: '2024-01-21'
        }
      ],
      tasks: [
        { id: 1, description: 'Peinture des murs', status: 'done' },
        { id: 2, description: 'Remplacement robinetterie cuisine', status: 'done' },
        { id: 3, description: 'Réparation parquet salon', status: 'done' },
        { id: 4, description: 'Nettoyage complet', status: 'done' }
      ]
    },
    {
      id: 2,
      workOrderId: 2043,
      property: {
        address: '24 Avenue des Champs, 75008 Paris',
        type: 'T3',
        surface: 72
      },
      workType: 'Plomberie',
      status: 'completed',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      technician: 'Équipe B',
      description: 'Réparation fuite chaudière et remplacement tuyauterie',
      estimatedCost: 850,
      actualCost: 920,
      documents: [
        {
          name: 'Devis plomberie.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2024-02-09'
        },
        {
          name: 'Facture plomberie.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: '2024-02-16'
        }
      ],
      tasks: [
        { id: 1, description: 'Diagnostic fuite chaudière', status: 'done' },
        { id: 2, description: 'Remplacement joint chaudière', status: 'done' },
        { id: 3, description: 'Remplacement tuyauterie salle de bain', status: 'done' },
        { id: 4, description: 'Test pression', status: 'done' }
      ],
      penalties: [
        {
          amount: 150,
          reason: 'Retard de 3 jours sur le planning',
          status: 'applied'
        }
      ]
    },
    {
      id: 3,
      workOrderId: 2041,
      property: {
        address: '5 Boulevard Haussmann, 75009 Paris',
        type: 'Studio',
        surface: 28
      },
      workType: 'Électricité',
      status: 'completed',
      startDate: '2023-11-05',
      endDate: '2023-11-08',
      technician: 'Équipe C',
      description: 'Mise aux normes électriques',
      estimatedCost: 620,
      actualCost: 580,
      documents: [
        {
          name: 'Rapport électrique.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2023-11-08'
        },
        {
          name: 'Facture électricité.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: '2023-11-10'
        }
      ],
      tasks: [
        { id: 1, description: 'Vérification tableau électrique', status: 'done' },
        { id: 2, description: 'Remplacement prises défectueuses', status: 'done' },
        { id: 3, description: 'Installation disjoncteurs différentiels', status: 'done' },
        { id: 4, description: 'Test sécurité', status: 'done' }
      ]
    },
    {
      id: 4,
      workOrderId: 2039,
      property: {
        address: '8 Rue de Rivoli, 75004 Paris',
        type: 'T4',
        surface: 85
      },
      workType: 'Gros œuvre',
      status: 'cancelled',
      startDate: '2023-09-01',
      endDate: '2023-09-01',
      technician: 'Équipe D',
      description: 'Réfection complète après sinistre eau - Annulé par le client',
      estimatedCost: 3500,
      actualCost: 0,
      documents: [
        {
          name: 'Note d\'annulation.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2023-09-02'
        }
      ],
      tasks: [
        { id: 1, description: 'Démolition cloisons endommagées', status: 'cancelled' },
        { id: 2, description: 'Assèchement et traitement anti-humidité', status: 'cancelled' }
      ]
    },
    {
      id: 5,
      workOrderId: 2038,
      property: {
        address: '15 Rue de la Pompe, 75016 Paris',
        type: 'T3',
        surface: 65
      },
      workType: 'Peinture',
      status: 'completed',
      startDate: '2023-08-10',
      endDate: '2023-08-12',
      technician: 'Équipe A',
      description: 'Peinture complète de l\'appartement',
      estimatedCost: 780,
      actualCost: 750,
      documents: [
        {
          name: 'Devis peinture.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2023-08-09'
        },
        {
          name: 'Facture peinture.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: '2023-08-13'
        }
      ],
      tasks: [
        { id: 1, description: 'Préparation des surfaces', status: 'done' },
        { id: 2, description: 'Peinture plafonds', status: 'done' },
        { id: 3, description: 'Peinture murs', status: 'done' },
        { id: 4, description: 'Nettoyage final', status: 'done' }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const getWorkTypeIcon = (type: string) => {
    if (type.includes('électricité')) return <Plug className="h-5 w-5" />;
    if (type.includes('plomberie')) return <Droplet className="h-5 w-5" />;
    if (type.includes('peinture')) return <Paintbrush className="h-5 w-5" />;
    if (type.includes('Gros œuvre')) return <HardHat className="h-5 w-5" />;
    return <Wrench className="h-5 w-5" />;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Filtre par année
    if (filters.year && !workOrder.endDate.startsWith(filters.year)) return false;
    
    // Filtre par type de travaux
    if (filters.workType && workOrder.workType !== filters.workType) return false;
    
    // Filtre par statut
    if (filters.status && workOrder.status !== filters.status) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workOrder.property.address.toLowerCase().includes(term) ||
        workOrder.workType.toLowerCase().includes(term) ||
        workOrder.technician.toLowerCase().includes(term) ||
        workOrder.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const workTypes = [...new Set(workOrders.map(wo => wo.workType))];
  const totalRevenue = filteredWorkOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className={`
        flex-1 transition-all duration-300 
        ${isSidebarExpanded ? 'ml-64' : 'ml-20'}
        p-6 overflow-y-auto
      `}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-1xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <ClipboardCheck className="h-8 w-8 mr-3" />
            Historique des travaux
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          workTypes={workTypes} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Total travaux</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {filteredWorkOrders.length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {filteredWorkOrders.length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              {filters.year || 'Toutes années'} confondues
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Chiffre d&apos;affaires</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {filteredWorkOrders.filter(wo => wo.status === 'completed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {totalRevenue}€
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Travaux terminés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Documents</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {filteredWorkOrders.reduce((acc, wo) => acc + wo.documents.length, 0)}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {filteredWorkOrders.reduce((acc, wo) => acc + wo.documents.length, 0)}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Factures et rapports
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
            <h3 className="font-medium">Liste des travaux</h3>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </button>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredWorkOrders.length > 0 ? (
                filteredWorkOrders.map(workOrder => (
                  <tr 
                    key={workOrder.id} 
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-4 py-3 font-medium">BT-{workOrder.workOrderId}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {workOrder.property.type} - {workOrder.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getWorkTypeIcon(workOrder.workType)}
                        <span className="ml-2">{workOrder.workType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{new Date(workOrder.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        au {new Date(workOrder.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status)}`}>
                        {getStatusLabel(workOrder.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.estimatedCost}€</div>
                      <div className={`text-xs ${
                        workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {workOrder.actualCost}€ réel
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedWorkOrder(workOrder)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <FileSearch className="h-4 w-4 mr-1" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun bon de travail trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de détails */}
      {selectedWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
        />
      )}
    </div>
  );
}