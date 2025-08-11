'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileUp, CreditCard, ClipboardCheck, Hammer
} from 'lucide-react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon
} from '@heroicons/react/24/outline';

// Types pour les diagnostics
interface Diagnostic {
  id: number;
  property: string;
  diagnosticType: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'late';
  deadline: string;
  scheduledDate?: string;
  completedDate?: string;
  address: string;
  contactPerson: string;
  accessDetails: string;
  reports?: string[];
}

// Sidebar Component adapté pour PD
const Sidebar = ({ isExpanded, toggleSidebar }: { 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}) => {
  
  
  const sidebarItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/pd' },
    { icon: Hammer, label: 'Diagnostics à Réaliser', href: '/pages/pd/diagnosticsARealiser' },
    { icon: ClipboardCheck, label: 'Historique', href: '/pages/pd/historique' },
    { icon: CreditCard, label: 'Facturation', href: '/pages/pd/facturation' },
    { icon: Settings, label: 'Paramètres', href: '/pages/pd/parametres' }
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

export default function PDDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([
    {
      id: 1,
      property: 'Apt 305, Résidence Lumière',
      diagnosticType: 'DPE',
      status: 'pending',
      deadline: '2024-08-15',
      address: '12 Rue de la République, 75001 Paris',
      contactPerson: 'Jean Dupont - 06 12 34 56 78',
      accessDetails: 'Clés à récupérer chez le gardien, badge nécessaire pour ascenseur'
    },
    {
      id: 2,
      property: 'Apt 102, Résidence Soleil',
      diagnosticType: 'Amiante',
      status: 'scheduled',
      deadline: '2024-08-10',
      scheduledDate: '2024-08-05',
      address: '45 Avenue des Champs, 75008 Paris',
      contactPerson: 'Marie Martin - 07 89 12 34 56',
      accessDetails: 'Digicode #1234, clés dans boîte à clés sécurisée'
    },
    {
      id: 3,
      property: 'Apt 201, Résidence Étoile',
      diagnosticType: 'Plomb',
      status: 'in_progress',
      deadline: '2024-08-12',
      scheduledDate: '2024-08-03',
      address: '78 Boulevard Voltaire, 75011 Paris',
      contactPerson: 'Pierre Durand - 06 45 78 12 34',
      accessDetails: 'Gardien présent de 8h à 18h, parking disponible'
    },
    {
      id: 4,
      property: 'Apt 503, Résidence Ciel',
      diagnosticType: 'Électricité',
      status: 'completed',
      deadline: '2024-07-30',
      scheduledDate: '2024-07-25',
      completedDate: '2024-07-28',
      address: '32 Rue de Rivoli, 75004 Paris',
      contactPerson: 'Sophie Lambert - 06 98 76 54 32',
      accessDetails: 'Interphone #503, accès libre',
      reports: ['Rapport_Électricité_503_Ciel.pdf']
    },
    {
      id: 5,
      property: 'Apt 108, Résidence Terre',
      diagnosticType: 'Gaz',
      status: 'late',
      deadline: '2024-07-28',
      scheduledDate: '2024-07-20',
      address: '15 Rue de la Paix, 75002 Paris',
      contactPerson: 'Lucie Bernard - 07 65 43 21 09',
      accessDetails: 'Accès par l&apos;arrière du bâtiment, code porte 1987'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Statistiques pour les cartes
  const stats = {
    total: diagnostics.length,
    pending: diagnostics.filter(d => d.status === 'pending').length,
    inProgress: diagnostics.filter(d => d.status === 'in_progress').length,
    completed: diagnostics.filter(d => d.status === 'completed').length,
    late: diagnostics.filter(d => d.status === 'late').length
  };

  const renderStatusBadge = (status: Diagnostic['status']) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4 mr-1" /> },
      'scheduled': { color: 'bg-blue-100 text-blue-800', icon: <Calendar className="h-4 w-4 mr-1" /> },
      'in_progress': { color: 'bg-purple-100 text-purple-800', icon: <FileText className="h-4 w-4 mr-1" /> },
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 mr-1" /> },
      'late': { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 mr-1" /> }
    };

    const text = {
      'pending': 'En attente',
      'scheduled': 'Planifié',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'late': 'En retard'
    };

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${statusConfig[status].color}`}>
        {statusConfig[status].icon}
        {text[status]}
      </span>
    );
  };

  const handleViewDetails = (diagnostic: Diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setIsModalOpen(true);
  };

  const handleCompleteDiagnostic = (id: number) => {
    setDiagnostics(diagnostics.map(d => 
      d.id === id ? { ...d, status: 'completed', completedDate: new Date().toISOString().split('T')[0] } : d
    ));
    setIsModalOpen(false);
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-neutral-200">
          Tableau de Bord prestataire de diagnostique
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Diagnostics', value: stats.total, color: 'bg-blue-100 text-blue-800' },
            { label: 'En Attente', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'En Cours', value: stats.inProgress, color: 'bg-purple-100 text-purple-800' },
            { label: 'Terminés', value: stats.completed, color: 'bg-green-100 text-green-800' },
            { label: 'En Retard', value: stats.late, color: 'bg-red-100 text-red-800' }
          ].map((card, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-gray-600 dark:text-neutral-400 mb-2">{card.label}</h3>
              <p className={`text-3xl font-bold ${card.color.split(' ')[1]}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Diagnostics Table Section */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Diagnostics à réaliser</h2>
            <div className="flex space-x-2">
              <button className="flex items-center bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors">
                <Calendar className="h-5 w-5 mr-2" />
                Calendrier
              </button>
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                <FileUp className="h-5 w-5 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Propriété</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Type Diagnostic</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Statut</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Date Limite</th>
                <th className="p-3 text-center text-gray-600 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.map(diagnostic => (
                <tr 
                  key={diagnostic.id} 
                  className="border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <td className="p-3 text-gray-800 dark:text-neutral-200">
                    <div className="font-medium">{diagnostic.property}</div>
                    <div className="text-sm text-gray-500 dark:text-neutral-400">{diagnostic.address}</div>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-neutral-400">{diagnostic.diagnosticType}</td>
                  <td className="p-3">{renderStatusBadge(diagnostic.status)}</td>
                  <td className="p-3 text-gray-600 dark:text-neutral-400">
                    {diagnostic.deadline}
                    {diagnostic.status === 'late' && (
                      <span className="ml-2 text-xs text-red-500">(retard)</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button 
                      onClick={() => handleViewDetails(diagnostic)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {diagnostic.status === 'completed' ? (
                      <span className="text-gray-400 dark:text-neutral-500">
                        <CheckCircle className="h-5 w-5" />
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleCompleteDiagnostic(diagnostic.id)}
                        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <FileUp className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Diagnostic Details */}
        {isModalOpen && selectedDiagnostic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-neutral-200">
                Détails du Diagnostic - {selectedDiagnostic.property}
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Informations Générales</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> {selectedDiagnostic.diagnosticType}</p>
                    <p><span className="font-medium">Statut:</span> {renderStatusBadge(selectedDiagnostic.status)}</p>
                    <p><span className="font-medium">Date Limite:</span> {selectedDiagnostic.deadline}</p>
                    {selectedDiagnostic.scheduledDate && (
                      <p><span className="font-medium">Date Planifiée:</span> {selectedDiagnostic.scheduledDate}</p>
                    )}
                    {selectedDiagnostic.completedDate && (
                      <p><span className="font-medium">Date Réalisation:</span> {selectedDiagnostic.completedDate}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Accès au Logement</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Adresse:</span> {selectedDiagnostic.address}</p>
                    <p><span className="font-medium">Contact:</span> {selectedDiagnostic.contactPerson}</p>
                    <p><span className="font-medium">Modalités d&apos;accès:</span> {selectedDiagnostic.accessDetails}</p>
                  </div>
                </div>
              </div>

              {selectedDiagnostic.diagnosticType === 'DPE' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Informations DPE</h3>
                  <p className="text-gray-600 dark:text-neutral-400">
                    Le Diagnostic de Performance Énergétique doit être réalisé selon les normes en vigueur.
                    Pensez à vérifier la surface habitable, les équipements de chauffage et les isolations.
                  </p>
                </div>
              )}

              {selectedDiagnostic.diagnosticType === 'Amiante' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Informations Amiante</h3>
                  <p className="text-gray-600 dark:text-neutral-400">
                    Vérification obligatoire pour les bâtiments construits avant juillet 1997.
                    Concentrez-vous sur les flocages, calorifugeages et faux plafonds.
                  </p>
                </div>
              )}

              {selectedDiagnostic.diagnosticType === 'Plomb' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Informations Plomb (CREP)</h3>
                  <p className="text-gray-600 dark:text-neutral-400">
                    Recherche de plomb dans les peintures pour les logements construits avant 1949.
                    Vérifiez particulièrement les peintures écaillées ou dégradées.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-neutral-300">Documents à fournir</h3>
                <div className="border rounded-lg p-4 dark:border-neutral-700">
                  {selectedDiagnostic.reports && selectedDiagnostic.reports.length > 0 ? (
                    <div>
                      {selectedDiagnostic.reports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                          <span className="text-blue-500 dark:text-blue-400">{report}</span>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-neutral-400 italic">Aucun document joint</p>
                  )}
                  <button className="mt-2 flex items-center text-blue-500 dark:text-blue-400">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Ajouter un document
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600"
                >
                  Fermer
                </button>
                {selectedDiagnostic.status !== 'completed' && (
                  <button 
                    onClick={() => handleCompleteDiagnostic(selectedDiagnostic.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Marquer comme Terminé
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}