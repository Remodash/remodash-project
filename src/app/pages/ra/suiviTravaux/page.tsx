'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  FileText,
  ClipboardCheck,
  Hammer,
  Building,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  FileSearch,
  AlertTriangle,
  Info,
  FileSignature,
  ClipboardList,
  Thermometer,
  ShieldAlert,
  Zap,
  Droplets,
  Bug,
  Flame,
  Factory,
  ScanEye,
  CalendarCheck,
  HardHat,
  Construction,
  Check,
  X,
  AlertOctagon,
  CircleDashed,
  Percent,
  FileSpreadsheet,
  MapPin,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types basés sur le cahier des charges
interface WorkOrder {
  id: number;
  property: {
    address: string;
    type: string;
    surface: number;
  };
  contractor: {
    name: string;
    rating: number;
    specialty: string;
  };
  workType: string;
  estimatedCost: number;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  progress: number;
  tasks: {
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    photos?: string[];
  }[];
  dailyReports?: {
    date: string;
    progress: number;
    notes: string;
    photos: string[];
  }[];
  penalties?: {
    amount: number;
    reason: string;
    status: 'pending' | 'applied' | 'waived';
  }[];
  forceMajeure?: {
    declared: boolean;
    reason?: string;
    approved?: boolean;
  };
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  
  
  const sidebarItems = [
  { icon: Home, label: 'Tableau de Bord', href: '/dashboard/ra' },
  { icon: FileText, label: 'Approbations Diagnostics', href: '/pages/ra/approbationsDiagnostics' },
  { icon: ClipboardCheck, label: 'Validation Bons Travaux', href: '/pages/ra/validationBonsTravaux' },
  { icon: Hammer, label: 'Suivi Travaux', href: '/pages/ra/suiviTravaux' },
  { icon: Building, label: 'Parc Immobilier', href: '/pages/ra/parcImmobilier' },
  { icon: Users, label: 'Locataires', href: '/pages/ra/locataires' },
  { icon: CreditCard, label: 'Indicateurs Financiers', href: '/pages/ra/indicateursFinanciers' },
  { icon: Settings, label: 'Paramètres Agence', href: '/pages/ra/parametresAgence' }
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
          Remodash RA
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
              ${item.label === 'Suivi Travaux' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const WorkOrderDetailModal: React.FC<{
  workOrder: WorkOrder;
  onClose: () => void;
  onApproveCompletion: () => void;
  onReportIssue: () => void;
}> = ({ workOrder, onClose, onApproveCompletion, onReportIssue }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <CircleDashed className="h-4 w-4 text-yellow-500" />;
      case 'in_progress': return <Construction className="h-4 w-4 text-blue-500" />;
      case 'completed': return <Check className="h-4 w-4 text-green-500" />;
      case 'delayed': return <AlertOctagon className="h-4 w-4 text-orange-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <CircleDashed className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <HardHat className="h-8 w-8 mr-2" />
              Bon de Travaux #{workOrder.id.toString().padStart(4, '0')}
              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                {workOrder.status === 'pending' ? 'En attente' : 
                 workOrder.status === 'in_progress' ? 'En cours' : 
                 workOrder.status === 'completed' ? 'Terminé' : 
                 workOrder.status === 'delayed' ? 'En retard' : 'Annulé'}
              </span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <XCircle />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Logement concerné
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                <p><span className="font-medium">Type:</span> {workOrder.property.type} ({workOrder.property.surface}m²)</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Prestataire
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Entreprise:</span> {workOrder.contractor.name}</p>
                <p><span className="font-medium">Spécialité:</span> {workOrder.contractor.specialty}</p>
                <p>
                  <span className="font-medium">Note:</span> 
                  <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">
                    {'★'.repeat(workOrder.contractor.rating)}{'☆'.repeat(5 - workOrder.contractor.rating)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendrier
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date de début:</span> {workOrder.startDate}</p>
                <p><span className="font-medium">Date de fin estimée:</span> {workOrder.estimatedEndDate}</p>
                {workOrder.actualEndDate && (
                  <p><span className="font-medium">Date de fin réelle:</span> {workOrder.actualEndDate}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Avancement
              </h3>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${workOrder.progress}%` }}
                  ></div>
                </div>
                <p className="text-center">{workOrder.progress}% complété</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('details')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Détails des travaux
              </h3>
              {expandedSection === 'details' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'details' && (
              <div className="mt-3 p-3 border rounded-lg">
                <p className="font-medium">Type de travaux:</p>
                <p className="mb-3">{workOrder.workType}</p>
                
                <p className="font-medium">Coût estimé:</p>
                <p className="mb-3">{workOrder.estimatedCost} €</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('tasks')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Tâches ({workOrder.tasks.length})
              </h3>
              {expandedSection === 'tasks' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'tasks' && (
              <div className="mt-3 space-y-3">
                {workOrder.tasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.description}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                        </span>
                      </div>
                      {task.photos && task.photos.length > 0 && (
                        <span className="text-xs text-gray-500 dark:text-neutral-400">
                          {task.photos.length} photo(s)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {workOrder.dailyReports && workOrder.dailyReports.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('reports')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Rapports journaliers ({workOrder.dailyReports.length})
                </h3>
                {expandedSection === 'reports' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'reports' && (
                <div className="mt-3 space-y-4">
                  {workOrder.dailyReports.map((report, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{report.date}</p>
                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                          {report.progress}% d'avancement
                        </span>
                      </div>
                      <p className="mb-2">{report.notes}</p>
                      {report.photos.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {report.photos.length} photo(s) jointes
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {workOrder.penalties && workOrder.penalties.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('penalties')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Pénalités ({workOrder.penalties.length})
                </h3>
                {expandedSection === 'penalties' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'penalties' && (
                <div className="mt-3 space-y-3">
                  {workOrder.penalties.map((penalty, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{penalty.amount} €</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          penalty.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          penalty.status === 'applied' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {penalty.status === 'pending' ? 'En attente' : 
                           penalty.status === 'applied' ? 'Appliquée' : 'Annulée'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">{penalty.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {workOrder.forceMajeure && workOrder.forceMajeure.declared && (
            <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <AlertOctagon className="h-5 w-5 mr-2" />
                Cas de force majeure déclaré
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Raison:</span> {workOrder.forceMajeure.reason}</p>
                <p>
                  <span className="font-medium">Statut:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    workOrder.forceMajeure.approved === undefined ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    workOrder.forceMajeure.approved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {workOrder.forceMajeure.approved === undefined ? 'En attente de validation' : 
                     workOrder.forceMajeure.approved ? 'Approuvé' : 'Rejeté'}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onReportIssue}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Signaler un problème
            </button>
            {workOrder.status === 'in_progress' && (
              <button
                onClick={onApproveCompletion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Check className="h-5 w-5 mr-2" />
                Valider la complétion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorkTrackingPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'delayed'>('in_progress');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées basées sur le cahier des charges
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      property: {
        address: "Résidence Lumière, Apt 305",
        type: "T2",
        surface: 45
      },
      contractor: {
        name: "BTP Excellence",
        rating: 4,
        specialty: "Plomberie & Électricité"
      },
      workType: "Remise en état après départ locataire",
      estimatedCost: 1250,
      startDate: "2024-08-01",
      estimatedEndDate: "2024-08-15",
      status: "in_progress",
      progress: 65,
      tasks: [
        {
          description: "Remplacement mitigeurs salle de bain",
          status: "done",
          photos: ["photo1.jpg"]
        },
        {
          description: "Réparation prise électrique salon",
          status: "done",
          photos: ["photo2.jpg"]
        },
        {
          description: "Peinture murale chambre",
          status: "in_progress",
          photos: []
        },
        {
          description: "Nettoyage complet",
          status: "todo"
        }
      ],
      dailyReports: [
        {
          date: "2024-08-05",
          progress: 40,
          notes: "Plomberie terminée, électricité en cours",
          photos: ["photo1.jpg", "photo2.jpg"]
        },
        {
          date: "2024-08-08",
          progress: 65,
          notes: "Électricité terminée, début peinture",
          photos: ["photo3.jpg"]
        }
      ]
    },
    {
      id: 2,
      property: {
        address: "Résidence Soleil, Apt 102",
        type: "T1",
        surface: 32
      },
      contractor: {
        name: "Peinture Pro",
        rating: 5,
        specialty: "Peinture & Revêtements muraux"
      },
      workType: "Rénovation peinture complète",
      estimatedCost: 850,
      startDate: "2024-08-10",
      estimatedEndDate: "2024-08-12",
      status: "pending",
      progress: 0,
      tasks: [
        {
          description: "Préparation des surfaces",
          status: "todo"
        },
        {
          description: "Peinture plafonds",
          status: "todo"
        },
        {
          description: "Peinture murs",
          status: "todo"
        }
      ]
    },
    {
      id: 3,
      property: {
        address: "Résidence Jardin, Apt 78",
        type: "T1",
        surface: 32
      },
      contractor: {
        name: "Électricité Sécurité",
        rating: 3,
        specialty: "Électricité"
      },
      workType: "Mise aux normes électriques",
      estimatedCost: 2200,
      startDate: "2024-07-25",
      estimatedEndDate: "2024-08-05",
      actualEndDate: "2024-08-08",
      status: "completed",
      progress: 100,
      tasks: [
        {
          description: "Remplacement tableau électrique",
          status: "done",
          photos: ["photo4.jpg"]
        },
        {
          description: "Mise à terre des circuits",
          status: "done",
          photos: ["photo5.jpg"]
        },
        {
          description: "Remplacement prises défectueuses",
          status: "done",
          photos: ["photo6.jpg"]
        }
      ],
      dailyReports: [
        {
          date: "2024-07-28",
          progress: 30,
          notes: "Tableau électrique remplacé",
          photos: ["photo4.jpg"]
        },
        {
          date: "2024-08-02",
          progress: 75,
          notes: "Mise à terre complétée",
          photos: ["photo5.jpg"]
        },
        {
          date: "2024-08-07",
          progress: 95,
          notes: "Fin des travaux, vérifications finales",
          photos: ["photo6.jpg"]
        }
      ]
    },
    {
      id: 4,
      property: {
        address: "Résidence Horizon, Apt 210",
        type: "T4",
        surface: 82
      },
      contractor: {
        name: "MultiTech Services",
        rating: 4,
        specialty: "Travaux multiservices"
      },
      workType: "Gros œuvre après sinistre eau",
      estimatedCost: 5800,
      startDate: "2024-07-15",
      estimatedEndDate: "2024-08-10",
      status: "delayed",
      progress: 45,
      tasks: [
        {
          description: "Démolition cloisons endommagées",
          status: "done",
          photos: ["photo7.jpg"]
        },
        {
          description: "Assèchement des murs",
          status: "in_progress",
          photos: ["photo8.jpg"]
        },
        {
          description: "Réfection sols",
          status: "todo"
        },
        {
          description: "Réparation plomberie",
          status: "todo"
        },
        {
          description: "Peinture finale",
          status: "todo"
        }
      ],
      dailyReports: [
        {
          date: "2024-07-20",
          progress: 20,
          notes: "Démolition terminée, début assèchement",
          photos: ["photo7.jpg"]
        },
        {
          date: "2024-07-28",
          progress: 35,
          notes: "Assèchement en cours, retard dû à humidité persistante",
          photos: ["photo8.jpg"]
        }
      ],
      penalties: [
        {
          amount: 150,
          reason: "Retard de 3 jours sur le planning",
          status: "pending"
        }
      ],
      forceMajeure: {
        declared: true,
        reason: "Humidité plus importante que prévu nécessitant un temps de séchage supplémentaire",
        approved: undefined
      }
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleApproveCompletion = (id: number) => {
    setWorkOrders(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          status: "completed",
          progress: 100,
          actualEndDate: new Date().toISOString().split('T')[0]
        } : item
      )
    );
    setSelectedWorkOrder(null);
  };

  const handleReportIssue = (id: number) => {
    setWorkOrders(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          status: "delayed",
          penalties: [
            ...(item.penalties || []),
            {
              amount: 200,
              reason: "Problème signalé par le RA",
              status: "pending"
            }
          ]
        } : item
      )
    );
    setSelectedWorkOrder(null);
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Filtre par statut
    if (filter !== 'all' && workOrder.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workOrder.property.address.toLowerCase().includes(term) ||
        workOrder.contractor.name.toLowerCase().includes(term) ||
        workOrder.workType.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <CircleDashed className="h-5 w-5 text-yellow-500" />;
      case 'in_progress': return <Construction className="h-5 w-5 text-blue-500" />;
      case 'completed': return <Check className="h-5 w-5 text-green-500" />;
      case 'delayed': return <AlertOctagon className="h-5 w-5 text-orange-500" />;
      case 'cancelled': return <X className="h-5 w-5 text-red-500" />;
      default: return <CircleDashed className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'delayed': return 'En retard';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

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
            <Hammer className="h-8 w-8 mr-3" />
            Suivi des Travaux
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
              <FileSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Travaux en cours</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {workOrders.filter(w => w.status === 'in_progress').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(w => w.status === 'in_progress').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Actuellement en réalisation
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Retards</h3>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
                {workOrders.filter(w => w.status === 'delayed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(w => w.status === 'delayed').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Dossiers en retard
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">À valider</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {workOrders.filter(w => w.status === 'completed' && !w.actualEndDate).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(w => w.status === 'completed' && !w.actualEndDate).length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En attente de validation RA
            </p>
          </div>
        </div>

        <div className="pt-8 mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setFilter('in_progress')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'in_progress'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Construction className="h-4 w-4 mr-1" />
              En cours
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {workOrders.filter(w => w.status === 'in_progress').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'pending'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <CircleDashed className="h-4 w-4 mr-1" />
              En attente
              <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {workOrders.filter(w => w.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'completed'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Check className="h-4 w-4 mr-1" />
              Terminés
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {workOrders.filter(w => w.status === 'completed').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('delayed')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'delayed'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <AlertOctagon className="h-4 w-4 mr-1" />
              En retard
              <span className="ml-1 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
                {workOrders.filter(w => w.status === 'delayed').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Tous
            </button>
          </nav>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type travaux</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Avancement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredWorkOrders.length > 0 ? (
                filteredWorkOrders.map(workOrder => (
                  <tr 
                    key={workOrder.id} 
                    className={`
                      hover:bg-gray-50 dark:hover:bg-neutral-700
                      ${workOrder.status === 'delayed' ? 'bg-red-50/30 dark:bg-red-900/10' : ''}
                    `}
                  >
                    <td className="px-4 py-3 font-medium">BT-{workOrder.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {workOrder.property.type} - {workOrder.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.contractor.name}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {workOrder.contractor.specialty}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{workOrder.workType}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {workOrder.estimatedCost} €
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${workOrder.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center text-gray-500 dark:text-neutral-400 mt-1">
                        {workOrder.progress}%
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getStatusIcon(workOrder.status)}
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                          {getStatusLabel(workOrder.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        {workOrder.startDate} → {workOrder.estimatedEndDate}
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
                    Aucun bon de travaux trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de détail */}
      {selectedWorkOrder && (
        <WorkOrderDetailModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onApproveCompletion={() => handleApproveCompletion(selectedWorkOrder.id)}
          onReportIssue={() => handleReportIssue(selectedWorkOrder.id)}
        />
      )}
    </div>
  );
}