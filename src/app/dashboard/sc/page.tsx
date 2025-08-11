'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  Gavel,
  FileText,
  Clock,
  Calendar,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Settings
} from 'lucide-react';

// Types basés sur le cahier des charges
interface LegalCase {
  id: number;
  tenant: {
    name: string;
    property: string;
    contact: string;
    ssn?: string;
  };
  unpaidAmount: number;
  overdueDays: number;
  status: 'pre_contentieux' | 'mise_en_demeure' | 'assignation' | 'jugement' | 'recouvrement' | 'clos';
  nextActionDate?: string;
  lastAction: {
    date: string;
    type: string;
    details: string;
  };
  documents: {
    name: string;
    type: string;
    date: string;
  }[];
}

interface LegalStats {
  totalCases: number;
  casesInProgress: number;
  casesInCourt: number;
  totalAmount: number;
  recoveredAmount: number;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/legal' },
    { icon: Gavel, label: 'Dossiers Contentieux', href: '/dashboard/legal/cases' },
    { icon: FileText, label: 'Modèles', href: '/dashboard/legal/templates' },
    { icon: Calendar, label: 'Calendrier', href: '/dashboard/legal/calendar' },
    { icon: Landmark, label: 'Tribunaux', href: '/dashboard/legal/courts' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/legal/settings' }
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
          Contentieux
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

export default function LegalDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'calendar'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Données simulées basées sur le cahier des charges
  const [legalStats, setLegalStats] = useState<LegalStats>({
    totalCases: 24,
    casesInProgress: 18,
    casesInCourt: 6,
    totalAmount: 45870,
    recoveredAmount: 12350
  });

  const [legalCases, setLegalCases] = useState<LegalCase[]>([
    {
      id: 1,
      tenant: {
        name: 'Jean Martin',
        property: 'Résidence Soleil, Apt 102',
        contact: 'jean.martin@email.com',
        ssn: '2890567348129'
      },
      unpaidAmount: 2160,
      overdueDays: 92,
      status: 'assignation',
      nextActionDate: '2024-10-15',
      lastAction: {
        date: '2024-08-01',
        type: 'Assignation en justice',
        details: 'Dépôt au tribunal d\'instance'
      },
      documents: [
        { name: 'Mise en demeure', type: 'Lettre', date: '2024-06-15' },
        { name: 'Preuve de remise', type: 'AR', date: '2024-06-18' },
        { name: 'Assignation', type: 'Document juridique', date: '2024-08-01' }
      ]
    },
    {
      id: 2,
      tenant: {
        name: 'Luc Dubois',
        property: 'Résidence Parc, Apt 503',
        contact: 'luc.dubois@email.com'
      },
      unpaidAmount: 1540,
      overdueDays: 120,
      status: 'jugement',
      nextActionDate: '2024-09-20',
      lastAction: {
        date: '2024-07-10',
        type: 'Audience',
        details: 'Reportée au 20/09/2024'
      },
      documents: [
        { name: 'Mise en demeure', type: 'Lettre', date: '2024-05-01' },
        { name: 'Assignation', type: 'Document juridique', date: '2024-06-10' }
      ]
    },
    {
      id: 3,
      tenant: {
        name: 'Sophie Bernard',
        property: 'Résidence Jardin, Apt 201',
        contact: 'sophie.bernard@email.com',
        ssn: '1678432095671'
      },
      unpaidAmount: 2840,
      overdueDays: 45,
      status: 'mise_en_demeure',
      nextActionDate: '2024-09-01',
      lastAction: {
        date: '2024-08-10',
        type: 'Mise en demeure',
        details: 'Envoyée avec AR'
      },
      documents: [
        { name: 'Relance pré-contentieux', type: 'Email', date: '2024-07-25' },
        { name: 'Mise en demeure', type: 'Lettre', date: '2024-08-10' }
      ]
    },
    {
      id: 4,
      tenant: {
        name: 'Marie Dupont',
        property: 'Résidence Lumière, Apt 305',
        contact: 'marie.dupont@email.com'
      },
      unpaidAmount: 3250,
      overdueDays: 180,
      status: 'recouvrement',
      lastAction: {
        date: '2024-06-15',
        type: 'Jugement',
        details: 'Condamnation à payer 3250€'
      },
      documents: [
        { name: 'Jugement', type: 'Document juridique', date: '2024-06-15' },
        { name: 'Commandement de payer', type: 'Acte', date: '2024-07-01' }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const filteredCases = legalCases.filter(caseItem => {
    const matchesSearch = caseItem.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         caseItem.tenant.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Aperçu Contentieux</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Dossiers actifs</h3>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {legalStats.totalCases}
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">En cours</h3>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {legalStats.casesInProgress}
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">En justice</h3>
            <Gavel className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {legalStats.casesInCourt}
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Montant total</h3>
            <Landmark className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {legalStats.totalAmount.toLocaleString('fr-FR')} €
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Dont {legalStats.recoveredAmount.toLocaleString('fr-FR')} € recouvrés
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <h3 className="font-medium mb-4">Dossiers urgents</h3>
          <div className="space-y-3">
            {legalCases
              .filter(c => c.overdueDays > 90)
              .sort((a, b) => b.overdueDays - a.overdueDays)
              .slice(0, 3)
              .map(legalCase => (
                <div key={legalCase.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{legalCase.tenant.name}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {legalCase.tenant.property}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600 dark:text-red-400">
                        {legalCase.unpaidAmount.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {legalCase.overdueDays} jours de retard
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button 
            onClick={() => setActiveTab('cases')}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir tous les dossiers →
          </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <h3 className="font-medium mb-4">Prochaines échéances</h3>
          <div className="space-y-3">
            {legalCases
              .filter(c => c.nextActionDate)
              .sort((a, b) => new Date(a.nextActionDate!).getTime() - new Date(b.nextActionDate!).getTime())
              .slice(0, 3)
              .map(legalCase => (
                <div key={legalCase.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{legalCase.tenant.name}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {legalCase.lastAction.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {legalCase.nextActionDate}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {legalCase.status === 'assignation' ? 'Audience' : 
                         legalCase.status === 'mise_en_demeure' ? 'Délai expiration' : 
                         'Prochaine étape'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button 
            onClick={() => setActiveTab('calendar')}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir le calendrier complet →
          </button>
        </div>
      </div>
    </div>
  );

  const renderCasesTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Gestion des Dossiers Contentieux</h2>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full bg-white dark:bg-neutral-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="border rounded-lg px-4 py-2 bg-white dark:bg-neutral-800"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pre_contentieux">Pré-contentieux</option>
            <option value="mise_en_demeure">Mise en demeure</option>
            <option value="assignation">Assignation</option>
            <option value="jugement">Jugement</option>
            <option value="recouvrement">Recouvrement</option>
            <option value="clos">Clos</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Montant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Retard</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {filteredCases.map(legalCase => (
              <tr key={legalCase.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                <td className="px-4 py-3">
                  <div className="font-medium">{legalCase.tenant.name}</div>
                  {legalCase.tenant.ssn && (
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {legalCase.tenant.ssn}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{legalCase.tenant.property}</td>
                <td className="px-4 py-3 font-medium text-red-600 dark:text-red-400">
                  {legalCase.unpaidAmount.toLocaleString('fr-FR')} €
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-red-500" />
                    {legalCase.overdueDays} jours
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    legalCase.status === 'pre_contentieux' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                    legalCase.status === 'mise_en_demeure' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    legalCase.status === 'assignation' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    legalCase.status === 'jugement' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    legalCase.status === 'recouvrement' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {legalCase.status === 'pre_contentieux' ? 'Pré-contentieux' :
                     legalCase.status === 'mise_en_demeure' ? 'Mise en demeure' :
                     legalCase.status === 'assignation' ? 'Assignation' :
                     legalCase.status === 'jugement' ? 'Jugement' :
                     legalCase.status === 'recouvrement' ? 'Recouvrement' : 'Clos'}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Détails
                  </button>
                  <button className="text-gray-600 dark:text-gray-400 hover:underline text-sm">
                    Documents
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Calendrier Contentieux</h2>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Août 2024</h3>
          <div className="flex space-x-2">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Aujourd&apos;hui
            </button>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-neutral-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const dayCases = legalCases.filter(c => 
              c.nextActionDate && new Date(c.nextActionDate).getDate() === day
            );
            
            return (
              <div 
                key={index} 
                className={`min-h-24 p-1 border rounded ${
                  dayCases.length > 0 ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                }`}
              >
                <div className="text-right text-sm mb-1">{day}</div>
                {dayCases.map(legalCase => (
                  <div 
                    key={legalCase.id} 
                    className="text-xs p-1 mb-1 bg-blue-100 dark:bg-blue-800 rounded truncate"
                    title={`${legalCase.tenant.name} - ${legalCase.lastAction.type}`}
                  >
                    {legalCase.tenant.name.split(' ')[0]} - {legalCase.lastAction.type}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 mt-4">
        <h3 className="font-medium mb-4">Échéances à venir</h3>
        <div className="space-y-3">
          {legalCases
            .filter(c => c.nextActionDate)
            .sort((a, b) => new Date(a.nextActionDate!).getTime() - new Date(b.nextActionDate!).getTime())
            .slice(0, 5)
            .map(legalCase => (
              <div key={legalCase.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{legalCase.tenant.name}</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {legalCase.tenant.property}
                    </p>
                    <p className="text-sm mt-1">{legalCase.lastAction.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {legalCase.nextActionDate}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                      legalCase.status === 'assignation' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {legalCase.status === 'assignation' ? 'Audience' : 'Échéance'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
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
          Tableau de Bord Contentieux
        </h1>
        
        <div className="mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Dossiers
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Calendrier
            </button>
          </nav>
        </div>
        
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'cases' && renderCasesTab()}
        {activeTab === 'calendar' && renderCalendarTab()}
      </main>
    </div>
  );
}