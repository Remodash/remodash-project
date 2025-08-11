'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, ClipboardList, Camera, FileText, 
  CheckCircle, AlertCircle, Clock, Settings,
  ChevronLeft, ChevronRight, Wrench, Paintbrush,
  Droplet, Plug, DoorOpen, Lock, Fan, Sparkles,
  HardHat, Calendar, Upload, X
} from 'lucide-react';

// Types principaux
interface Property {
  id: string;
  address: string;
  building: string;
  floor: string;
  doorNumber: string;
  type: string;
  surface: number;
}

interface WorkOrder {
  id: string;
  orderId: string;
  property: Property;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  description: string;
  tasks: {
    id: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
  }[];
  diagnostics?: {
    type: string;
    required: boolean;
    completed: boolean;
  }[];
  photos?: string[];
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
}

interface PreEDLTask {
  id: string;
  room: string;
  elements: {
    name: string;
    condition: 'good' | 'damaged' | 'missing';
    notes: string;
    photo?: string;
  }[];
  meters?: {
    type: 'water' | 'electricity' | 'gas';
    value: number;
    photo?: string;
  }[];
}

// Composants
const Sidebar = ({ isExpanded, toggleSidebar }: { isExpanded: boolean, toggleSidebar: () => void }) => {
  const menuItems = [
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
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-white transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Remodash GA
        </h1>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${item.label === 'Tableau de bord' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}`}>
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

const WorkOrderCard = ({ workOrder, onClick }: { workOrder: WorkOrder, onClick: () => void }) => {
  const progress = Math.round(
    (workOrder.tasks.filter(t => t.status === 'done').length / workOrder.tasks.length) * 100
  );

  const getStatusColor = () => {
    switch(workOrder.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getWorkTypeIcon = () => {
    switch(workOrder.type) {
      case 'peinture': return <Paintbrush className="h-5 w-5" />;
      case 'plomberie': return <Droplet className="h-5 w-5" />;
      case 'électricité': return <Plug className="h-5 w-5" />;
      case 'menuiserie': return <DoorOpen className="h-5 w-5" />;
      case 'serrurerie': return <Lock className="h-5 w-5" />;
      case 'VMC': return <Fan className="h-5 w-5" />;
      case 'nettoyage': return <Sparkles className="h-5 w-5" />;
      case 'gros œuvre': return <HardHat className="h-5 w-5" />;
      default: return <Wrench className="h-5 w-5" />;
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
            {getWorkTypeIcon()}
            <span className="ml-2">BT-{workOrder.orderId}</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {workOrder.property.address}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {workOrder.status === 'pending' ? 'En attente' : 
           workOrder.status === 'in_progress' ? 'En cours' : 
           workOrder.status === 'completed' ? 'Terminé' : 'Annulé'}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Avancement</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(workOrder.startDate).toLocaleDateString()}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {workOrder.tasks.filter(t => t.status === 'done').length}/{workOrder.tasks.length} tâches
        </span>
      </div>
    </div>
  );
};

const PreEDLTaskCard = ({ task }: { task: PreEDLTask }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="font-medium mb-2">{task.room}</h3>
      <div className="space-y-3">
        {task.elements.map((element, idx) => (
          <div key={idx} className="flex items-start">
            <div className={`w-3 h-3 rounded-full mt-1 mr-2 ${
              element.condition === 'good' ? 'bg-green-500' : 
              element.condition === 'damaged' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <p>{element.name}</p>
              {element.notes && <p className="text-sm text-gray-500 dark:text-gray-400">{element.notes}</p>}
            </div>
            {element.photo && (
              <button className="text-blue-600 dark:text-blue-400 text-sm">
                Voir photo
              </button>
            )}
          </div>
        ))}
        {task.meters && task.meters.map((meter, idx) => (
          <div key={`meter-${idx}`} className="flex items-center text-sm">
            <span className="font-medium mr-2">
              {meter.type === 'water' ? 'Eau' : meter.type === 'electricity' ? 'Électricité' : 'Gaz'}:
            </span>
            <span>{meter.value}</span>
            {meter.photo && (
              <button className="ml-auto text-blue-600 dark:text-blue-400 text-sm">
                Voir photo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyReportModal = ({ 
  workOrder, 
  onClose, 
  onSubmit 
}: { 
  workOrder: WorkOrder, 
  onClose: () => void, 
  onSubmit: (report: { progress: number, notes: string, photos: string[] }) => void 
}) => {
  const [progress, setProgress] = useState(
    workOrder.dailyReports?.[workOrder.dailyReports.length - 1]?.progress || 
    Math.round((workOrder.tasks.filter(t => t.status === 'done').length / workOrder.tasks.length) * 100
  ));
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit({
      progress,
      notes,
      photos
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Rapport quotidien - BT-{workOrder.orderId}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Avancement (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                rows={3}
                placeholder="Décrivez l'avancement, les problèmes rencontrés..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Photos</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Glissez-déposez vos photos ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                      setPhotos([...photos, ...newPhotos]);
                    }
                  }}
                />
              </div>
              {photos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <Image src={photo} alt={`Photo ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuardDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  //const [selectedPreEDL, setSelectedPreEDL] = useState<PreEDLTask[] | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('in_progress');

  // Données simulées
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: '1',
      orderId: '2023-001',
      property: {
        id: 'prop-1',
        address: '12 Rue de la Paix, 75002 Paris',
        building: 'Bâtiment A',
        floor: '3ème étage',
        doorNumber: '12',
        type: 'T2',
        surface: 45
      },
      type: 'peinture',
      status: 'in_progress',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Remise en état peinture complète',
      tasks: [
        { id: '1', description: 'Préparation des murs', status: 'done' },
        { id: '2', description: 'Peinture plafonds', status: 'in_progress' },
        { id: '3', description: 'Peinture murs', status: 'todo' },
        { id: '4', description: 'Nettoyage finition', status: 'todo' }
      ],
      dailyReports: [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          progress: 25,
          notes: 'Préparation des murs terminée, début peinture plafonds',
          photos: []
        }
      ]
    },
    {
      id: '2',
      orderId: '2023-002',
      property: {
        id: 'prop-2',
        address: '24 Avenue des Champs, 75008 Paris',
        building: 'Bâtiment B',
        floor: 'RDC',
        doorNumber: '5',
        type: 'T3',
        surface: 72
      },
      type: 'plomberie',
      status: 'pending',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Réparation fuite chaudière',
      tasks: [
        { id: '1', description: 'Diagnostic fuite', status: 'todo' },
        { id: '2', description: 'Remplacement joint', status: 'todo' }
      ]
    }
  ]);

  const [preEDLTasks] = useState<PreEDLTask[]>([
    {
      id: 'pre-1',
      room: 'Séjour',
      elements: [
        { name: 'Mur nord', condition: 'damaged', notes: 'Trous à reboucher', photo: 'url-photo-1' },
        { name: 'Sol', condition: 'good', notes: '' },
        { name: 'Fenêtre', condition: 'damaged', notes: 'Joint à changer' }
      ],
      meters: [
        { type: 'electricity', value: 45210, photo: 'url-photo-2' }
      ]
    },
    {
      id: 'pre-2',
      room: 'Cuisine',
      elements: [
        { name: 'Plan de travail', condition: 'good', notes: '' },
        { name: 'Évier', condition: 'damaged', notes: 'Robinet qui fuit' }
      ]
    }
  ]);

  const filteredWorkOrders = workOrders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    return true;
  });

  const handleSubmitDailyReport = (report: { progress: number, notes: string, photos: string[] }) => {
    if (!selectedWorkOrder) return;

    const updatedOrder: WorkOrder = {
      ...selectedWorkOrder,
      dailyReports: [
        ...(selectedWorkOrder.dailyReports || []),
        {
          date: new Date().toISOString(),
          progress: report.progress,
          notes: report.notes,
          photos: report.photos
        }
      ]
    };

    setWorkOrders(workOrders.map(order => 
      order.id === selectedWorkOrder.id ? updatedOrder : order
    ));
    setSelectedWorkOrder(updatedOrder);
    setShowReportModal(false);
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
            <ClipboardList className="h-8 w-8 mr-3" />
            Tableau de bord Gardien
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <FileText className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pré-EDL à faire</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                2
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">2</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Travaux en cours</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {workOrders.filter(o => o.status === 'in_progress').length}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {workOrders.filter(o => o.status === 'in_progress').length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rapports à faire</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                1
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">1</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total interventions</h3>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {workOrders.length}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">{workOrders.length}</p>
          </div>
        </div>

        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'in_progress' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <Clock className="h-4 w-4 mr-1" />
            En cours
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'pending' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            En attente
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Terminés
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <ClipboardList className="h-4 w-4 mr-1" />
            Tous
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Pré-EDL à réaliser
            </h2>
            {preEDLTasks.length > 0 ? (
              <div>
                {preEDLTasks.map(task => (
                  <PreEDLTaskCard key={task.id} task={task} />
                ))}
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Soumettre le Pré-EDL
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-lg font-medium">Aucun Pré-EDL à réaliser</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Vous n&apos;avez pas de Pré-État des Lieux programmé aujourd&apos;hui
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Travaux en cours
            </h2>
            {filteredWorkOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredWorkOrders.map(order => (
                  <WorkOrderCard 
                    key={order.id} 
                    workOrder={order} 
                    onClick={() => setSelectedWorkOrder(order)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-lg font-medium">Aucun travail en cours</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? "Vous n'avez aucun bon de travail" 
                    : `Vous n'avez aucun bon de travail ${filter === 'pending' ? 'en attente' : filter === 'in_progress' ? 'en cours' : 'terminé'}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedWorkOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Détails BT-{selectedWorkOrder.orderId}</h2>
                <button 
                  onClick={() => setSelectedWorkOrder(null)} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Informations logement</h3>
                  <p>{selectedWorkOrder.property.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedWorkOrder.property.building}, {selectedWorkOrder.property.floor}, Porte {selectedWorkOrder.property.doorNumber}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Dates</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Début: {new Date(selectedWorkOrder.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Fin prévue: {new Date(selectedWorkOrder.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p>{selectedWorkOrder.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Tâches</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedWorkOrder.tasks.filter(t => t.status === 'done').length}/{selectedWorkOrder.tasks.length} complétées
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedWorkOrder.tasks.map(task => (
                    <div key={task.id} className="flex items-center p-2 border rounded-lg">
                      <div className={`w-4 h-4 rounded-full mr-2 ${
                        task.status === 'done' ? 'bg-green-500' : 
                        task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <span className={`flex-1 ${task.status === 'done' ? 'line-through' : ''}`}>
                        {task.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedWorkOrder.dailyReports && selectedWorkOrder.dailyReports.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Rapports journaliers</h3>
                  <div className="space-y-4">
                    {selectedWorkOrder.dailyReports.map((report, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {report.progress}%
                          </span>
                        </div>
                        {report.notes && <p className="text-sm">{report.notes}</p>}
                        {report.photos.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {report.photos.map((photo, photoIdx) => (
                              <Image 
                                key={photoIdx} 
                                src={photo} 
                                alt={`Rapport ${idx + 1} - Photo ${photoIdx + 1}`} 
                                className="h-16 w-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter un rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportModal && selectedWorkOrder && (
        <DailyReportModal
          workOrder={selectedWorkOrder}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitDailyReport}
        />
      )}
    </div>
  );
};

export default GuardDashboard;