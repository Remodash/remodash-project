'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Clock,
  FileSearch,
  HardHat,
  FileSignature,
  ClipboardList,
  CalendarCheck,
  AlertOctagon
} from 'lucide-react';

// Types basés sur le cahier des charges
interface WorkOrderApproval {
  id: number;
  property: {
    address: string;
    type: string;
    surface: number;
    constructionYear?: number;
    lastRenovation?: number;
  };
  workType: 'remise_etat' | 'renovation' | 'gros_entretien' | 'nettoyage';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  estimatedCost: number;
  tenantShare: number;
  contractor: {
    name: string;
    rating: number;
    specialty: string;
    contractType: 'marche' | 'bon_commande';
  };
  requestedBy: string;
  requestedDate: string;
  deadline: string;
  justification: string;
  items: {
    description: string;
    cost: number;
    tenantResponsibility: number;
    urgency: 'low' | 'medium' | 'high';
    workCategory: 'electricite' | 'plomberie' | 'peinture' | 'sols' | 'menuiserie' | 'serrurerie' | 'ventilation' | 'nettoyage';
    duration: number; // en jours
    materialsIncluded: boolean;
  }[];
  relatedDiagnostics?: number[];
  photos?: string[];
  isDirectOrder?: boolean;
  directOrderJustification?: string;
  penaltyClause?: {
    amountPerDay: number;
    maxPercentage: number;
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
              ${item.label === 'Validation Bons Travaux' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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
  workOrder: WorkOrderApproval;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}> = ({ workOrder, onClose, onApprove, onReject }) => {
  const getWorkTypeLabel = (type: string) => {
    switch(type) {
      case 'remise_etat': return 'Remise en état';
      case 'renovation': return 'Rénovation';
      case 'gros_entretien': return 'Gros entretien';
      case 'nettoyage': return 'Nettoyage';
      default: return type;
    }
  };

  const getWorkCategoryLabel = (category: string) => {
    switch(category) {
      case 'electricite': return 'Électricité';
      case 'plomberie': return 'Plomberie';
      case 'peinture': return 'Peinture/Papier';
      case 'sols': return 'Sols';
      case 'menuiserie': return 'Menuiserie';
      case 'serrurerie': return 'Serrurerie';
      case 'ventilation': return 'Ventilation';
      case 'nettoyage': return 'Nettoyage';
      default: return category;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <HardHat className="mr-2" />
              Détails du Bon de Travaux
              {workOrder.isDirectOrder && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Bon direct
                </span>
              )}
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
              <h3 className="font-medium text-lg mb-2">Informations du logement</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                <p><span className="font-medium">Type:</span> {workOrder.property.type} ({workOrder.property.surface}m²)</p>
                {workOrder.property.constructionYear && (
                  <p><span className="font-medium">Année construction:</span> {workOrder.property.constructionYear}</p>
                )}
                {workOrder.property.lastRenovation && (
                  <p><span className="font-medium">Dernière rénovation:</span> {workOrder.property.lastRenovation}</p>
                )}
              </div>

              <h3 className="font-medium text-lg mt-4 mb-2">Prestataire</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Entreprise:</span> {workOrder.contractor.name}</p>
                <p><span className="font-medium">Spécialité:</span> {workOrder.contractor.specialty}</p>
                <p><span className="font-medium">Note:</span> {'★'.repeat(workOrder.contractor.rating)}{'☆'.repeat(5 - workOrder.contractor.rating)}</p>
                <p><span className="font-medium">Type de contrat:</span> {workOrder.contractor.contractType === 'marche' ? 'Marché' : 'Bon de commande'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Détails de l&apos;intervention</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Type travaux:</span> 
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    workOrder.workType === 'remise_etat' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    workOrder.workType === 'renovation' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    workOrder.workType === 'gros_entretien' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {getWorkTypeLabel(workOrder.workType)}
                  </span>
                </p>
                <p><span className="font-medium">Demandé par:</span> {workOrder.requestedBy}</p>
                <p><span className="font-medium">Date demande:</span> {workOrder.requestedDate}</p>
                <p className="flex items-center">
                  <span className="font-medium">Échéance:</span> 
                  <CalendarCheck className="h-4 w-4 ml-2 mr-1" />
                  {workOrder.deadline}
                </p>
                <p>
                  <span className="font-medium">Coût total:</span> 
                  <span className="font-bold ml-2">{workOrder.estimatedCost.toLocaleString('fr-FR')} €</span>
                </p>
                <p>
                  <span className="font-medium">Part locataire:</span> 
                  <span className="ml-2">{workOrder.tenantShare.toLocaleString('fr-FR')} €</span>
                  {workOrder.tenantShare > 0 && (
                    <span className="text-sm text-gray-500 dark:text-neutral-400 ml-2">
                      ({(workOrder.tenantShare / workOrder.estimatedCost * 100).toFixed(0)}%)
                    </span>
                  )}
                </p>
              </div>

              {workOrder.penaltyClause && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 flex items-center">
                    <AlertOctagon className="h-5 w-5 mr-2" />
                    Clause de pénalité
                  </h4>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{workOrder.penaltyClause.amountPerDay} € HT/jour</span> de retard, plafonnée à {workOrder.penaltyClause.maxPercentage}% du montant total.
                  </p>
                </div>
              )}
            </div>
          </div>

          {workOrder.isDirectOrder && workOrder.directOrderJustification && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <FileSignature className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Justification du bon direct
              </h3>
              <p>{workOrder.directOrderJustification}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Détail des postes de travaux</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Catégorie</th>
                    <th className="px-4 py-2 text-left">Coût</th>
                    <th className="px-4 py-2 text-left">Part locataire</th>
                    <th className="px-4 py-2 text-left">Durée</th>
                    <th className="px-4 py-2 text-left">Urgence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {workOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <div className="font-medium">{item.description}</div>
                        {item.materialsIncluded && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400">Matériaux inclus</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {getWorkCategoryLabel(item.workCategory)}
                      </td>
                      <td className="px-4 py-2">{item.cost.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-2">
                        {item.tenantResponsibility.toLocaleString('fr-FR')} €
                        {item.tenantResponsibility > 0 && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            ({(item.tenantResponsibility / item.cost * 100).toFixed(0)}%)
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">{item.duration} j</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {item.urgency === 'high' ? 'Haute' : item.urgency === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-neutral-700 font-medium">
                  <tr>
                    <td className="px-4 py-2 text-right" colSpan={2}>Total</td>
                    <td className="px-4 py-2">{workOrder.estimatedCost.toLocaleString('fr-FR')} €</td>
                    <td className="px-4 py-2">{workOrder.tenantShare.toLocaleString('fr-FR')} €</td>
                    <td className="px-4 py-2">
                      {workOrder.items.reduce((sum, item) => sum + item.duration, 0)} j
                    </td>
                    <td className="px-4 py-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Justification</h3>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
              <p>{workOrder.justification}</p>
            </div>
          </div>

          {workOrder.relatedDiagnostics && workOrder.relatedDiagnostics.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Diagnostics associés</h3>
              <div className="flex flex-wrap gap-2">
                {workOrder.relatedDiagnostics.map((id, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium"
                  >
                    Diagnostic #{id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {workOrder.photos && workOrder.photos.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Photos associées</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {workOrder.photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <Image 
                      src={photo} 
                      alt={`Photo du logement ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Rejeter
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Approuver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorkOrderApprovalPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderApproval | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées basées sur le cahier des charges
  const [workOrders, setWorkOrders] = useState<WorkOrderApproval[]>([
    {
      id: 1,
      property: {
        address: 'Résidence Lumière, Apt 305',
        type: 'T2',
        surface: 45,
        constructionYear: 1995,
        lastRenovation: 2015
      },
      workType: 'remise_etat',
      status: 'pending',
      estimatedCost: 2500,
      tenantShare: 450,
      contractor: {
        name: 'BTP Excellence',
        rating: 4,
        specialty: 'Rénovation complète',
        contractType: 'marche'
      },
      requestedBy: 'GT Martin',
      requestedDate: '2024-08-03',
      deadline: '2024-08-20',
      justification: 'Remise en état après départ locataire. Peinture, sols et électricité à rénover selon état des lieux de sortie.',
      items: [
        {
          description: 'Peinture complète (murs et plafonds)',
          cost: 800,
          tenantResponsibility: 150,
          urgency: 'medium',
          workCategory: 'peinture',
          duration: 2,
          materialsIncluded: true
        },
        {
          description: 'Remplacement sol PVC',
          cost: 600,
          tenantResponsibility: 0,
          urgency: 'medium',
          workCategory: 'sols',
          duration: 1,
          materialsIncluded: true
        },
        {
          description: 'Mise aux normes électriques',
          cost: 1100,
          tenantResponsibility: 300,
          urgency: 'high',
          workCategory: 'electricite',
          duration: 3,
          materialsIncluded: false
        }
      ],
      relatedDiagnostics: [1],
      photos: [
        '/placeholder-photo-1.jpg',
        '/placeholder-photo-2.jpg'
      ],
      penaltyClause: {
        amountPerDay: 50,
        maxPercentage: 10
      }
    },
    {
      id: 2,
      property: {
        address: 'Résidence Soleil, Apt 102',
        type: 'T3',
        surface: 65,
        constructionYear: 1987
      },
      workType: 'renovation',
      status: 'pending',
      estimatedCost: 1800,
      tenantShare: 0,
      contractor: {
        name: 'Elec Pro',
        rating: 5,
        specialty: 'Électricité résidentielle',
        contractType: 'bon_commande'
      },
      requestedBy: 'GT Dupont',
      requestedDate: '2024-08-04',
      deadline: '2024-08-25',
      justification: 'Diagnostic électrique révèle des anomalies dangereuses. Intervention urgente nécessaire avant relouage.',
      items: [
        {
          description: 'Remplacement tableau électrique',
          cost: 900,
          tenantResponsibility: 0,
          urgency: 'high',
          workCategory: 'electricite',
          duration: 2,
          materialsIncluded: true
        },
        {
          description: 'Mise à terre des circuits',
          cost: 500,
          tenantResponsibility: 0,
          urgency: 'high',
          workCategory: 'electricite',
          duration: 2,
          materialsIncluded: false
        },
        {
          description: 'Remplacement prises défectueuses',
          cost: 400,
          tenantResponsibility: 0,
          urgency: 'medium',
          workCategory: 'electricite',
          duration: 1,
          materialsIncluded: true
        }
      ],
      relatedDiagnostics: [2]
    },
    {
      id: 3,
      property: {
        address: 'Résidence Jardin, Apt 78',
        type: 'T1',
        surface: 32,
        constructionYear: 2005
      },
      workType: 'nettoyage',
      status: 'pending',
      estimatedCost: 350,
      tenantShare: 120,
      contractor: {
        name: 'Clean Services',
        rating: 3,
        specialty: 'Nettoyage professionnel',
        contractType: 'bon_commande'
      },
      requestedBy: 'GT Lefevre',
      requestedDate: '2024-08-05',
      deadline: '2024-08-10',
      justification: 'Nettoyage complet après départ locataire. État de saleté anormal constaté à l&apos;EDL sortant.',
      items: [
        {
          description: 'Nettoyage complet (sol, murs, sanitaires)',
          cost: 350,
          tenantResponsibility: 120,
          urgency: 'low',
          workCategory: 'nettoyage',
          duration: 1,
          materialsIncluded: true
        }
      ],
      photos: [
        '/placeholder-photo-3.jpg'
      ]
    },
    {
      id: 4,
      property: {
        address: 'Résidence Horizon, Apt 210',
        type: 'T4',
        surface: 82,
        constructionYear: 2010
      },
      workType: 'gros_entretien',
      status: 'approved',
      estimatedCost: 4200,
      tenantShare: 0,
      contractor: {
        name: 'Renov\'All',
        rating: 4,
        specialty: 'Gros œuvre',
        contractType: 'marche'
      },
      requestedBy: 'GT Bernard',
      requestedDate: '2024-07-28',
      deadline: '2024-09-15',
      justification: 'Travaux de gros entretien programmés dans le plan pluriannuel. Remplacement menuiseries extérieures et ravalement façade.',
      items: [
        {
          description: 'Remplacement fenêtres (x5)',
          cost: 2500,
          tenantResponsibility: 0,
          urgency: 'medium',
          workCategory: 'menuiserie',
          duration: 5,
          materialsIncluded: true
        },
        {
          description: 'Ravalement façade',
          cost: 1700,
          tenantResponsibility: 0,
          urgency: 'medium',
          workCategory: 'peinture',
          duration: 7,
          materialsIncluded: true
        }
      ],
      penaltyClause: {
        amountPerDay: 100,
        maxPercentage: 15
      }
    },
    {
      id: 5,
      property: {
        address: 'Résidence Arc-en-Ciel, Apt 12',
        type: 'Studio',
        surface: 28,
        constructionYear: 1980
      },
      workType: 'remise_etat',
      status: 'pending',
      estimatedCost: 1500,
      tenantShare: 0,
      contractor: {
        name: 'Quick Renov',
        rating: 3,
        specialty: 'Petits travaux',
        contractType: 'bon_commande'
      },
      requestedBy: 'GT Martin',
      requestedDate: '2024-08-06',
      deadline: '2024-08-18',
      justification: 'Bon de travaux direct pour fuite importante détectée par le gardien. Nécessite intervention urgente sans diagnostic préalable.',
      items: [
        {
          description: 'Réparation fuite canalisation principale',
          cost: 800,
          tenantResponsibility: 0,
          urgency: 'high',
          workCategory: 'plomberie',
          duration: 2,
          materialsIncluded: true
        },
        {
          description: 'Remplacement parquet endommagé',
          cost: 700,
          tenantResponsibility: 0,
          urgency: 'medium',
          workCategory: 'sols',
          duration: 1,
          materialsIncluded: true
        }
      ],
      isDirectOrder: true,
      directOrderJustification: 'Urgence plomberie justifiant l\'absence de diagnostic préalable. Fuite importante détectée par le gardien nécessitant intervention immédiate.'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleWorkOrderDecision = (id: number, decision: 'approved' | 'rejected') => {
    setWorkOrders(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: decision } : item
      )
    );
    setSelectedWorkOrder(null);
  };

  const filteredWorkOrders = workOrders.filter(order => {
    // Filtre par statut
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        order.property.address.toLowerCase().includes(term) ||
        order.contractor.name.toLowerCase().includes(term) ||
        order.requestedBy.toLowerCase().includes(term) ||
        order.items.some(item => item.description.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getWorkTypeLabel = (type: string) => {
    switch(type) {
      case 'remise_etat': return 'Remise en état';
      case 'renovation': return 'Rénovation';
      case 'gros_entretien': return 'Gros entretien';
      case 'nettoyage': return 'Nettoyage';
      default: return type;
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
            <ClipboardCheck className="h-8 w-8 mr-3" />
            Validation des Bons de Travaux
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En attente</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {workOrders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(o => o.status === 'pending').reduce((sum, order) => sum + order.estimatedCost, 0).toLocaleString('fr-FR')} €
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Montant total à valider
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Part locataire</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {workOrders.filter(o => o.status === 'pending').filter(o => o.tenantShare > 0).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(o => o.status === 'pending').reduce((sum, order) => sum + order.tenantShare, 0).toLocaleString('fr-FR')} €
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              À facturer aux locataires
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Bons directs</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {workOrders.filter(o => o.isDirectOrder).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(o => o.isDirectOrder).reduce((sum, order) => sum + order.estimatedCost, 0).toLocaleString('fr-FR')} €
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Montant total des bons directs
            </p>
          </div>
        </div>

        

        <div className="pt-8 mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setFilter('pending')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'pending'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              En attente
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {workOrders.filter(o => o.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'approved'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approuvés
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {workOrders.filter(o => o.status === 'approved').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'rejected'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejetés
              <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {workOrders.filter(o => o.status === 'rejected').length}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type Travaux</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût / Part loc.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredWorkOrders.length > 0 ? (
                filteredWorkOrders.map(order => (
                  <tr 
                    key={order.id} 
                    className={`
                      hover:bg-gray-50 dark:hover:bg-neutral-700
                      ${order.status === 'pending' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                    `}
                  >
                    <td className="px-4 py-3 font-medium">BT-{order.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {order.property.type} - {order.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getWorkTypeLabel(order.workType)}
                      {order.isDirectOrder && (
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Bon direct</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.estimatedCost.toLocaleString('fr-FR')} €</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Dont {order.tenantShare.toLocaleString('fr-FR')} € locataire
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{order.contractor.name}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {'★'.repeat(order.contractor.rating)}{'☆'.repeat(5 - order.contractor.rating)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      {order.status === 'pending' && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.deadline}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedWorkOrder(order)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <FileSearch className="h-4 w-4 mr-1" />
                        {order.status === 'pending' ? 'Examiner' : 'Détails'}
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
          onApprove={() => handleWorkOrderDecision(selectedWorkOrder.id, 'approved')}
          onReject={() => handleWorkOrderDecision(selectedWorkOrder.id, 'rejected')}
        />
      )}
    </div>
  );
}