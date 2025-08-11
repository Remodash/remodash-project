'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home, FileText, ClipboardCheck, 
  Building, Users,  Settings,
  ChevronLeft, ChevronRight, Mail, CalendarDays,
  CheckCircle, AlertCircle, Plus,
  X, User, Search, Send, Wallet, Calendar
} from 'lucide-react';

// Types principaux
interface Tenant {
  id: string;
  name: string;
  contact: string;
  email: string;
  emergencyContact: string;
}

interface Property {
  id: string;
  address: string;
  building: string;
  floor: string;
  doorNumber: string;
  type: string;
  surface: number;
}

interface LeaveNotice {
  id: string;
  noticeId: string;
  tenant: Tenant;
  property: Property;
  status: 'received' | 'processed' | 'litigation' | 'completed';
  noticeDate: string;
  leaveDate: string;
  receptionDate: string;
  noticeType: 'letter' | 'email' | 'in_person';
  acknowledgmentReceipt: boolean;
  pendingPayments: boolean;
  comments?: string;
  sentTo?: {
    contentieux?: boolean;
    comptabilite?: boolean;
    gardien?: boolean;
    gestionnaireTechnique?: boolean;
  };
}

// Composants
const Sidebar = ({ isExpanded, toggleSidebar }: { isExpanded: boolean, toggleSidebar: () => void }) => {
  const sidebarItems = [
    { 
        icon: Home, 
        label: 'Tableau de bord', 
        href: '/dashboard/gl' 
    },
    { 
        icon: Users, 
        label: 'Locataires', 
        href: '/dashboard/gl/locataires' 
    },
    { 
        icon: Building, 
        label: 'Propriétés', 
        href: '/dashboard/gl/proprietes' 
    },
    { 
        icon: Wallet, 
        label: 'Finances', 
        href: '/dashboard/gl/finances' 
    },
    { 
        icon: Calendar, 
        label: 'Congés', 
        href: '/dashboard/gl/conges' 
    },
    { 
        icon: Settings, 
        label: 'Paramètres', 
        href: '/dashboard/gl/parametres' 
    }
];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Remodash GL
        </h1>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 py-4">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href} 
            className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              item.label === 'Tableau de Bord' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''
            }`}
          >
            <item.icon className="mr-4" />
            <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const LeaveNoticeCard = ({ notice, onClick }: { notice: LeaveNotice, onClick: () => void }) => {
  const getStatusColor = () => {
    switch(notice.status) {
      case 'received': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'litigation': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getNoticeTypeIcon = () => {
    switch(notice.noticeType) {
      case 'letter': return <FileText className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'in_person': return <User className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center">
            {getNoticeTypeIcon()}
            <span className="ml-2">{notice.tenant.name}</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notice.property.address}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {notice.status === 'received' ? 'Reçu' : 
           notice.status === 'processed' ? 'Traité' : 
           notice.status === 'litigation' ? 'Litige' : 'Terminé'}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(notice.leaveDate).toLocaleDateString()}
          </span>
        </div>
        {notice.pendingPayments && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
            Impayés
          </span>
        )}
      </div>
    </div>
  );
};

const LeaveNoticeModal = ({ 
  notice, 
  onClose, 
  onSendToServices
}: { 
  notice: LeaveNotice, 
  onClose: () => void, 
  onSendToServices: () => void 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Détails déclaration - {notice.noticeId}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Informations locataire</h3>
              <p>{notice.tenant.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {notice.tenant.id} | Contact: {notice.tenant.contact}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Email: {notice.tenant.email}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Informations logement</h3>
              <p>{notice.property.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {notice.property.building}, {notice.property.floor}, Porte {notice.property.doorNumber}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Type: {notice.property.type} | Surface: {notice.property.surface}m²
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Dates</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Notification: {new Date(notice.noticeDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Départ: {new Date(notice.leaveDate).toLocaleDateString()}</span>
                </div>
                {notice.receptionDate && (
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>Réception AR: {new Date(notice.receptionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Statut et notifications</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {notice.noticeType === 'letter' ? 'Courrier' : notice.noticeType === 'email' ? 'Email' : 'En personne'}</p>
                <p><span className="font-medium">AR:</span> {notice.acknowledgmentReceipt ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Impayés:</span> {notice.pendingPayments ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Envoyé à:</span> 
                  {notice.sentTo?.contentieux && ' Contentieux,'}
                  {notice.sentTo?.comptabilite && ' Comptabilité,'}
                  {notice.sentTo?.gardien && ' Gardien,'}
                  {notice.sentTo?.gestionnaireTechnique && ' Gestionnaire Technique'}
                  {!notice.sentTo?.contentieux && !notice.sentTo?.comptabilite && 
                   !notice.sentTo?.gardien && !notice.sentTo?.gestionnaireTechnique && ' Aucun service'}
                </p>
              </div>
            </div>
          </div>

          {notice.comments && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Commentaires</h3>
              <p className="border rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-700">{notice.comments}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onSendToServices}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              disabled={notice.status === 'completed'}
            >
              <Send className="h-5 w-5 mr-2" />
              Envoyer aux services
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GLDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<LeaveNotice | null>(null);
  const [filter, setFilter] = useState<'all' | 'received' | 'processed' | 'litigation'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const [leaveNotices, setLeaveNotices] = useState<LeaveNotice[]>([
    {
      id: '1',
      noticeId: '2024-001',
      tenant: {
        id: 'T1001',
        name: 'Jean Dupont',
        contact: '06 12 34 56 78',
        email: 'jean.dupont@example.com',
        emergencyContact: 'Marie Dupont - 06 98 76 54 32'
      },
      property: {
        id: 'prop-1',
        address: '12 Rue de la Paix, 75002 Paris',
        building: 'Bâtiment A',
        floor: '3ème étage',
        doorNumber: '12',
        type: 'T2',
        surface: 45
      },
      status: 'processed',
      noticeDate: new Date().toISOString(),
      leaveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      receptionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      noticeType: 'letter',
      acknowledgmentReceipt: true,
      pendingPayments: false,
      sentTo: {
        gardien: true,
        gestionnaireTechnique: true
      }
    },
    {
  id: '2',
  noticeId: '2024-002',
  tenant: {
    id: 'T1002',
    name: 'Marie Dubois',
    contact: '06 87 65 43 21',
    email: 'marie.dubois@example.com',
    emergencyContact: 'Pierre Dubois - 06 12 34 56 78'
  },
  property: {
    id: 'prop-2',
    address: '24 Avenue des Champs, 75008 Paris',
    building: 'Bâtiment B',
    floor: 'RDC',
    doorNumber: '5',
    type: 'T3',
    surface: 72
  },
  status: 'litigation',
  noticeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  leaveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  receptionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ajout de cette ligne
  noticeType: 'email',
  acknowledgmentReceipt: false,
  pendingPayments: true,
  comments: 'Impayés à régulariser',
  sentTo: {
    contentieux: true,
    comptabilite: true,
    gardien: true,
    gestionnaireTechnique: true
  }
}
  ]);

  const filteredNotices = leaveNotices.filter(notice => {
    // Filtre par statut
    if (filter !== 'all' && notice.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        notice.tenant.name.toLowerCase().includes(term) ||
        notice.property.address.toLowerCase().includes(term) ||
        notice.noticeId.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const handleSendToServices = (notice: LeaveNotice) => {
  const updatedNotice: LeaveNotice = {
    ...notice,
    sentTo: {
      ...notice.sentTo,
      contentieux: notice.pendingPayments ? true : (notice.sentTo?.contentieux ?? false),
      comptabilite: notice.pendingPayments ? true : (notice.sentTo?.comptabilite ?? false),
      gardien: true,
      gestionnaireTechnique: true
    },
    status: notice.pendingPayments ? 'litigation' as const : 'processed' as const
  };

  setLeaveNotices(leaveNotices.map(n =>
    n.id === notice.id ? updatedNotice : n
  ));
  setSelectedNotice(updatedNotice);
};
  // Statistiques
  const stats = {
    total: leaveNotices.length,
    received: leaveNotices.filter(n => n.status === 'received').length,
    processed: leaveNotices.filter(n => n.status === 'processed').length,
    litigation: leaveNotices.filter(n => n.status === 'litigation').length,
    withPayments: leaveNotices.filter(n => n.pendingPayments).length
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Home className="h-8 w-8 mr-3" />
            Tableau de bord Gestion Locative
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total déclarations</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.total}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {stats.received}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.received}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">En litige</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {stats.litigation}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.litigation}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avec impayés</h3>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
                {stats.withPayments}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.withPayments}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
  <a 
    href="/pages/gl/conges" 
    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 no-underline"
  >
    <Plus className="h-5 w-5 mr-2" />
    Nouvelle déclaration
  </a>
</div>

        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <ClipboardCheck className="h-4 w-4 mr-1" />
            Tous
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'received' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <Mail className="h-4 w-4 mr-1" />
            Reçus
          </button>
          <button
            onClick={() => setFilter('processed')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'processed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Traités
          </button>
          <button
            onClick={() => setFilter('litigation')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'litigation' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Litiges
          </button>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map(notice => (
              <LeaveNoticeCard 
                key={notice.id} 
                notice={notice} 
                onClick={() => setSelectedNotice(notice)}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center col-span-full">
              <FileText className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-lg font-medium">Aucune déclaration trouvée</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? "Aucune déclaration ne correspond à votre recherche" 
                  : `Vous n'avez aucune déclaration ${filter === 'received' ? 'reçue' : filter === 'processed' ? 'traitée' : 'en litige'}`}
              </p>
            </div>
          )}
        </div>

        
      </main>

      {selectedNotice && (
        <LeaveNoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onSendToServices={() => handleSendToServices(selectedNotice)}
        />
      )}
    </div>
  );
};

export default GLDashboard;