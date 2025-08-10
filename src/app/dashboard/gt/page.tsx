'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Building, Users, ClipboardList, FileText,
  Mail, CalendarDays, CreditCard, Settings, 
  ChevronLeft, ChevronRight, CheckCircle2,
  AlertCircle, Clock, FileUp, Send, Save, X, Hammer, Files, FileSearch, FileEdit, ClipboardCheck
} from 'lucide-react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

// Sidebar Component
const Sidebar = ({ isExpanded, toggleSidebar }: { 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}) => {
  
  
  const sidebarItems = [
    { 
        icon: Home, 
        label: 'Tableau de Bord', 
        href: '/dashboard/gt' ,
        active: true
    },
    { 
        icon: FileSearch, 
        label: 'Analyse EDL (IA)', 
        href: '/pages/gt/analyseEDLDiagnosticIA' 
    },
    { 
        icon: FileSearch, 
        label: 'Analyse Pré-EDL (IA)', 
        href: '/pages/gt/analysePreEDLDiagnosticIA' 
    },
    { 
        icon: ClipboardCheck, 
        label: 'EDLs', 
        href: '/pages/gt/EDLs' 
    },
    { 
        icon: FileEdit, 
        label: 'Formulaire Pré-EDL', 
        href: '/pages/gt/formulairPreEDL' 
    },
    { 
        icon: Files, 
        label: 'Pré-EDLs', 
        href: '/pages/gt/preEDLs' 
    },
    { 
        icon: Hammer, 
        label: 'Travaux', 
        href: '/pages/gt/travaux' 
    },
    { 
        icon: Settings, 
        label: 'Paramètres', 
        href: '/pages/gt/parametres' 
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
          Gestion Technique
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

// Types for Technical Intervention
interface Intervention {
  id: number;
  property: string;
  type: 'plumbing' | 'electrical' | 'structural' | 'maintenance';
  status: 'pending' | 'in_progress' | 'completed' | 'urgent';
  description: string;
  reportedDate: string;
  completedDate?: string;
}

export default function GTDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: 1,
      property: 'Apt 305, Résidence Lumière',
      type: 'plumbing',
      status: 'pending',
      description: 'Fuite dans la salle de bain',
      reportedDate: '2024-07-15'
    },
    {
      id: 2,
      property: 'Apt 102, Résidence Soleil',
      type: 'electrical',
      status: 'urgent',
      description: 'Problème de court-circuit',
      reportedDate: '2024-07-10'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Compute card statistics
  const stats = {
    reported: interventions.length,
    pending: interventions.filter(i => i.status === 'pending').length,
    urgent: interventions.filter(i => i.status === 'urgent').length,
    completed: interventions.filter(i => i.status === 'completed').length
  };

  const renderStatusBadge = (status: Intervention['status']) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'urgent': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
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
          Tableau de Gestion Technique
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Interventions', value: stats.reported },
            { label: 'En Attente', value: stats.pending },
            { label: 'Urgents', value: stats.urgent },
            { label: 'Terminés', value: stats.completed }
          ].map((card, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-gray-600 dark:text-neutral-400 mb-2">{card.label}</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Interventions Table Section */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">Liste des Interventions</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Intervention
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Propriété</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Type</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Statut</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Description</th>
                <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Date Signalement</th>
                <th className="p-3 text-center text-gray-600 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map(intervention => (
                <tr key={intervention.id} className="border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <td className="p-3 text-gray-800 dark:text-neutral-200">{intervention.property}</td>
                  <td className="p-3 text-gray-600 dark:text-neutral-400">{intervention.type}</td>
                  <td className="p-3">{renderStatusBadge(intervention.status)}</td>
                  <td className="p-3 text-gray-800 dark:text-neutral-200">{intervention.description}</td>
                  <td className="p-3 text-gray-600 dark:text-neutral-400">{intervention.reportedDate}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Adding Intervention */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-[600px] shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-neutral-200">Nouvelle Intervention</h2>
              <form className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-neutral-300">Propriété</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200" 
                    placeholder="Adresse du logement" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-neutral-300">Type d'Intervention</label>
                  <select 
                    className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                  >
                    <option value="plumbing">Plomberie</option>
                    <option value="electrical">Électricité</option>
                    <option value="structural">Structure</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-gray-700 dark:text-neutral-300">Description</label>
                  <textarea 
                    className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200" 
                    placeholder="Détails de l'intervention"
                    rows={3}
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-neutral-300">Date de Signalement</label>
                  <input 
                    type="date" 
                    className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200" 
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 dark:text-neutral-300">Statut</label>
                  <select 
                    className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                  >
                    <option value="pending">En Attente</option>
                    <option value="in_progress">En Cours</option>
                    <option value="completed">Terminé</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="col-span-2 flex justify-end space-x-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}