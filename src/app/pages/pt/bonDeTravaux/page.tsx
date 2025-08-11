'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  Hammer,
  ClipboardCheck,
  FileText,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  FileSearch,
  AlertTriangle,
  FileSignature,
  ClipboardList,
  Zap,
  CalendarCheck,
  Upload,
  Check,
  X,
  Camera,
  FileDigit,  
  FileArchive,
  FileImage,
  File,
  HardHat,
  Wrench,
  Paintbrush,
  Plug,
  Droplet,
  DoorOpen,
  Lock,
  Fan,
  Sparkles,
  ClipboardPenLine, 
  Save,
  Plus,
  Play
} from 'lucide-react';

interface WorkOrder {
  id: number;
  workOrderId: number;
  property: {
    address: string;
    type: string;
    surface: number;
  };
  workType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  technician: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  documents: {
    name: string;
    type: 'photo' | 'report' | 'invoice' | 'other';
    url: string;
    uploadedAt: string;
  }[];
  notes?: string;
  tasks: {
    id: number;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    materials?: string[];
  }[];
  penalties?: {
    amount: number;
    reason: string;
    status: 'pending' | 'applied' | 'disputed' | 'waived';
  }[];
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/contractor' },
    { icon: Hammer, label: 'Travaux à Réaliser', href: '/dashboard/contractor/work-orders' },
    { icon: ClipboardCheck, label: 'Historique', href: '/dashboard/contractor/history' },
    { icon: CreditCard, label: 'Facturation', href: '/dashboard/contractor/billing' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/contractor/settings' }
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
              ${item.label === 'Travaux à Réaliser' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const DocumentUploadModal: React.FC<{
  onClose: () => void;
  onUpload: (file: File, type: string) => void;
}> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'report' | 'photo' | 'invoice' | 'other'>('report');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        onUpload(file, documentType);
        setIsUploading(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Ajouter un document</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <X />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full p-2 border rounded-lg dark:bg-neutral-700"
              >
                <option value="report">Rapport</option>
                <option value="photo">Photo</option>
                <option value="invoice">Facture</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fichier</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {file ? file.name : 'Cliquez pour sélectionner un fichier'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                {isUploading ? 'Envoi en cours...' : 'Ajouter'}
                {!isUploading && <Upload className="h-5 w-5 ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkOrderDetailsModal: React.FC<{
  workOrder: WorkOrder;
  onClose: () => void;
  onSubmit: (workOrder: WorkOrder) => void;
  onStatusChange: (status: 'in_progress' | 'completed' | 'cancelled') => void;
}> = ({ workOrder, onClose, onSubmit, onStatusChange }) => {
  const [description, setDescription] = useState(workOrder.description || '');
  const [actualCost, setActualCost] = useState(workOrder.actualCost || 0);
  const [documents, setDocuments] = useState(workOrder.documents || []);
  const [notes, setNotes] = useState(workOrder.notes || '');
  const [tasks, setTasks] = useState(workOrder.tasks || []);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleUploadDocument = (file: File, type: string) => {
    // Simulate document upload
    const newDocument = {
      name: file.name,
      type: type as any,
      url: '#',
      uploadedAt: new Date().toISOString()
    };
    setDocuments([...documents, newDocument]);
  };

  const handleSubmit = () => {
    const updatedWorkOrder: WorkOrder = {
      ...workOrder,
      description,
      actualCost,
      documents,
      notes,
      tasks
    };
    onSubmit(updatedWorkOrder);
  };

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      case 'invoice': return <FileDigit className="h-4 w-4" />;
      case 'other': return <FileArchive className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getTaskIcon = (type: string) => {
    if (type.includes('électricité')) return <Plug className="h-4 w-4" />;
    if (type.includes('plomberie')) return <Droplet className="h-4 w-4" />;
    if (type.includes('peinture')) return <Paintbrush className="h-4 w-4" />;
    if (type.includes('menuiserie')) return <DoorOpen className="h-4 w-4" />;
    if (type.includes('serrurerie')) return <Lock className="h-4 w-4" />;
    if (type.includes('VMC')) return <Fan className="h-4 w-4" />;
    if (type.includes('nettoyage')) return <Sparkles className="h-4 w-4" />;
    return <Wrench className="h-4 w-4" />;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        description: newTask,
        status: 'todo'
      }]);
      setNewTask('');
    }
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'done' ? 'todo' : 'done'
        };
      }
      return task;
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Bon de Travail #{workOrder.workOrderId}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <X />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Informations du logement</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Référence:</span> BT-{workOrder.workOrderId}</p>
                <p><span className="font-medium">Adresse:</span> {workOrder.property.address}</p>
                <p><span className="font-medium">Type:</span> {workOrder.property.type} ({workOrder.property.surface}m²)</p>
                <p><span className="font-medium">Type de travaux:</span> {workOrder.workType}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Statut et dates</h3>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Statut:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  workOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  workOrder.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  workOrder.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {workOrder.status === 'pending' ? 'En attente' : 
                   workOrder.status === 'in_progress' ? 'En cours' : 
                   workOrder.status === 'completed' ? 'Terminé' : 'Annulé'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date de début:</span>
                  <input 
                    type="date" 
                    className="ml-2 p-1 border rounded dark:bg-neutral-700" 
                    defaultValue={workOrder.startDate.split('T')[0]}
                  />
                </div>
                <div className="flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date de fin:</span>
                  <input 
                    type="date" 
                    className="ml-2 p-1 border rounded dark:bg-neutral-700" 
                    defaultValue={workOrder.endDate.split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Description des travaux</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les travaux à réaliser..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Coûts</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Coût estimé</label>
                  <div className="flex items-center">
                    <span className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-l-lg">€</span>
                    <input 
                      type="number" 
                      value={workOrder.estimatedCost} 
                      readOnly
                      className="flex-1 p-2 border-t border-b border-r rounded-r-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Coût réel</label>
                  <div className="flex items-center">
                    <span className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-l-lg">€</span>
                    <input 
                      type="number" 
                      value={actualCost} 
                      onChange={(e) => setActualCost(Number(e.target.value))}
                      className="flex-1 p-2 border-t border-b border-r rounded-r-lg dark:bg-neutral-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Tâches à réaliser</h3>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Ajouter une tâche..."
                  className="flex-1 p-2 border rounded-l-lg dark:bg-neutral-700"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  className="px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`p-1 rounded-full mr-2 ${
                        task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 dark:bg-neutral-700'
                      }`}
                    >
                      {task.status === 'done' ? <Check className="h-4 w-4" /> : <span className="h-4 w-4 block" />}
                    </button>
                    <div className="flex-1 flex items-center">
                      {getTaskIcon(task.description)}
                      <span className={`ml-2 ${task.status === 'done' ? 'line-through text-gray-500 dark:text-neutral-400' : ''}`}>
                        {task.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Documents joints</h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
              >
                <Upload className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>
            
            {documents.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {documents.map((doc, index) => (
                  <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <div className="ml-2">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {new Date(doc.uploadedAt).toLocaleDateString()} - {doc.type}
                        </p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500 dark:text-neutral-400">
                <FileImage className="h-10 w-10 mx-auto mb-2" />
                <p>Aucun document joint</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Notes complémentaires</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes supplémentaires si nécessaire..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700"
              rows={2}
            />
          </div>

          {workOrder.penalties && workOrder.penalties.length > 0 && (
            <div className="mb-6 border border-red-200 dark:border-red-900 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <h3 className="font-medium text-lg mb-2 text-red-800 dark:text-red-200 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Pénalités
              </h3>
              <div className="space-y-3">
                {workOrder.penalties.map((penalty, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-neutral-700 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Montant: {penalty.amount}€ HT</span>
                      <span className={`text-sm ${
                        penalty.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                        penalty.status === 'applied' ? 'text-red-600 dark:text-red-400' :
                        penalty.status === 'disputed' ? 'text-blue-600 dark:text-blue-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {penalty.status === 'pending' ? 'En attente' : 
                         penalty.status === 'applied' ? 'Appliquée' : 
                         penalty.status === 'disputed' ? 'Contestée' : 'Annulée'}
                      </span>
                    </div>
                    <p className="text-sm mt-1">Raison: {penalty.reason}</p>
                    {penalty.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <button className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200">
                          Contester
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex space-x-3">
              {workOrder.status === 'pending' && (
                <button
                  onClick={() => onStatusChange('in_progress')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Démarrer les travaux
                </button>
              )}
              {workOrder.status === 'in_progress' && (
                <button
                  onClick={() => onStatusChange('completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Terminer les travaux
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadDocument}
        />
      )}
    </div>
  );
};

export default function ContractorWorkOrders() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      workOrderId: 2042,
      property: {
        address: '12 Rue de la Paix, 75002 Paris',
        type: 'T2',
        surface: 45
      },
      workType: 'Remise en état',
      status: 'pending',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      technician: 'Équipe A',
      description: 'Remise en état complète après départ locataire',
      estimatedCost: 1250,
      documents: [],
      tasks: [
        { id: 1, description: 'Peinture des murs', status: 'todo' },
        { id: 2, description: 'Remplacement robinetterie cuisine', status: 'todo' },
        { id: 3, description: 'Réparation parquet salon', status: 'todo' },
        { id: 4, description: 'Nettoyage complet', status: 'todo' }
      ]
    },
    {
      id: 2,
      workOrderId: 2043,
      property: {
        address: '24 Avenue des Champs, 75008 Paris',
        type: 'T3',
        surface: 72
      },
      workType: 'Plomberie',
      status: 'in_progress',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      technician: 'Équipe B',
      description: 'Réparation fuite chaudière et remplacement tuyauterie',
      estimatedCost: 850,
      actualCost: 920,
      documents: [
        {
          name: 'Devis plomberie.pdf',
          type: 'report',
          url: '#',
          uploadedAt: new Date().toISOString()
        }
      ],
      tasks: [
        { id: 1, description: 'Diagnostic fuite chaudière', status: 'done' },
        { id: 2, description: 'Remplacement joint chaudière', status: 'done' },
        { id: 3, description: 'Remplacement tuyauterie salle de bain', status: 'in_progress' },
        { id: 4, description: 'Test pression', status: 'todo' }
      ]
    },
    {
      id: 3,
      workOrderId: 2041,
      property: {
        address: '5 Boulevard Haussmann, 75009 Paris',
        type: 'Studio',
        surface: 28
      },
      workType: 'Électricité',
      status: 'completed',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      technician: 'Équipe C',
      description: 'Mise aux normes électriques',
      estimatedCost: 620,
      actualCost: 580,
      documents: [
        {
          name: 'Rapport électrique.pdf',
          type: 'report',
          url: '#',
          uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          name: 'Facture électricité.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      tasks: [
        { id: 1, description: 'Vérification tableau électrique', status: 'done' },
        { id: 2, description: 'Remplacement prises défectueuses', status: 'done' },
        { id: 3, description: 'Installation disjoncteurs différentiels', status: 'done' },
        { id: 4, description: 'Test sécurité', status: 'done' }
      ]
    },
    {
      id: 4,
      workOrderId: 2039,
      property: {
        address: '8 Rue de Rivoli, 75004 Paris',
        type: 'T4',
        surface: 85
      },
      workType: 'Gros œuvre',
      status: 'completed',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      technician: 'Équipe D',
      description: 'Réfection complète après sinistre eau',
      estimatedCost: 3500,
      actualCost: 4200,
      documents: [
        {
          name: 'Rapport travaux.pdf',
          type: 'report',
          url: '#',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          name: 'Photos avant travaux.jpg',
          type: 'photo',
          url: '#',
          uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          name: 'Photos après travaux.jpg',
          type: 'photo',
          url: '#',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          name: 'Facture finale.pdf',
          type: 'invoice',
          url: '#',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      penalties: [
        {
          amount: 150,
          reason: 'Retard de 3 jours sur le planning',
          status: 'applied'
        }
      ],
      tasks: [
        { id: 1, description: 'Démolition cloisons endommagées', status: 'done' },
        { id: 2, description: 'Assèchement et traitement anti-humidité', status: 'done' },
        { id: 3, description: 'Reconstruction cloisons', status: 'done' },
        { id: 4, description: 'Installation nouveau revêtement sol', status: 'done' },
        { id: 5, description: 'Peinture complète', status: 'done' }
      ]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleWorkOrderUpdate = (workOrder: WorkOrder) => {
    setWorkOrders(prev => 
      prev.map(item => 
        item.id === workOrder.id ? workOrder : item
      )
    );
    setSelectedWorkOrder(null);
  };

  const handleStatusChange = (status: 'in_progress' | 'completed' | 'cancelled') => {
    if (selectedWorkOrder) {
      const updatedWorkOrder = {
        ...selectedWorkOrder,
        status,
        endDate: status === 'completed' ? new Date().toISOString() : selectedWorkOrder.endDate
      };
      handleWorkOrderUpdate(updatedWorkOrder);
    }
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Filtre par statut
    if (filter !== 'all' && workOrder.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workOrder.property.address.toLowerCase().includes(term) ||
        workOrder.workType.toLowerCase().includes(term) ||
        workOrder.technician.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

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
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getWorkTypeIcon = (type: string) => {
    if (type.includes('électricité')) return <Zap className="h-5 w-5" />;
    if (type.includes('plomberie')) return <Droplet className="h-5 w-5" />;
    if (type.includes('peinture')) return <Paintbrush className="h-5 w-5" />;
    if (type.includes('menuiserie')) return <DoorOpen className="h-5 w-5" />;
    if (type.includes('serrurerie')) return <Lock className="h-5 w-5" />;
    if (type.includes('VMC')) return <Fan className="h-5 w-5" />;
    if (type.includes('nettoyage')) return <Sparkles className="h-5 w-5" />;
    if (type.includes('Gros œuvre')) return <HardHat className="h-5 w-5" />;
    return <Wrench className="h-5 w-5" />;
  };

  const getProgress = (tasks: { status: string }[] = []) => {
    const total = tasks.length;
    if (total === 0) return 0;
    const done = tasks.filter(t => t.status === 'done').length;
    return Math.round((done / total) * 100);
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
            Travaux à réaliser
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
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {workOrders.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(d => d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Travaux à démarrer
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En cours</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {workOrders.filter(d => d.status === 'in_progress').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders.filter(d => d.status === 'in_progress').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Actuellement en chantier
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Facturation</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {workOrders.filter(d => d.status === 'completed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {workOrders
                .filter(d => d.status === 'completed')
                .reduce((sum, order) => sum + (order.actualCost || 0), 0)}€
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              À facturer ce mois
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
              <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {workOrders.filter(d => d.status === 'pending').length}
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
                {workOrders.filter(d => d.status === 'in_progress').length}
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
                {workOrders.filter(d => d.status === 'completed').length}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Avancement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût</th>
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
                      ${workOrder.status === 'pending' ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                       workOrder.status === 'in_progress' ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''}
                    `}
                  >
                    <td className="px-4 py-3 font-medium">BT-{workOrder.workOrderId}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {workOrder.property.type} - {workOrder.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getWorkTypeIcon(workOrder.workType)}
                        <span className="ml-2">{workOrder.workType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {workOrder.tasks && workOrder.tasks.length > 0 ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${getProgress(workOrder.tasks)}%` }}
                          ></div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-neutral-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(workOrder.status)}`}>
                        {getStatusLabel(workOrder.status)}
                      </span>
                      {workOrder.startDate && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          {new Date(workOrder.startDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{workOrder.estimatedCost}€</div>
                      {workOrder.actualCost && (
                        <div className={`text-xs ${
                          workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {workOrder.actualCost}€ réel
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedWorkOrder(workOrder)}
                        className={`text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center ${
                          workOrder.status === 'completed' ? 'text-green-600 dark:text-green-400' : ''
                        }`}
                      >
                        {workOrder.status === 'pending' ? (
                          <>
                            <ClipboardPenLine className="h-4 w-4 mr-1" />
                            Démarrer
                          </>
                        ) : workOrder.status === 'in_progress' ? (
                          <>
                            <FileSignature className="h-4 w-4 mr-1" />
                            Suivi
                          </>
                        ) : (
                          <>
                            <FileSearch className="h-4 w-4 mr-1" />
                            Voir
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun bon de travail trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de détails */}
      {selectedWorkOrder && (
        <WorkOrderDetailsModal
          workOrder={selectedWorkOrder}
          onClose={() => setSelectedWorkOrder(null)}
          onSubmit={handleWorkOrderUpdate}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}