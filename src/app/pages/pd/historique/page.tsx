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
  Construction,
  History,
  Clock3,
  CalendarCheck,
  Check,
  AlertTriangle
} from 'lucide-react';

// Types définis pour une meilleure sécurité TypeScript
type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'validated' | 'paid' | 'disputed' | 'cancelled';
type WorkOrderType = 'diagnostic' | 'repair' | 'maintenance' | 'cleaning' | 'inspection';
type SortDirection = 'asc' | 'desc';

interface Property {
  id: number;
  address: string;
  type: string;
  building?: string;
  floor?: string;
  doorNumber?: string;
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
  type: WorkOrderType;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: WorkOrderStatus;
  issueDate: string;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  paymentDate?: string;
  diagnostics: string[];
  contractorNotes: string;
  documents: Document[];
  delayReason?: string;
  penalties?: number;
}

interface Filters {
  year: string;
  status: string;
  type: string;
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
              item.label === 'Historique' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''
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
}> = ({ workOrder, onClose }) => {
  const getStatusBadge = (status: WorkOrderStatus) => {
    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      validated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cancelled: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
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
      disputed: 'En litige',
      cancelled: 'Annulé'
    };
    return labels[status];
  };

  const getTypeIcon = (type: WorkOrderType) => {
    const icons = {
      diagnostic: <FileSearch className="h-5 w-5" />,
      repair: <Construction className="h-5 w-5" />,
      maintenance: <HardHat className="h-5 w-5" />,
      cleaning: <CheckCircle2 className="h-5 w-5" />,
      inspection: <ClipboardCheck className="h-5 w-5" />
    };
    return icons[type];
  };

  const getTypeLabel = (type: WorkOrderType) => {
    const labels = {
      diagnostic: 'Diagnostic',
      repair: 'Réparation',
      maintenance: 'Maintenance',
      cleaning: 'Nettoyage',
      inspection: 'Inspection'
    };
    return labels[type];
  };

  const wasDelayed = workOrder.completionDate && new Date(workOrder.completionDate) > new Date(workOrder.dueDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Bon de Travail BT-{workOrder.workOrderNumber}</h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {getTypeLabel(workOrder.type)} - {workOrder.property.address}
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
                <p><span className="font-medium">Type:</span> 
                  <span className="ml-2 inline-flex items-center">
                    {getTypeIcon(workOrder.type)}
                    <span className="ml-1">{getTypeLabel(workOrder.type)}</span>
                  </span>
                </p>
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                {workOrder.property.building && (
                  <p><span className="font-medium">Bâtiment:</span> {workOrder.property.building}</p>
                )}
                {workOrder.property.floor && (
                  <p><span className="font-medium">Étage:</span> {workOrder.property.floor}</p>
                )}
                {workOrder.property.doorNumber && (
                  <p><span className="font-medium">Porte:</span> {workOrder.property.doorNumber}</p>
                )}
                <p>
                  <span className="font-medium">Statut:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status)}`}>
                    {getStatusLabel(workOrder.status)}
                  </span>
                </p>
                {workOrder.contractorNotes && (
                  <div className="mt-2">
                    <p className="font-medium">Notes:</p>
                    <p className="text-sm bg-gray-50 dark:bg-neutral-700 p-2 rounded">{workOrder.contractorNotes}</p>
                  </div>
                )}
                {workOrder.delayReason && (
                  <div className="mt-2">
                    <p className="font-medium flex items-center text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Raison du retard:
                    </p>
                    <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">{workOrder.delayReason}</p>
                  </div>
                )}
                {workOrder.penalties && (
                  <div className="mt-2">
                    <p className="font-medium flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Pénalités appliquées:
                    </p>
                    <p className="text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{workOrder.penalties.toFixed(2)}€</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Dates</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date d'émission:</span> {new Date(workOrder.issueDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Date de début:</span> {new Date(workOrder.startDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Date d'échéance:</span> {new Date(workOrder.dueDate).toLocaleDateString()}</p>
                {workOrder.completionDate && (
                  <p className={wasDelayed ? 'text-red-600 dark:text-red-400' : ''}>
                    <span className="font-medium">Date de complétion:</span> {new Date(workOrder.completionDate).toLocaleDateString()}
                    {wasDelayed && (
                      <span className="ml-2 text-xs flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Retard de {Math.floor((new Date(workOrder.completionDate).getTime() - new Date(workOrder.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    )}
                  </p>
                )}
                {workOrder.paymentDate && (
                  <p><span className="font-medium">Date de paiement:</span> {new Date(workOrder.paymentDate).toLocaleDateString()}</p>
                )}
              </div>

              {workOrder.diagnostics.length > 0 && (
                <div className="mt-4">
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
            </div>
          </div>

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
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {(workOrder.totalAmount - (workOrder.penalties || 0)).toFixed(2)}€
                  {workOrder.penalties && (
                    <span className="text-xs text-red-600 dark:text-red-400 block">
                      (Pénalités: -{workOrder.penalties.toFixed(2)}€)
                    </span>
                  )}
                </p>
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

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
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
    { value: 'completed', label: 'Terminé' },
    { value: 'validated', label: 'Validé' },
    { value: 'paid', label: 'Payé' },
    { value: 'disputed', label: 'En litige' },
    { value: 'cancelled', label: 'Annulé' }
  ];
  const types = [
    { value: '', label: 'Tous' },
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'repair', label: 'Réparation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cleaning', label: 'Nettoyage' },
    { value: 'inspection', label: 'Inspection' }
  ];
  const sortOptions = [
    { value: 'issueDate_desc', label: 'Date (récent)' },
    { value: 'issueDate_asc', label: 'Date (ancien)' },
    { value: 'completionDate_desc', label: 'Complétion (récent)' },
    { value: 'completionDate_asc', label: 'Complétion (ancien)' },
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
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label htmlFor="type-filter" className="block text-sm font-medium mb-1">Type</label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
              className="w-full p-2 border rounded-lg dark:bg-neutral-700"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
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

const ContractorHistory: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    year: '',
    status: '',
    type: '',
    sort: 'completionDate_desc'
  });

  // Données simulées basées sur le cahier des charges
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      workOrderNumber: '2024-001',
      property: {
        id: 101,
        address: '12 Rue des Lilas, 75000 Paris',
        type: 'Appartement',
        building: 'Bâtiment A',
        floor: '2ème étage',
        doorNumber: '203'
      },
      type: 'repair',
      amount: 1200.00,
      taxAmount: 240.00,
      totalAmount: 1440.00,
      status: 'paid',
      issueDate: '2024-01-10',
      startDate: '2024-01-15',
      dueDate: '2024-01-30',
      completionDate: '2024-01-25',
      paymentDate: '2024-02-05',
      diagnostics: ['Plomberie', 'Électricité'],
      contractorNotes: 'Remplacement des mitigeurs et vérification de l\'installation électrique',
      documents: [
        {
          name: 'BT-2024-001.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-01-10'
        },
        {
          name: 'Facture_FAC-2024-001.pdf',
          type: 'Facture',
          url: '#',
          uploadedAt: '2024-01-25'
        },
        {
          name: 'Reçu_paiement_FAC-2024-001.pdf',
          type: 'Reçu',
          url: '#',
          uploadedAt: '2024-02-05'
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
      type: 'diagnostic',
      amount: 450.00,
      taxAmount: 90.00,
      totalAmount: 540.00,
      status: 'paid',
      issueDate: '2024-02-01',
      startDate: '2024-02-05',
      dueDate: '2024-02-10',
      completionDate: '2024-02-08',
      paymentDate: '2024-02-15',
      diagnostics: ['DPE', 'Amiante', 'Plomb'],
      contractorNotes: 'Réalisation des diagnostics obligatoires avant location',
      documents: [
        {
          name: 'BT-2024-002.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-02-01'
        },
        {
          name: 'Rapport_Diagnostics_2024-002.pdf',
          type: 'Rapport',
          url: '#',
          uploadedAt: '2024-02-08'
        },
        {
          name: 'Facture_FAC-2024-002.pdf',
          type: 'Facture',
          url: '#',
          uploadedAt: '2024-02-08'
        }
      ]
    },
    {
      id: 3,
      workOrderNumber: '2024-003',
      property: {
        id: 103,
        address: '8 Boulevard Maritime, 13000 Marseille',
        type: 'Appartement',
        building: 'Résidence Les Flots',
        floor: 'RDC',
        doorNumber: '12'
      },
      type: 'cleaning',
      amount: 300.00,
      taxAmount: 60.00,
      totalAmount: 360.00,
      status: 'paid',
      issueDate: '2024-02-15',
      startDate: '2024-02-20',
      dueDate: '2024-02-22',
      completionDate: '2024-02-21',
      paymentDate: '2024-02-28',
      diagnostics: [],
      contractorNotes: 'Nettoyage complet après départ locataire',
      documents: [
        {
          name: 'BT-2024-003.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2024-02-15'
        },
        {
          name: 'Photos_Avant_Apres_2024-003.zip',
          type: 'Photos',
          url: '#',
          uploadedAt: '2024-02-21'
        }
      ]
    },
    {
      id: 4,
      workOrderNumber: '2023-120',
      property: {
        id: 104,
        address: '3 Rue du Commerce, 31000 Toulouse',
        type: 'Bureau',
        building: 'Immeuble Le Central',
        floor: '3ème étage',
        doorNumber: '305'
      },
      type: 'maintenance',
      amount: 850.00,
      taxAmount: 170.00,
      totalAmount: 1020.00,
      status: 'paid',
      issueDate: '2023-12-01',
      startDate: '2023-12-05',
      dueDate: '2023-12-15',
      completionDate: '2023-12-20',
      paymentDate: '2024-01-05',
      diagnostics: ['VMC', 'Électricité'],
      contractorNotes: 'Maintenance de la VMC et vérification du tableau électrique',
      delayReason: 'Attente de pièces détachées',
      penalties: 50.00,
      documents: [
        {
          name: 'BT-2023-120.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2023-12-01'
        },
        {
          name: 'Rapport_Intervention_2023-120.pdf',
          type: 'Rapport',
          url: '#',
          uploadedAt: '2023-12-20'
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
      type: 'inspection',
      amount: 200.00,
      taxAmount: 40.00,
      totalAmount: 240.00,
      status: 'cancelled',
      issueDate: '2023-12-10',
      startDate: '2023-12-15',
      dueDate: '2023-12-20',
      diagnostics: [],
      contractorNotes: 'Inspection annulée - Logement finalement non libéré',
      documents: [
        {
          name: 'BT-2023-121.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2023-12-10'
        },
        {
          name: 'Annulation_2023-121.pdf',
          type: 'Annulation',
          url: '#',
          uploadedAt: '2023-12-12'
        }
      ]
    },
    {
      id: 6,
      workOrderNumber: '2023-122',
      property: {
        id: 106,
        address: '18 Rue des Jardins, 44000 Nantes',
        type: 'Appartement',
        building: 'Résidence Les Jardins',
        floor: '1er étage',
        doorNumber: '108'
      },
      type: 'repair',
      amount: 1500.00,
      taxAmount: 300.00,
      totalAmount: 1800.00,
      status: 'disputed',
      issueDate: '2023-11-15',
      startDate: '2023-11-20',
      dueDate: '2023-11-30',
      completionDate: '2023-12-05',
      diagnostics: ['Humidité', 'Peinture'],
      delayReason: 'Problème d\'humidité plus important que prévu',
      penalties: 120.00,
      contractorNotes: 'Litige sur l\'étendue des travaux d\'humidité - En attente de validation',
      documents: [
        {
          name: 'BT-2023-122.pdf',
          type: 'Bon de Travail',
          url: '#',
          uploadedAt: '2023-11-15'
        },
        {
          name: 'Rapport_Humidite_2023-122.pdf',
          type: 'Rapport',
          url: '#',
          uploadedAt: '2023-12-05'
        }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
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

    if (sortField.includes('Date')) {
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
      
      // Filtre par type
      if (filters.type && workOrder.type !== filters.type) return false;
      
      // Filtre par recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          `BT-${workOrder.workOrderNumber}`.toLowerCase().includes(term) ||
          workOrder.property.address.toLowerCase().includes(term) ||
          workOrder.property.type.toLowerCase().includes(term) ||
          workOrder.contractorNotes.toLowerCase().includes(term) ||
          workOrder.diagnostics.some(d => d.toLowerCase().includes(term))
        );
      }
      
      return true;
    })
    .sort(sortWorkOrders);

  const getStatusBadge = (status: WorkOrderStatus) => {
    const statusClasses = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      validated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      paid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cancelled: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
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
      disputed: 'En litige',
      cancelled: 'Annulé'
    };
    
    return labels[status];
  };

  const getTypeIcon = (type: WorkOrderType) => {
    const icons = {
      diagnostic: <FileSearch className="h-4 w-4" />,
      repair: <Construction className="h-4 w-4" />,
      maintenance: <HardHat className="h-4 w-4" />,
      cleaning: <CheckCircle2 className="h-4 w-4" />,
      inspection: <ClipboardCheck className="h-4 w-4" />
    };
    return icons[type];
  };

  const getTotalAmount = (statusFilter?: string) => {
    let filtered = filteredWorkOrders;
    if (statusFilter) {
      filtered = filtered.filter(wo => wo.status === statusFilter);
    }
    return filtered.reduce((sum, wo) => sum + wo.totalAmount, 0);
  };

  const getCompletedCount = () => {
    return filteredWorkOrders.filter(wo => wo.status === 'completed' || wo.status === 'validated' || wo.status === 'paid').length;
  };

  const getDelayedCount = () => {
    return filteredWorkOrders.filter(wo => 
      wo.completionDate && new Date(wo.completionDate) > new Date(wo.dueDate)
    ).length;
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
          <h1 className="text-2xl font-bold mb-2">Historique des Travaux</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Consultez l'historique complet de vos interventions et facturations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Total interventions</p>
            <p className="text-2xl font-bold">{filteredWorkOrders.length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Montant total</p>
            <p className="text-2xl font-bold">{getTotalAmount().toFixed(2)}€</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Interventions terminées</p>
            <p className="text-2xl font-bold">{getCompletedCount()}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-neutral-400">Retards</p>
            <p className="text-2xl font-bold">{getDelayedCount()}</p>
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
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">Adresse</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">
                    <button 
                      className="flex items-center"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sort: prev.sort === 'completionDate_desc' ? 'completionDate_asc' : 'completionDate_desc'
                      }))}
                    >
                      <span>Complétion</span>
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">Statut</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-neutral-400">
                    <button 
                      className="flex items-center"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        sort: prev.sort === 'amount_desc' ? 'amount_asc' : 'amount_desc'
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
                    const wasDelayed = workOrder.completionDate && new Date(workOrder.completionDate) > new Date(workOrder.dueDate);

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
                          <span className="inline-flex items-center">
                            {getTypeIcon(workOrder.type)}
                            <span className="ml-1">
                              {workOrder.type === 'diagnostic' ? 'Diag.' : 
                               workOrder.type === 'repair' ? 'Réparation' : 
                               workOrder.type === 'maintenance' ? 'Maint.' : 
                               workOrder.type === 'cleaning' ? 'Nett.' : 'Insp.'}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="line-clamp-1">{workOrder.property.address}</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">{workOrder.property.type}</p>
                        </td>
                        <td className="py-4 px-4">
                          {workOrder.completionDate ? (
                            <div className={wasDelayed ? 'text-red-600 dark:text-red-400' : ''}>
                              {new Date(workOrder.completionDate).toLocaleDateString()}
                              {wasDelayed && (
                                <span className="ml-1 text-xs flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Retard
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-neutral-500">Non terminé</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status)}`}>
                            {getStatusLabel(workOrder.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {workOrder.totalAmount.toFixed(2)}€
                          {workOrder.penalties && (
                            <span className="block text-xs text-red-600 dark:text-red-400">
                              -{workOrder.penalties.toFixed(2)}€
                            </span>
                          )}
                        </td>
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
                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-neutral-400">
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
        />
      )}
    </div>
  );
};

export default ContractorHistory;