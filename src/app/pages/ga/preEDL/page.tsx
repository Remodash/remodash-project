'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  FileText,
  ClipboardList,
  Camera,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSearch,
  User,
  Building,
  Ruler,
  Thermometer,
  ShieldAlert,
  Zap,
  Droplets,
  Paintbrush,
  DoorOpen,
  Lock,
  Fan,
  Sparkles,
  ArrowRight,
  Filter,
  Plus, Settings
} from 'lucide-react';

interface PreEDL {
  id: number;
  reference: string;
  property: {
    address: string;
    type: string;
    surface: number;
    building: string;
    floor: string;
    doorNumber: string;
  };
  tenant: {
    name: string;
    moveOutDate: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  guardian: string;
  diagnostics: {
    type: string;
    required: boolean;
    completed: boolean;
  }[];
  photosCount: number;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { 
        icon: Home, 
        label: 'Tableau de bord', 
        href: '/dashboard/ga' 
    },
    { 
        icon: ClipboardList, 
        label: 'Pré-EDL', 
        href: '/pages/ga/preEDL'  // Correspond à /pages/ga/preEDL
    },
    { 
        icon: Camera, 
        label: 'Travaux en cours', 
        href: '/pages/ga/travauxEnCours'  // Correspond à /pages/ga/travauxEnCours
    },
    { 
        icon: FileText, 
        label: 'Détails', 
        href: '/pages/ga/details'  // Correspond à /pages/ga/details
    },
    { 
        icon: Settings, 
        label: 'Paramètres', 
        href: '/dashboard/ga/parametres'  // Hypothèse (non présent dans votre structure)
    }
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
              ${item.label === 'Pré-États des Lieux' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
    case 'pending': return 'À réaliser';
    case 'in_progress': return 'En cours';
    case 'completed': return 'Terminé';
    case 'cancelled': return 'Annulé';
    default: return status;
  }
};

const getDiagnosticIcon = (type: string) => {
  if (type.includes('électricité')) return <Zap className="h-4 w-4" />;
  if (type.includes('plomberie')) return <Droplets className="h-4 w-4" />;
  if (type.includes('peinture')) return <Paintbrush className="h-4 w-4" />;
  if (type.includes('menuiserie')) return <DoorOpen className="h-4 w-4" />;
  if (type.includes('serrurerie')) return <Lock className="h-4 w-4" />;
  if (type.includes('VMC')) return <Fan className="h-4 w-4" />;
  if (type.includes('nettoyage')) return <Sparkles className="h-4 w-4" />;
  if (type.includes('DPE')) return <Thermometer className="h-4 w-4" />;
  if (type.includes('Amiante')) return <ShieldAlert className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

export default function GuardianPreEDL() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const [preEDLs] = useState<PreEDL[]>([
    {
      id: 1,
      reference: 'PEDL-2023-0425',
      property: {
        address: '12 Rue de la Paix, 75002 Paris',
        type: 'T2',
        surface: 45,
        building: 'Bâtiment A',
        floor: '2ème étage',
        doorNumber: '12'
      },
      tenant: {
        name: 'Dupont Martin',
        moveOutDate: '2023-05-15'
      },
      status: 'pending',
      scheduledDate: '2023-05-10T10:00:00',
      guardian: 'Jean Petit',
      diagnostics: [
        { type: 'DPE', required: true, completed: false },
        { type: 'Électricité', required: true, completed: false },
        { type: 'Plomberie', required: false, completed: false }
      ],
      photosCount: 0
    },
    {
      id: 2,
      reference: 'PEDL-2023-0426',
      property: {
        address: '24 Avenue des Champs, 75008 Paris',
        type: 'T3',
        surface: 72,
        building: 'Bâtiment B',
        floor: '1er étage',
        doorNumber: '5'
      },
      tenant: {
        name: 'Leblanc Sophie',
        moveOutDate: '2023-05-20'
      },
      status: 'in_progress',
      scheduledDate: '2023-05-12T14:00:00',
      completedDate: undefined,
      guardian: 'Marie Durand',
      diagnostics: [
        { type: 'Amiante', required: true, completed: false },
        { type: 'Plomb', required: true, completed: false },
        { type: 'Gaz', required: true, completed: false }
      ],
      photosCount: 8
    },
    {
      id: 3,
      reference: 'PEDL-2023-0423',
      property: {
        address: '5 Boulevard Haussmann, 75009 Paris',
        type: 'Studio',
        surface: 28,
        building: 'Bâtiment C',
        floor: 'RDC',
        doorNumber: '2'
      },
      tenant: {
        name: 'Moreau Thomas',
        moveOutDate: '2023-05-05'
      },
      status: 'completed',
      scheduledDate: '2023-05-02T09:30:00',
      completedDate: '2023-05-02T11:45:00',
      guardian: 'Jean Petit',
      diagnostics: [
        { type: 'DPE', required: true, completed: true },
        { type: 'Électricité', required: true, completed: true },
        { type: 'Plomberie', required: false, completed: false }
      ],
      photosCount: 15
    },
    {
      id: 4,
      reference: 'PEDL-2023-0420',
      property: {
        address: '8 Rue de Rivoli, 75004 Paris',
        type: 'T4',
        surface: 85,
        building: 'Bâtiment D',
        floor: '3ème étage',
        doorNumber: '8'
      },
      tenant: {
        name: 'Girard Alice',
        moveOutDate: '2023-04-28'
      },
      status: 'completed',
      scheduledDate: '2023-04-25T13:00:00',
      completedDate: '2023-04-25T15:30:00',
      guardian: 'Marie Durand',
      diagnostics: [
        { type: 'Amiante', required: true, completed: true },
        { type: 'Plomb', required: true, completed: true },
        { type: 'Gaz', required: true, completed: true }
      ],
      photosCount: 22
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const filteredPreEDLs = preEDLs.filter(preEDL => {
    // Filtre par statut
    if (filter !== 'all' && preEDL.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        preEDL.property.address.toLowerCase().includes(term) ||
        preEDL.tenant.name.toLowerCase().includes(term) ||
        preEDL.reference.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getCompletedDiagnostics = (diagnostics: PreEDL['diagnostics']) => {
    return diagnostics.filter(d => d.completed).length;
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
            <ClipboardList className="h-8 w-8 mr-3" />
            Pré-États des Lieux
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">À réaliser</h3>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {preEDLs.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {preEDLs.filter(d => d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Pré-EDL programmés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En cours</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {preEDLs.filter(d => d.status === 'in_progress').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {preEDLs.filter(d => d.status === 'in_progress').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Pré-EDL en cours de saisie
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Terminés</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {preEDLs.filter(d => d.status === 'completed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {preEDLs.filter(d => d.status === 'completed').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Pré-EDL finalisés
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
              À réaliser
              <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {preEDLs.filter(d => d.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'in_progress'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Clock className="h-4 w-4 mr-1" />
              En cours
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {preEDLs.filter(d => d.status === 'in_progress').length}
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
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Terminés
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {preEDLs.filter(d => d.status === 'completed').length}
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
              <Filter className="h-4 w-4 mr-1" />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Diagnostics</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Photos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredPreEDLs.length > 0 ? (
                filteredPreEDLs.map(preEDL => (
                  <tr 
                    key={preEDL.id} 
                    className={`
                      hover:bg-gray-50 dark:hover:bg-neutral-700
                      ${preEDL.status === 'pending' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                       preEDL.status === 'in_progress' ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}
                    `}
                  >
                    <td className="px-4 py-3 font-medium">{preEDL.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{preEDL.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {preEDL.property.building} - {preEDL.property.floor} - Porte {preEDL.property.doorNumber}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 flex items-center mt-1">
                        <Ruler className="h-3 w-3 mr-1" />
                        {preEDL.property.type} - {preEDL.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <div>
                          <div>{preEDL.tenant.name}</div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400">
                            Sortie: {new Date(preEDL.tenant.moveOutDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {preEDL.diagnostics.map((diagnostic, index) => (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              diagnostic.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : diagnostic.required 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}
                          >
                            {getDiagnosticIcon(diagnostic.type)}
                            <span className="ml-1">{diagnostic.type}</span>
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        {getCompletedDiagnostics(preEDL.diagnostics)}/{preEDL.diagnostics.filter(d => d.required).length} requis
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        {preEDL.photosCount}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(preEDL.status)}`}>
                        {getStatusLabel(preEDL.status)}
                      </span>
                      {preEDL.scheduledDate && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          {new Date(preEDL.scheduledDate).toLocaleDateString()} à {new Date(preEDL.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/pages/ga/details/preEDL`}
                        className={`text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center ${
                          preEDL.status === 'completed' ? 'text-green-600 dark:text-green-400' : ''
                        }`}
                      >
                        {preEDL.status === 'pending' ? (
                          <>
                            Commencer
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </>
                        ) : preEDL.status === 'in_progress' ? (
                          <>
                            Continuer
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Voir détails
                            <FileSearch className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun pré-état des lieux trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}