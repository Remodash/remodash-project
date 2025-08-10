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
  Plus,
  X,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MoreVertical,
  HardHat,
  UserCheck,
  FileSignature,
  Construction
} from 'lucide-react';

// Types définis pour une meilleure sécurité TypeScript
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'validated' | 'paid' | 'disputed';
type SortDirection = 'asc' | 'desc';

interface Property {
  id: number;
  address: string;
  type: string;
}

interface Document {
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

interface WorkOrder {
  id: number;
  workOrderNumber: string;
  property: Property;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: WorkOrderStatus;
  issueDate: string;
  dueDate: string;
  completionDate?: string;
  paymentDate?: string;
  documents: Document[];
  diagnostics: string[];
  contractorNotes: string;
}

interface Filters {
  year: string;
  status: string;
  sort: string;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  
    const sidebarItems = [
        { icon: Home, label: 'Tableau de Bord', href: '/dashboard/pd' },
        { icon: Hammer, label: 'Diagnostics à Réaliser', href: '/pages/pd/diagnosticsARealiser' },
        { icon: ClipboardCheck, label: 'Historique', href: '/pages/pd/historique' },
        { icon: CreditCard, label: 'Facturation', href: '/pages/pd/facturation' },
        { icon: Settings, label: 'Paramètres', href: '/pages/pd/parametres' }
      ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${
      isExpanded ? 'w-64' : 'w-20'
    } flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-neutral-200 transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}>
          Remodash
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          aria-label={isExpanded ? "Réduire la sidebar" : "Étendre la sidebar"}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href} 
            className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition-all duration-300 ${
              item.label === 'Facturation' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''
            }`}
          >
            <item.icon className="mr-4" aria-hidden="true" />
            <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
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
  onStatusChange: (status: WorkOrderStatus) => void;
}> = ({ workOrder, onClose, onStatusChange }) => {
  const getStatusBadge = (status: WorkOrderStatus) => {
    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      validated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return statusClasses[status];
  };

  const getStatusLabel = (status: WorkOrderStatus) => {
    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      validated: 'Validé',
      paid: 'Payé',
      disputed: 'En litige'
    };
    return labels[status];
  };

  const isOverdue = workOrder.status === 'in_progress' && new Date(workOrder.dueDate) < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Bon de Travail BT-{workOrder.workOrderNumber}</h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Pour le logement {workOrder.property.address}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
              aria-label="Fermer la modal"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Informations</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Référence:</span> BT-{workOrder.workOrderNumber}</p>
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                <p><span className="font-medium">Type logement:</span> {workOrder.property.type}</p>
                <p>
                  <span className="font-medium">Statut:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status)}`}>
                    {getStatusLabel(workOrder.status)}
                    {isOverdue && ' (En retard)'}
                  </span>
                </p>
                {workOrder.contractorNotes && (
                  <div className="mt-2">
                    <p className="font-medium">Notes:</p>
                    <p className="text-sm bg-gray-50 dark:bg-neutral-700 p-2 rounded">{workOrder.contractorNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Dates</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date d'émission:</span> {new Date(workOrder.issueDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Date d'échéance:</span> {new Date(workOrder.dueDate).toLocaleDateString()}</p>
                {workOrder.completionDate && (
                  <p><span className="font-medium">Date de complétion:</span> {new Date(workOrder.completionDate).toLocaleDateString()}</p>
                )}
                {workOrder.paymentDate && (
                  <p><span className="font-medium">Date de paiement:</span> {new Date(workOrder.paymentDate).toLocaleDateString()}</p>
                )}
                {isOverdue && (
                  <p className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                    En retard de {Math.floor((Date.now() - new Date(workOrder.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                )}
              </div>
            </div>
          </div>

          {workOrder.diagnostics.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Diagnostics</h3>
              <div className="flex flex-wrap gap-2">
                {workOrder.diagnostics.map((diag, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-neutral-700 px-3 py-1 rounded-full text-sm">
                    {diag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Montants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">Montant HT</p>
                <p className="text-xl font-bold">{workOrder.amount.toFixed(2)}€</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">TVA (20%)</p>
                <p className="text-xl font-bold">{workOrder.taxAmount.toFixed(2)}€</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total TTC</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{workOrder.totalAmount.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Documents</h3>
            {workOrder.documents.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {workOrder.documents.map((doc, index) => (
                  <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4" aria-hidden="true" />
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
                      aria-label={`Télécharger ${doc.name}`}
                    >
                      Télécharger
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500 dark:text-neutral-400">
                <FileText className="h-10 w-10 mx-auto mb-2" aria-hidden="true" />
                <p>Aucun document joint</p>
              </div>
            )}
          </div>

          <div className="flex justify-between space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex space-x-3">
              {workOrder.status === 'completed' && (
                <button
                  onClick={() => onStatusChange('validated')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <UserCheck className="h-5 w-5 mr-2" aria-hidden="true" />
                  Valider le travail
                </button>
              )}
              {workOrder.status === 'validated' && (
                <button
                  onClick={() => onStatusChange('paid')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Banknote className="h-5 w-5 mr-2" aria-hidden="true" />
                  Marquer comme payé
                </button>
              )}
              {workOrder.status === 'in_progress' && (
                <button
                  onClick={() => onStatusChange('completed')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
                  Marquer comme terminé
                </button>
              )}
              {(workOrder.status === 'pending' || workOrder.status === 'in_progress') && (
                <button
                  onClick={() => onStatusChange('disputed')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <XCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                  Signaler un problème
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Fermer
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                aria-label="Imprimer le bon de travail"
              >
                <Printer className="h-5 w-5 mr-2" aria-hidden="true" />
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<{
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}> = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const years = ['2024', '2023', '2022', '2021'];
  const statuses = [
    { value: '', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'validated', label: 'Validé' },
    { value: 'paid', label: 'Payé' },
    { value: 'disputed', label: 'En litige' }
  ];
  const sortOptions = [
    { value: 'issueDate_desc', label: 'Date (récent)' },
    { value: 'issueDate_asc', label: 'Date (ancien)' },
    { value: 'dueDate_asc', label: 'Échéance (proche)' },
    { value: 'dueDate_desc', label: 'Échéance (lointaine)' },
    { value: 'amount_desc', label: 'Montant (haut)' },
    { value: 'amount_asc', label: 'Montant (bas)' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow mb-6">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" aria-hidden="true" />
          <h3 className="font-medium">Filtres</h3>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium mb-1">Année</label>
            <select
              id="year-filter"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({...prev, year: e.target.value}))}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              <option value="">Toutes</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium mb-1">Statut</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-filter" className="block text-sm font-medium mb-1">Trier par</label>
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value}))}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const ContractorBilling: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    year: '',
    status: '',
    sort: 'issueDate_desc'
  });

  // Données simulées basées sur le cahier des charges
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      workOrderNumber: '2024-001',
      property: {
        id: 101,
        address: '12 Rue des Lilas, 75000 Paris',
        type: 'Appartement'
      },
      amount: 1200.00,
      taxAmount: 240.00,
      totalAmount: 1440.00,
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      completionDate: '2024-02-05',
      paymentDate: '2024-02-10',
      diagnostics: ['DPE', 'Électricité', 'Plomberie'],
      contractorNotes: 'Remplacement complet des mitigeurs et vérification de l\'installation électrique',
      documents: [
        {
          name: 'BT-2024-001.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-01-15'
        },
        {
          name: 'Facture_FAC-2024-001.pdf',
          type: 'Facture',
          url: '#',
          uploadedAt: '2024-02-05'
        },
        {
          name: 'Reçu_paiement_FAC-2024-001.pdf',
          type: 'Reçu',
          url: '#',
          uploadedAt: '2024-02-10'
        }
      ]
    },
    {
      id: 2,
      workOrderNumber: '2024-002',
      property: {
        id: 102,
        address: '25 Avenue des Champs, 69000 Lyon',
        type: 'Maison'
      },
      amount: 850.00,
      taxAmount: 170.00,
      totalAmount: 1020.00,
      status: 'validated',
      issueDate: '2024-02-01',
      dueDate: '2024-03-01',
      completionDate: '2024-02-25',
      diagnostics: ['Plomb', 'Gaz'],
      contractorNotes: 'Vérification des installations gaz et remplacement des joints',
      documents: [
        {
          name: 'BT-2024-002.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-02-01'
        },
        {
          name: 'Facture_FAC-2024-002.pdf',
          type: 'Facture',
          url: '#',
          uploadedAt: '2024-02-25'
        }
      ]
    },
    {
      id: 3,
      workOrderNumber: '2024-003',
      property: {
        id: 103,
        address: '8 Boulevard Maritime, 13000 Marseille',
        type: 'Appartement'
      },
      amount: 1500.00,
      taxAmount: 300.00,
      totalAmount: 1800.00,
      status: 'completed',
      issueDate: '2024-02-10',
      dueDate: '2024-03-10',
      completionDate: '2024-03-05',
      diagnostics: ['Peinture', 'Sols'],
      contractorNotes: 'Reprise complète des peintures et remplacement du sol PVC dans la cuisine',
      documents: [
        {
          name: 'BT-2024-003.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-02-10'
        }
      ]
    },
    {
      id: 4,
      workOrderNumber: '2023-120',
      property: {
        id: 104,
        address: '3 Rue du Commerce, 31000 Toulouse',
        type: 'Bureau'
      },
      amount: 2200.00,
      taxAmount: 440.00,
      totalAmount: 2640.00,
      status: 'paid',
      issueDate: '2023-12-01',
      dueDate: '2023-12-31',
      completionDate: '2023-12-20',
      paymentDate: '2024-01-05',
      diagnostics: ['Amiante', 'Électricité'],
      contractorNotes: 'Désamiantage partiel et remise aux normes électriques',
      documents: [
        {
          name: 'BT-2023-120.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2023-12-01'
        },
        {
          name: 'Facture_FAC-2023-120.pdf',
          type: 'Facture',
          url: '#',
          uploadedAt: '2023-12-20'
        },
        {
          name: 'Reçu_paiement_FAC-2023-120.pdf',
          type: 'Reçu',
          url: '#',
          uploadedAt: '2024-01-05'
        }
      ]
    },
    {
      id: 5,
      workOrderNumber: '2023-121',
      property: {
        id: 105,
        address: '45 Rue Principale, 67000 Strasbourg',
        type: 'Maison'
      },
      amount: 1750.00,
      taxAmount: 350.00,
      totalAmount: 2100.00,
      status: 'disputed',
      issueDate: '2023-12-05',
      dueDate: '2024-01-05',
      diagnostics: ['Humidité', 'Menuiseries'],
      contractorNotes: 'Problème d\'humidité non couvert par le contrat initial',
      documents: [
        {
          name: 'BT-2023-121.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2023-12-05'
        },
        {
          name: 'Reclamation_2023-121.pdf',
          type: 'Réclamation',
          url: '#',
          uploadedAt: '2024-01-10'
        }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleStatusChange = (status: WorkOrderStatus) => {
    if (selectedWorkOrder) {
      const updatedWorkOrder = {
        ...selectedWorkOrder,
        status,
        paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : selectedWorkOrder.paymentDate
      };
      setWorkOrders(prev => 
        prev.map(wo => 
          wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo
        )
      );
      setSelectedWorkOrder(updatedWorkOrder);
    }
  };

  const getDateValue = (item: any, field: string): number => {
    const value = item[field];
    if (!value) return 0;
    const date = new Date(value);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  const sortWorkOrders = (a: WorkOrder, b: WorkOrder): number => {
    const [sortField, sortDirection] = filters.sort.split('_') as [string, SortDirection];
    
    let valueA: number, valueB: number;

    if (sortField === 'issueDate' || sortField === 'dueDate' || sortField === 'completionDate' || sortField === 'paymentDate') {
        valueA = getDateValue(a, sortField);
        valueB = getDateValue(b, sortField);
    } else {
      valueA = a[sortField as keyof WorkOrder] as number;
      valueB = b[sortField as keyof WorkOrder] as number;
    }

    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  };

  const filteredWorkOrders = workOrders
    .filter(workOrder => {
      // Filtre par année
      if (filters.year && !workOrder.issueDate.startsWith(filters.year)) return false;
      
      // Filtre par statut
      if (filters.status && workOrder.status !== filters.status) return false;
      
      // Filtre par recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          `BT-${workOrder.workOrderNumber}`.toLowerCase().includes(term) ||
          workOrder.property.address.toLowerCase().includes(term) ||
          workOrder.property.type.toLowerCase().includes(term) ||
          workOrder.contractorNotes.toLowerCase().includes(term)
        );
      }
      
      return true;
    })
    .sort(sortWorkOrders);

  const getStatusBadge = (status: WorkOrderStatus, dueDate: string) => {
    const isOverdue = status === 'in_progress' && new Date(dueDate) < new Date();
    const currentStatus = isOverdue ? 'disputed' : status;

    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      validated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return statusClasses[currentStatus];
  };

  const getStatusLabel = (status: WorkOrderStatus, dueDate: string) => {
    const isOverdue = status === 'in_progress' && new Date(dueDate) < new Date();
    
    if (isOverdue) return 'En retard';
    
    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      validated: 'Validé',
      paid: 'Payé',
      disputed: 'En litige'
    };
    
    return labels[status];
  };

  const getTotalAmount = (statusFilter?: string) => {
    let filtered = filteredWorkOrders;
    if (statusFilter) {
      filtered = filtered.filter(wo => wo.status === statusFilter);
    }
    return filtered.reduce((sum, wo) => sum + wo.totalAmount, 0);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarExpanded ? 'ml-64' : 'ml-20'
      } p-6 overflow-y-auto`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Facturation</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Consultez et gérez tous vos bons de travail et factures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Total bons de travail</p>
            <p className="text-2xl font-bold">{filteredWorkOrders.length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Montant total</p>
            <p className="text-2xl font-bold">{getTotalAmount().toFixed(2)}€</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Payés</p>
            <p className="text-2xl font-bold">{getTotalAmount('paid').toFixed(2)}€</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">En attente de paiement</p>
            <p className="text-2xl font-bold">{getTotalAmount('validated').toFixed(2)}€</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un bon de travail..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-neutral-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FileSignature className="h-4 w-4 mr-2" />
                Nouvelle facture
              </button>
            </div>
          </div>

          <FilterPanel filters={filters} setFilters={setFilters} />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">
                    <button 
                      className="flex items-center"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sort: prev.sort === 'issueDate_desc' ? 'issueDate_asc' : 'issueDate_desc'
                      }))}
                    >
                      <span>Bon de Travail</span>
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">Adresse</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">
                    <button 
                      className="flex items-center"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sort: prev.sort === 'dueDate_desc' ? 'dueDate_asc' : 'dueDate_desc'
                      }))}
                    >
                      <span>Échéance</span>
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">Statut</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">
                    <button 
                      className="flex items-center"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sort: prev.sort === 'totalAmount_desc' ? 'totalAmount_asc' : 'totalAmount_desc'
                      }))}
                    >
                      <span>Montant</span>
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredWorkOrders.length > 0 ? (
                  filteredWorkOrders.map(workOrder => {
                    const isOverdue = workOrder.status === 'in_progress' && new Date(workOrder.dueDate) < new Date();

                    return (
                      <tr 
                        key={workOrder.id} 
                        className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => setSelectedWorkOrder(workOrder)}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">BT-{workOrder.workOrderNumber}</p>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                              {new Date(workOrder.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="line-clamp-1">{workOrder.property.address}</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">{workOrder.property.type}</p>
                        </td>
                        <td className="py-4 px-4">
                          {new Date(workOrder.dueDate).toLocaleDateString()}
                          {isOverdue && (
                            <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              En retard
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status, workOrder.dueDate)}`}>
                            {getStatusLabel(workOrder.status, workOrder.dueDate)}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">{workOrder.totalAmount.toFixed(2)}€</td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWorkOrder(workOrder);
                            }}
                            aria-label="Voir les détails"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-neutral-400">
                      <FileSearch className="h-10 w-10 mx-auto mb-2" />
                      <p>Aucun bon de travail trouvé</p>
                      <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ContractorBilling;