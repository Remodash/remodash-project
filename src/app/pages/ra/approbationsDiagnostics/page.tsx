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
  Clock,
  FileSearch,
  AlertTriangle,
  Info,
  ClipboardList,
  Thermometer,
  ShieldAlert,
  Zap,
  Droplets,
  Bug,
  Flame,
  Factory,
  ScanEye,
  CalendarCheck
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
  diagnosticType: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites' | 'Audit énergétique';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedDate: string;
  justification: string;
  iaRecommendation: string;
  legalRequirements?: string;
  reports?: {
    name: string;
    type: 'photo' | 'document' | 'report';
    url: string;
    date: string;
  }[];
  deadline: string;
  contractor?: {
    name: string;
    rating: number;
  };
  isUrgent?: boolean;
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
              ${item.label === 'Approbations Diagnostics' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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
  const getDiagnosticIcon = (type: string) => {
    switch(type) {
      case 'DPE': return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 'Amiante': return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'Plomb': return <Droplets className="h-5 w-5 text-gray-500" />;
      case 'Électricité': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'Gaz': return <Flame className="h-5 w-5 text-blue-500" />;
      case 'ERPS': return <Factory className="h-5 w-5 text-purple-500" />;
      case 'Humidité': return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'Termites': return <Bug className="h-5 w-5 text-amber-500" />;
      case 'Audit énergétique': return <Thermometer className="h-5 w-5 text-green-500" />;
      default: return <ScanEye className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDiagnosticColor = (type: string) => {
    switch(type) {
      case 'DPE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Amiante': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Plomb': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Électricité': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Gaz': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ERPS': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Humidité': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Termites': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Audit énergétique': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              {getDiagnosticIcon(diagnostic.diagnosticType)}
              <span className="ml-2">Détails du Diagnostic</span>
              {diagnostic.isUrgent && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Urgent
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDiagnosticColor(diagnostic.diagnosticType)}`}>
                    {diagnostic.diagnosticType}
                  </span>
                </p>
                <p><span className="font-medium">Demandé par:</span> {diagnostic.requestedBy}</p>
                <p><span className="font-medium">Date demande:</span> {diagnostic.requestedDate}</p>
                <p className="flex items-center">
                  <span className="font-medium">Échéance:</span> 
                  <CalendarCheck className="h-4 w-4 ml-2 mr-1" />
                  {diagnostic.deadline}
                </p>
                {diagnostic.contractor && (
                  <p>
                    <span className="font-medium">Prestataire:</span> {diagnostic.contractor.name}
                    <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">
                      {'★'.repeat(diagnostic.contractor.rating)}{'☆'.repeat(5 - diagnostic.contractor.rating)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Justification et recommandations</h3>
            <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
              <p className="mb-3">{diagnostic.justification}</p>
              <div className="flex items-start mb-2">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p><span className="font-medium">Recommandation IA:</span> {diagnostic.iaRecommendation}</p>
              </div>
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

export default function DiagnosticApprovalPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticApproval | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées basées sur le cahier des charges
  const [diagnostics, setDiagnostics] = useState<DiagnosticApproval[]>([
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
      deadline: '2024-08-15',
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
      ],
      contractor: {
        name: 'Diagnostiques & Co',
        rating: 4
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
      diagnosticType: 'Électricité',
      status: 'pending',
      requestedBy: 'GT Dupont',
      requestedDate: '2024-08-02',
      deadline: '2024-08-18',
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
      ],
      contractor: {
        name: 'Elec Diagnostic',
        rating: 5
      },
      isUrgent: true
    },
    {
      id: 3,
      property: {
        address: 'Résidence Jardin, Apt 78',
        type: 'T1',
        surface: 32,
        constructionYear: 1960
      },
      diagnosticType: 'Amiante',
      status: 'pending',
      requestedBy: 'GT Lefevre',
      requestedDate: '2024-08-03',
      deadline: '2024-08-20',
      justification: 'Immeuble construit avant juillet 1997. DTA absent ou non numérisé.',
      iaRecommendation: "Diagnostic obligatoire avant travaux ou vente.",
      legalRequirements: "Code de la santé publique - Article L1334-12",
      contractor: {
        name: 'Expert Amiante',
        rating: 4
      }
    },
    {
      id: 4,
      property: {
        address: 'Résidence Horizon, Apt 210',
        type: 'T4',
        surface: 82,
        constructionYear: 1948
      },
      diagnosticType: 'Plomb',
      status: 'approved',
      requestedBy: 'GT Bernard',
      requestedDate: '2024-07-28',
      deadline: '2024-08-10',
      justification: 'Logement construit avant 1949. Obligation légale pour location.',
      iaRecommendation: "Recherche de plomb nécessaire dans toutes les peintures.",
      legalRequirements: "Décret n°2006-474 du 25 avril 2006",
      reports: [
        {
          name: 'Rapport CREP',
          type: 'document',
          url: '#',
          date: '2024-08-09'
        }
      ],
      contractor: {
        name: 'Plomb Expert',
        rating: 3
      }
    },
    {
      id: 5,
      property: {
        address: 'Résidence Arc-en-Ciel, Apt 12',
        type: 'Studio',
        surface: 28,
        constructionYear: 2005
      },
      diagnosticType: 'Gaz',
      status: 'rejected',
      requestedBy: 'GT Martin',
      requestedDate: '2024-08-04',
      deadline: '2024-08-12',
      justification: 'Présence de chaudière gaz avec installation >15 ans. Photo indiquant corrosion.',
      iaRecommendation: "Contrôle de l'installation gaz recommandé.",
      contractor: {
        name: 'Gaz Sécurité',
        rating: 4
      }
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleDiagnosticDecision = (id: number, decision: 'approved' | 'rejected') => {
    setDiagnostics(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: decision } : item
      )
    );
    setSelectedDiagnostic(null);
  };

  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    // Filtre par statut
    if (filter !== 'all' && diagnostic.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        diagnostic.property.address.toLowerCase().includes(term) ||
        diagnostic.diagnosticType.toLowerCase().includes(term) ||
        diagnostic.requestedBy.toLowerCase().includes(term) ||
        diagnostic.justification.toLowerCase().includes(term)
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getDiagnosticIcon = (type: string) => {
    switch(type) {
      case 'DPE': return <Thermometer className="h-5 w-5" />;
      case 'Amiante': return <ShieldAlert className="h-5 w-5" />;
      case 'Plomb': return <Droplets className="h-5 w-5" />;
      case 'Électricité': return <Zap className="h-5 w-5" />;
      case 'Gaz': return <Flame className="h-5 w-5" />;
      case 'ERPS': return <Factory className="h-5 w-5" />;
      case 'Humidité': return <Droplets className="h-5 w-5" />;
      case 'Termites': return <Bug className="h-5 w-5" />;
      case 'Audit énergétique': return <Thermometer className="h-5 w-5" />;
      default: return <ScanEye className="h-5 w-5" />;
    }
  };

  const getDiagnosticColor = (type: string) => {
    switch(type) {
      case 'DPE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Amiante': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Plomb': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Électricité': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Gaz': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ERPS': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Humidité': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Termites': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Audit énergétique': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
            <FileText className="h-8 w-8 mr-3" />
            Validation des Bons de Diagnostic
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
                {diagnostics.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.filter(d => d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Diagnostics à valider
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Urgents</h3>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {diagnostics.filter(d => d.isUrgent).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.filter(d => d.isUrgent && d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En attente de validation
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Obligations légales</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {diagnostics.filter(d => d.legalRequirements).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.filter(d => d.legalRequirements && d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              À valider rapidement
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
                {diagnostics.filter(d => d.status === 'pending').length}
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
                {diagnostics.filter(d => d.status === 'approved').length}
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
                {diagnostics.filter(d => d.status === 'rejected').length}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type Diagnostic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Demandé par</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredDiagnostics.length > 0 ? (
                filteredDiagnostics.map(diagnostic => (
                  <tr 
                    key={diagnostic.id} 
                    className={`
                      hover:bg-gray-50 dark:hover:bg-neutral-700
                      ${diagnostic.status === 'pending' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
                      ${diagnostic.isUrgent ? 'border-l-4 border-red-500' : ''}
                    `}
                  >
                    <td className="px-4 py-3 font-medium">BD-{diagnostic.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{diagnostic.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {diagnostic.property.type} - {diagnostic.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getDiagnosticIcon(diagnostic.diagnosticType)}
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDiagnosticColor(diagnostic.diagnosticType)}`}>
                          {diagnostic.diagnosticType}
                        </span>
                      </div>
                      {diagnostic.isUrgent && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">Urgent</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{diagnostic.requestedBy}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {diagnostic.requestedDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(diagnostic.status)}`}>
                        {getStatusLabel(diagnostic.status)}
                      </span>
                      {diagnostic.status === 'pending' && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {diagnostic.deadline}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedDiagnostic(diagnostic)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <FileSearch className="h-4 w-4 mr-1" />
                        {diagnostic.status === 'pending' ? 'Examiner' : 'Détails'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun bon de diagnostic trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
      </main>

      {/* Modal de détail */}
      {selectedDiagnostic && (
        <DiagnosticDetailModal
          diagnostic={selectedDiagnostic}
          onClose={() => setSelectedDiagnostic(null)}
          onApprove={() => handleDiagnosticDecision(selectedDiagnostic.id, 'approved')}
          onReject={() => handleDiagnosticDecision(selectedDiagnostic.id, 'rejected')}
        />
      )}
    </div>
  );
}