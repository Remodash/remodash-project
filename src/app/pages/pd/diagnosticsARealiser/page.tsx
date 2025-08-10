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
  FileSearch,
  AlertTriangle,
  Info,
  FileSignature,
  ClipboardList,
  Thermometer,
  ShieldAlert,
  Zap,
  Droplets,
  Bug,
  Flame,
  Factory,
  ScanEye,
  CalendarCheck,
  Upload,
  Check,
  X,
  Camera,
  FileInput,
  FileOutput,
  FileDigit,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  File
} from 'lucide-react';

interface DiagnosticResponse {
  id: number;
  diagnosticRequestId: number;
  property: {
    address: string;
    type: string;
    surface: number;
  };
  diagnosticType: string;
  status: 'pending' | 'completed' | 'cancelled';
  dateConducted: string;
  technician: string;
  findings: string;
  recommendations: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'partial';
  documents: {
    name: string;
    type: 'photo' | 'report' | 'certificate' | 'other';
    url: string;
    uploadedAt: string;
  }[];
  notes?: string;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  
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
              ${item.label === 'Diagnostics à Réaliser' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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
  const [documentType, setDocumentType] = useState<'report' | 'photo' | 'certificate' | 'other'>('report');
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
                <option value="certificate">Certificat</option>
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

const DiagnosticResponseForm: React.FC<{
  diagnostic: DiagnosticResponse;
  onClose: () => void;
  onSubmit: (response: DiagnosticResponse) => void;
}> = ({ diagnostic, onClose, onSubmit }) => {
  const [findings, setFindings] = useState(diagnostic.findings || '');
  const [recommendations, setRecommendations] = useState(diagnostic.recommendations || '');
  const [complianceStatus, setComplianceStatus] = useState(diagnostic.complianceStatus || 'compliant');
  const [notes, setNotes] = useState(diagnostic.notes || '');
  const [documents, setDocuments] = useState(diagnostic.documents || []);
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    const updatedResponse: DiagnosticResponse = {
      ...diagnostic,
      findings,
      recommendations,
      complianceStatus,
      notes,
      documents,
      status: 'completed',
      dateConducted: new Date().toISOString()
    };
    onSubmit(updatedResponse);
  };

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      case 'certificate': return <FileDigit className="h-4 w-4" />;
      case 'other': return <FileArchive className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Réponse au diagnostic</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
              <X />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Informations du diagnostic</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Référence:</span> DIAG-{diagnostic.diagnosticRequestId}</p>
                <p><span className="font-medium">Adresse:</span> {diagnostic.property.address}</p>
                <p><span className="font-medium">Type:</span> {diagnostic.property.type} ({diagnostic.property.surface}m²)</p>
                <p><span className="font-medium">Type diagnostic:</span> {diagnostic.diagnosticType}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Statut de conformité</h3>
              <select
                value={complianceStatus}
                onChange={(e) => setComplianceStatus(e.target.value as any)}
                className="w-full p-2 border rounded-lg dark:bg-neutral-700 mb-4"
              >
                <option value="compliant">Conforme</option>
                <option value="partial">Partiellement conforme</option>
                <option value="non-compliant">Non conforme</option>
              </select>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">Date d'intervention:</span>
                <input 
                  type="date" 
                  className="ml-2 p-1 border rounded dark:bg-neutral-700" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Constatations</h3>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              placeholder="Décrivez vos constatations..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Recommandations</h3>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Décrivez vos recommandations..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700"
              rows={4}
            />
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

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Check className="h-5 w-5 mr-2" />
              Soumettre la réponse
            </button>
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

export default function ContractorDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const [diagnostics, setDiagnostics] = useState<DiagnosticResponse[]>([
    {
      id: 1,
      diagnosticRequestId: 1042,
      property: {
        address: '12 Rue de la Paix, 75002 Paris',
        type: 'T2',
        surface: 45
      },
      diagnosticType: 'DPE',
      status: 'pending',
      dateConducted: '',
      technician: 'Jean Dupont',
      findings: '',
      recommendations: '',
      complianceStatus: 'compliant',
      documents: []
    },
    {
      id: 2,
      diagnosticRequestId: 1043,
      property: {
        address: '24 Avenue des Champs, 75008 Paris',
        type: 'T3',
        surface: 72
      },
      diagnosticType: 'Électricité',
      status: 'pending',
      dateConducted: '',
      technician: 'Marie Lambert',
      findings: '',
      recommendations: '',
      complianceStatus: 'compliant',
      documents: [],
      notes: 'Installation ancienne à vérifier complètement'
    },
    {
      id: 3,
      diagnosticRequestId: 1041,
      property: {
        address: '5 Boulevard Haussmann, 75009 Paris',
        type: 'Studio',
        surface: 28
      },
      diagnosticType: 'Gaz',
      status: 'completed',
      dateConducted: '2024-08-10',
      technician: 'Pierre Martin',
      findings: 'Chaudière en bon état mais tuyauterie à surveiller',
      recommendations: 'Contrôle annuel recommandé',
      complianceStatus: 'compliant',
      documents: [
        {
          name: 'Rapport diagnostic gaz.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2024-08-10T14:30:00Z'
        },
        {
          name: 'Photo chaudière.jpg',
          type: 'photo',
          url: '#',
          uploadedAt: '2024-08-10T14:35:00Z'
        }
      ]
    },
    {
      id: 4,
      diagnosticRequestId: 1039,
      property: {
        address: '8 Rue de Rivoli, 75004 Paris',
        type: 'T4',
        surface: 85
      },
      diagnosticType: 'Amiante',
      status: 'completed',
      dateConducted: '2024-08-05',
      technician: 'Sophie Bernard',
      findings: 'Présence d\'amiante dans les joints de fenêtres',
      recommendations: 'Travaux de désamiantage nécessaires avant rénovation',
      complianceStatus: 'non-compliant',
      documents: [
        {
          name: 'Rapport amiante.pdf',
          type: 'report',
          url: '#',
          uploadedAt: '2024-08-05T11:20:00Z'
        },
        {
          name: 'Certificat analyse.pdf',
          type: 'certificate',
          url: '#',
          uploadedAt: '2024-08-05T11:25:00Z'
        }
      ],
      notes: 'Dossier à transmettre à l\'administration',
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleDiagnosticResponse = (response: DiagnosticResponse) => {
    setDiagnostics(prev => 
      prev.map(item => 
        item.id === response.id ? response : item
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
        diagnostic.technician.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
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
            <ClipboardCheck className="h-8 w-8 mr-3" />
            Diagnostics à réaliser
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">À réaliser</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {diagnostics.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.filter(d => d.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Diagnostics en attente
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Terminés</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {diagnostics.filter(d => d.status === 'completed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.filter(d => d.status === 'completed').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Ce mois-ci
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Documents</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {diagnostics.reduce((acc, curr) => acc + (curr.documents ? curr.documents.length : 0), 0)}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {diagnostics.reduce((acc, curr) => acc + (curr.documents ? curr.documents.length : 0), 0)}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Uploadés ce mois
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
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {diagnostics.filter(d => d.status === 'pending').length}
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
                {diagnostics.filter(d => d.status === 'completed').length}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Technicien</th>
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
                    `}
                  >
                    <td className="px-4 py-3 font-medium">DIAG-{diagnostic.diagnosticRequestId}</td>
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
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{diagnostic.technician}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(diagnostic.status)}`}>
                        {getStatusLabel(diagnostic.status)}
                      </span>
                      {diagnostic.status === 'completed' && diagnostic.dateConducted && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          {new Date(diagnostic.dateConducted).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedDiagnostic(diagnostic)}
                        className={`text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center ${
                          diagnostic.status === 'completed' ? 'text-green-600 dark:text-green-400' : ''
                        }`}
                      >
                        {diagnostic.status === 'pending' ? (
                          <>
                            <FileSignature className="h-4 w-4 mr-1" />
                            Remplir
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
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun diagnostic trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de réponse */}
      {selectedDiagnostic && (
        <DiagnosticResponseForm
          diagnostic={selectedDiagnostic}
          onClose={() => setSelectedDiagnostic(null)}
          onSubmit={handleDiagnosticResponse}
        />
      )}
    </div>
  );
}