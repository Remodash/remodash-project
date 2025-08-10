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
  ArrowLeft,
  FileSearch,
  HardHat,
  AlertTriangle,
  Info
} from 'lucide-react';

// Types basés sur le cahier des charges
interface DiagnosticApproval {
  id: number;
  property: {
    address: string;
    type: string;
    surface: number;
    constructionYear: number;
    lastRenovation?: number;
  };
  diagnosticType: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedDate: string;
  justification: string;
  reports?: {
    name: string;
    type: 'photo' | 'document' | 'report';
    url: string;
    date: string;
  }[];
  iaRecommendation?: string;
  legalRequirements?: string;
}

interface WorkOrderApproval {
  id: number;
  property: {
    address: string;
    type: string;
    surface: number;
  };
  workType: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  estimatedCost: number;
  tenantShare: number;
  contractor: {
    name: string;
    rating: number;
    specialty: string;
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
  }[];
  relatedDiagnostics?: number[];
  photos?: string[];
}

interface AgencyAlert {
  id: number;
  type: 'financial' | 'legal' | 'technical' | 'administrative';
  title: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedEntity?: {
    type: 'tenant' | 'property' | 'contract';
    id: number;
    name: string;
  };
  actionsRequired?: string[];
  documents?: {
    name: string;
    type: string;
    url: string;
  }[];
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

const DiagnosticDetailModal: React.FC<{
  diagnostic: DiagnosticApproval;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}> = ({ diagnostic, onClose, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <FileSearch className="mr-2" />
              Détails du Diagnostic
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
                <p><span className="font-medium">Adresse:</span> {diagnostic.property.address}</p>
                <p><span className="font-medium">Type:</span> {diagnostic.property.type} ({diagnostic.property.surface}m²)</p>
                <p><span className="font-medium">Année construction:</span> {diagnostic.property.constructionYear}</p>
                {diagnostic.property.lastRenovation && (
                  <p><span className="font-medium">Dernière rénovation:</span> {diagnostic.property.lastRenovation}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Détails du diagnostic</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Type:</span> 
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    diagnostic.diagnosticType === 'DPE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    diagnostic.diagnosticType === 'Amiante' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {diagnostic.diagnosticType}
                  </span>
                </p>
                <p><span className="font-medium">Demandé par:</span> {diagnostic.requestedBy}</p>
                <p><span className="font-medium">Date demande:</span> {diagnostic.requestedDate}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Justification et recommandations</h3>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
              <p className="mb-3">{diagnostic.justification}</p>
              {diagnostic.iaRecommendation && (
                <>
                  <div className="flex items-start mb-2">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p><span className="font-medium">Recommandation IA:</span> {diagnostic.iaRecommendation}</p>
                  </div>
                </>
              )}
              {diagnostic.legalRequirements && (
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p><span className="font-medium">Obligation légale:</span> {diagnostic.legalRequirements}</p>
                </div>
              )}
            </div>
          </div>

          {diagnostic.reports && diagnostic.reports.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Documents associés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {diagnostic.reports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">{report.date}</p>
                      </div>
                    </div>
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

const WorkOrderDetailModal: React.FC<{
  workOrder: WorkOrderApproval;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}> = ({ workOrder, onClose, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <HardHat className="mr-2" />
              Détails du Bon de Travaux
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
              </div>

              <h3 className="font-medium text-lg mt-4 mb-2">Prestataire</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Entreprise:</span> {workOrder.contractor.name}</p>
                <p><span className="font-medium">Spécialité:</span> {workOrder.contractor.specialty}</p>
                <p><span className="font-medium">Note:</span> {'★'.repeat(workOrder.contractor.rating)}{'☆'.repeat(5 - workOrder.contractor.rating)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Détails de l'intervention</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type travaux:</span> {workOrder.workType}</p>
                <p><span className="font-medium">Demandé par:</span> {workOrder.requestedBy}</p>
                <p><span className="font-medium">Date demande:</span> {workOrder.requestedDate}</p>
                <p><span className="font-medium">Échéance:</span> {workOrder.deadline}</p>
                <p><span className="font-medium">Coût total:</span> {workOrder.estimatedCost.toLocaleString('fr-FR')} €</p>
                <p><span className="font-medium">Part locataire:</span> {workOrder.tenantShare.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Détail des postes de travaux</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Coût</th>
                    <th className="px-4 py-2 text-left">Part locataire</th>
                    <th className="px-4 py-2 text-left">Urgence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {workOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2">{item.cost.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-2">{item.tenantResponsibility.toLocaleString('fr-FR')} €</td>
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
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Justification</h3>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
              <p>{workOrder.justification}</p>
            </div>
          </div>

          {workOrder.photos && workOrder.photos.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Photos associées</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {workOrder.photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img 
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

const AlertDetailModal: React.FC<{
  alert: AgencyAlert;
  onClose: () => void;
  onMarkAsRead: () => void;
}> = ({ alert, onClose, onMarkAsRead }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <AlertCircle className={`mr-2 ${
                  alert.priority === 'critical' ? 'text-red-500' :
                  alert.priority === 'high' ? 'text-orange-500' :
                  alert.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                {alert.title}
              </h2>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                  alert.type === 'financial' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  alert.type === 'legal' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  alert.type === 'technical' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {alert.type === 'financial' ? 'Financier' :
                   alert.type === 'legal' ? 'Juridique' :
                   alert.type === 'technical' ? 'Technique' : 'Administratif'}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  alert.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  alert.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {alert.priority === 'critical' ? 'Critique' :
                   alert.priority === 'high' ? 'Élevée' :
                   alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <XCircle />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Détails</h3>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
              <p>{alert.message}</p>
              {alert.relatedEntity && (
                <p className="mt-2">
                  <span className="font-medium">Lié à:</span> {alert.relatedEntity.name} ({alert.relatedEntity.type})
                </p>
              )}
            </div>
          </div>

          {alert.actionsRequired && alert.actionsRequired.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Actions requises</h3>
              <ul className="space-y-2">
                {alert.actionsRequired.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {alert.documents && alert.documents.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Documents associés</h3>
              <div className="grid grid-cols-1 gap-3">
                {alert.documents.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">{doc.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={() => {
                onMarkAsRead();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Marquer comme lu
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AgencyManagerDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'diagnostics' | 'workOrders'>('alerts');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticApproval | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderApproval | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AgencyAlert | null>(null);

  // Données simulées basées sur le cahier des charges
  const [diagnosticApprovals, setDiagnosticApprovals] = useState<DiagnosticApproval[]>([
    {
      id: 1,
      property: {
        address: 'Résidence Lumière, Apt 305',
        type: 'T2',
        surface: 45,
        constructionYear: 1995,
        lastRenovation: 2015
      },
      diagnosticType: 'DPE',
      status: 'pending',
      requestedBy: 'GT Martin',
      requestedDate: '2024-08-01',
      justification: 'Logement vide, DPE existant > 10 ans. Obligation légale pour toute nouvelle location.',
      iaRecommendation: "Nécessaire pour mise en conformité. DPE actuel de classe E à mettre à jour.",
      legalRequirements: "Arrêté du 15 septembre 2006 relatif au DPE",
      reports: [
        {
          name: 'Ancien DPE (2015)',
          type: 'document',
          url: '#',
          date: '2015-06-15'
        },
        {
          name: 'Photo façade',
          type: 'photo',
          url: '#',
          date: '2024-07-30'
        }
      ]
    },
    {
      id: 2,
      property: {
        address: 'Résidence Soleil, Apt 102',
        type: 'T3',
        surface: 65,
        constructionYear: 1987
      },
      diagnosticType: 'Électricité',
      status: 'pending',
      requestedBy: 'GT Dupont',
      requestedDate: '2024-08-02',
      justification: 'Installation électrique datant de plus de 15 ans avec défauts visuels signalés (prises cassées, fils apparents).',
      iaRecommendation: "Vérification complète nécessaire pour sécurité des occupants.",
      reports: [
        {
          name: 'Rapport pré-EDL',
          type: 'report',
          url: '#',
          date: '2024-07-28'
        },
        {
          name: 'Photo tableau électrique',
          type: 'photo',
          url: '#',
          date: '2024-07-28'
        }
      ]
    }
  ]);

  const [workOrderApprovals, setWorkOrderApprovals] = useState<WorkOrderApproval[]>([
    {
      id: 1,
      property: {
        address: 'Résidence Lumière, Apt 305',
        type: 'T2',
        surface: 45
      },
      workType: 'Remise en état',
      status: 'pending',
      estimatedCost: 2500,
      tenantShare: 450,
      contractor: {
        name: 'BTP Excellence',
        rating: 4,
        specialty: 'Rénovation complète'
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
          urgency: 'medium'
        },
        {
          description: 'Remplacement sol PVC',
          cost: 600,
          tenantResponsibility: 0,
          urgency: 'medium'
        },
        {
          description: 'Mise aux normes électriques',
          cost: 1100,
          tenantResponsibility: 300,
          urgency: 'high'
        }
      ],
      photos: [
        '/placeholder-photo-1.jpg',
        '/placeholder-photo-2.jpg'
      ]
    },
    {
      id: 2,
      property: {
        address: 'Résidence Soleil, Apt 102',
        type: 'T3',
        surface: 65
      },
      workType: 'Rénovation électrique',
      status: 'pending',
      estimatedCost: 1800,
      tenantShare: 0,
      contractor: {
        name: 'Elec Pro',
        rating: 5,
        specialty: 'Électricité résidentielle'
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
          urgency: 'high'
        },
        {
          description: 'Mise à terre des circuits',
          cost: 500,
          tenantResponsibility: 0,
          urgency: 'high'
        },
        {
          description: 'Remplacement prises défectueuses',
          cost: 400,
          tenantResponsibility: 0,
          urgency: 'medium'
        }
      ],
      relatedDiagnostics: [2]
    }
  ]);

  const [agencyAlerts, setAgencyAlerts] = useState<AgencyAlert[]>([
    {
      id: 1,
      type: 'financial',
      title: 'Impayé critique',
      message: 'Locataire Résidence Soleil Apt 102 - 3 mois impayés (2160€). Procédure contentieuse enclenchée.',
      date: '2024-08-01',
      status: 'unread',
      priority: 'critical',
      relatedEntity: {
        type: 'tenant',
        id: 102,
        name: 'Jean Martin'
      },
      actionsRequired: [
        "Valider l'envoi de mise en demeure",
        "Préparer dossier pour contentieux si impayé persiste"
      ],
      documents: [
        {
          name: 'Relevé de compte',
          type: 'PDF',
          url: '#'
        },
        {
          name: 'Historique des paiements',
          type: 'Excel',
          url: '#'
        }
      ]
    },
    {
      id: 2,
      type: 'technical',
      title: 'Bon de travaux urgent',
      message: 'Rénovation électrique nécessaire - Résidence Soleil Apt 102. Diagnostic révèle des anomalies dangereuses.',
      date: '2024-08-02',
      status: 'unread',
      priority: 'high',
      relatedEntity: {
        type: 'property',
        id: 102,
        name: 'Résidence Soleil, Apt 102'
      },
      actionsRequired: [
        "Approuver le bon de travaux urgent",
        "Valider le devis du prestataire"
      ]
    },
    {
      id: 3,
      type: 'legal',
      title: 'DPE expiré',
      message: 'Le DPE du logement Résidence Lumière Apt 305 a expiré. Nouveau diagnostic nécessaire avant mise en location.',
      date: '2024-08-03',
      status: 'read',
      priority: 'medium',
      relatedEntity: {
        type: 'property',
        id: 305,
        name: 'Résidence Lumière, Apt 305'
      }
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleDiagnosticDecision = (id: number, decision: 'approved' | 'rejected') => {
    setDiagnosticApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: decision } : item
      )
    );
    setSelectedDiagnostic(null);
  };

  const handleWorkOrderDecision = (id: number, decision: 'approved' | 'rejected') => {
    setWorkOrderApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: decision } : item
      )
    );
    setSelectedWorkOrder(null);
  };

  const markAlertAsRead = (id: number) => {
    setAgencyAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, status: 'read' } : alert
      )
    );
  };

  const renderAlertsTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Alertes et Notifications</h2>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Priorité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Titre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {agencyAlerts.map(alert => (
              <tr 
                key={alert.id} 
                className={`
                  hover:bg-gray-50 dark:hover:bg-neutral-700
                  ${alert.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                `}
              >
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    alert.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    alert.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {alert.priority === 'critical' ? 'Critique' :
                     alert.priority === 'high' ? 'Élevée' :
                     alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{alert.title}</td>
                <td className="px-4 py-3 text-sm max-w-xs truncate">{alert.message}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-neutral-400">{alert.date}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedAlert(alert)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDiagnosticsTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Validation des Diagnostics</h2>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type Diagnostic</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Demandé par</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {diagnosticApprovals
              .filter(item => item.status === 'pending')
              .map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.property.address}</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {item.property.type} - {item.property.surface}m²
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.diagnosticType === 'DPE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      item.diagnosticType === 'Amiante' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {item.diagnosticType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.requestedBy}
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {item.requestedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedDiagnostic(item)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Examiner
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkOrdersTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Approbation des Bons de Travaux</h2>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type Travaux</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût / Part locataire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire / Délai</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {workOrderApprovals
              .filter(item => item.status === 'pending')
              .map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.property.address}</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {item.property.type}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.workType}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.estimatedCost.toLocaleString('fr-FR')} €</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Dont {item.tenantShare.toLocaleString('fr-FR')} € locataire
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{item.contractor.name}</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.deadline}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedWorkOrder(item)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Examiner
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-neutral-200">
          Tableau de Bord Responsable d'Agence
        </h1>
        
        <div className="mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Alertes
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'diagnostics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Diagnostics
            </button>
            <button
              onClick={() => setActiveTab('workOrders')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'workOrders'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Bons de Travaux
            </button>
          </nav>
        </div>
        
        {activeTab === 'alerts' && renderAlertsTab()}
        {activeTab === 'diagnostics' && renderDiagnosticsTab()}
        {activeTab === 'workOrders' && renderWorkOrdersTab()}
      </main>

      {/* Modals */}
      {selectedDiagnostic && (
        <DiagnosticDetailModal
          diagnostic={selectedDiagnostic}
          onClose={() => setSelectedDiagnostic(null)}
          onApprove={() => handleDiagnosticDecision(selectedDiagnostic.id, 'approved')}
          onReject={() => handleDiagnosticDecision(selectedDiagnostic.id, 'rejected')}
        />
      )}

      {selectedWorkOrder && (
        <WorkOrderDetailModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onApprove={() => handleWorkOrderDecision(selectedWorkOrder.id, 'approved')}
          onReject={() => handleWorkOrderDecision(selectedWorkOrder.id, 'rejected')}
        />
      )}

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onMarkAsRead={() => markAlertAsRead(selectedAlert.id)}
        />
      )}
    </div>
  );
}