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
  HardHat,
  Construction,
  Check,
  X,
  AlertOctagon,
  CircleDashed,
  Percent,
  FileSpreadsheet,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Camera,
  ListChecks,
  HomeIcon,
  Key,
  ClipboardEdit,
  ShieldCheck,
  FileCheck,
  FileInput,
  FileOutput, Files, FileEdit
} from 'lucide-react';

// Types basés sur le cahier des charges
interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  moveOutDate: string;
  rentAmount: number;
  deposit: number;
  hasUnpaidRent: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface Property {
  id: number;
  address: string;
  type: string;
  surface: number;
  constructionYear: number;
  lastRenovationYear: number;
  energyClass: string;
  photos: string[];
}



interface EDLItem {
  id: number;
  room: string;
  element: string;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  notes: string;
  photos: string[];
  isChargeable: boolean;
  chargeAmount?: number;
  tenantComment?: string;
}

interface EDL {
  id: number;
  type: 'entry' | 'exit';
  tenant: Tenant;
  property: Property;
  date: string;
  conductedBy: string;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  items: EDLItem[];
  meterReadings: {
    electricity: number;
    water: number;
    gas: number;
  };
  signatures: {
    tenant?: string;
    agent?: string;
    date?: string;
  };
  version: number;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { 
        icon: Home, 
        label: 'Tableau de Bord', 
        href: '/dashboard/gt' 
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
          Remodash GL
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
              ${item.label === 'États des Lieux' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const EDLDetailModal: React.FC<{
  edl: EDL;
  onClose: () => void;
  onSave: (updatedEDL: EDL) => void;
  onValidate: () => void;
  onDispute: () => void;
}> = ({ edl, onClose, onSave, onValidate, onDispute }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<EDLItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleItemClick = (item: EDLItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  /*
  const handleSaveItem = (updatedItem: EDLItem) => {
    const updatedItems = edl.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    onSave({ ...edl, items: updatedItems });
    setIsEditing(false);
    setCurrentItem(null);
  };
  */

  const handleSaveItem = (updatedItem: EDLItem) => {
    const updatedItems = edl.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    const updatedEDL = { ...edl, items: updatedItems };
    onSave(updatedEDL);
    setIsEditing(false);
    setCurrentItem(null);
  };
  

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'disputed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'good': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'fair': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'poor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'damaged': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'good': return 'Bon état';
      case 'fair': return 'État correct';
      case 'poor': return 'Usure normale';
      case 'damaged': return 'Endommagé';
      default: return condition;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <ClipboardEdit className="h-8 w-8 mr-2" />
              État des Lieux {edl.type === 'entry' ? "d'Entrée" : "de Sortie"} - {edl.property.address}
              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(edl.status)}`}>
                {edl.status === 'pending' ? 'En attente' : 
                 edl.status === 'in_progress' ? 'En cours' : 
                 edl.status === 'completed' ? 'Terminé' : 'Contesté'}
              </span>
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
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <HomeIcon className="h-5 w-5 mr-2" />
                Logement
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Adresse:</span> {edl.property.address}</p>
                <p><span className="font-medium">Type:</span> {edl.property.type} ({edl.property.surface}m²)</p>
                <p><span className="font-medium">Année construction:</span> {edl.property.constructionYear}</p>
                <p><span className="font-medium">DPE:</span> {edl.property.energyClass}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Locataire
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nom:</span> {edl.tenant.name}</p>
                <p><span className="font-medium">Téléphone:</span> {edl.tenant.phone}</p>
                <p><span className="font-medium">Email:</span> {edl.tenant.email}</p>
                <p><span className="font-medium">Date {edl.type === 'entry' ? "d'entrée" : "de sortie"}:</span> {edl.type === 'entry' ? edl.tenant.moveInDate : edl.tenant.moveOutDate}</p>
                {edl.tenant.hasUnpaidRent && (
                  <p className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Locataire avec impayés</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Informations EDL
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Date:</span> {edl.date}</p>
                <p><span className="font-medium">Réalisé par:</span> {edl.conductedBy}</p>
                <p><span className="font-medium">Version:</span> {edl.version}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <FileInput className="h-5 w-5 mr-2" />
                Relevés de compteurs
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Électricité:</span> {edl.meterReadings.electricity} kWh</p>
                <p><span className="font-medium">Eau:</span> {edl.meterReadings.water} m³</p>
                <p><span className="font-medium">Gaz:</span> {edl.meterReadings.gas} m³</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('items')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <ListChecks className="h-5 w-5 mr-2" />
                Éléments vérifiés ({edl.items.length})
              </h3>
              {expandedSection === 'items' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'items' && (
              <div className="mt-3 space-y-3">
                {edl.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.room} - {item.element}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConditionColor(item.condition)}`}>
                          {getConditionLabel(item.condition)}
                        </span>
                        {item.isChargeable && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Facturable: {item.chargeAmount} €
                          </span>
                        )}
                      </div>
                      {item.photos && item.photos.length > 0 && (
                        <span className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                          <Camera className="h-3 w-3 mr-1" />
                          {item.photos.length}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">{item.notes}</p>
                    )}
                    {item.tenantComment && (
                      <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                        <span className="font-medium">Commentaire locataire:</span> {item.tenantComment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {edl.signatures && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <FileSignature className="h-5 w-5 mr-2" />
                Signatures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Locataire:</p>
                  <p className="mt-1">
                    {edl.signatures.tenant ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Signé le {edl.signatures.date}
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        En attente de signature
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Gestionnaire:</p>
                  <p className="mt-1">
                    {edl.signatures.agent ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Signé par {edl.conductedBy} le {edl.signatures.date}
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Signature requise
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            {edl.status !== 'completed' && (
              <>
                <button
                  onClick={onDispute}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Signaler un désaccord
                </button>
                <button
                  onClick={onValidate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Valider l'EDL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EDLItemEditor: React.FC<{
  item: EDLItem;
  onSave: (item: EDLItem) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState<EDLItem>({ ...item });

  const handleConditionChange = (condition: 'good' | 'fair' | 'poor' | 'damaged') => {
    setEditedItem(prev => ({
      ...prev,
      condition,
      isChargeable: condition === 'damaged'
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedItem(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleChargeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem(prev => ({
      ...prev,
      chargeAmount: Number(e.target.value)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">
            Modifier l'élément: {item.room} - {item.element}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <XCircle />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              État de l'élément
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleConditionChange('good')}
                className={`p-2 rounded border ${
                  editedItem.condition === 'good' 
                    ? 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-600' 
                    : 'border-gray-300 dark:border-neutral-600'
                }`}
              >
                Bon état
              </button>
              <button
                onClick={() => handleConditionChange('fair')}
                className={`p-2 rounded border ${
                  editedItem.condition === 'fair' 
                    ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-600' 
                    : 'border-gray-300 dark:border-neutral-600'
                }`}
              >
                État correct
              </button>
              <button
                onClick={() => handleConditionChange('poor')}
                className={`p-2 rounded border ${
                  editedItem.condition === 'poor' 
                    ? 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900 dark:border-yellow-600' 
                    : 'border-gray-300 dark:border-neutral-600'
                }`}
              >
                Usure normale
              </button>
              <button
                onClick={() => handleConditionChange('damaged')}
                className={`p-2 rounded border ${
                  editedItem.condition === 'damaged' 
                    ? 'bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-600' 
                    : 'border-gray-300 dark:border-neutral-600'
                }`}
              >
                Endommagé
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
              Notes
            </label>
            <textarea
              value={editedItem.notes || ''}
              onChange={handleNotesChange}
              className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600"
              rows={3}
            />
          </div>

          {editedItem.condition === 'damaged' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Montant facturable (€)
              </label>
              <input
                type="number"
                value={editedItem.chargeAmount || 0}
                onChange={handleChargeChange}
                className="w-full border rounded p-2 dark:bg-neutral-700 dark:border-neutral-600"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(editedItem)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EtatsDesLieuxPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedEDL, setSelectedEDL] = useState<EDL | null>(null);
  const [editingItem, setEditingItem] = useState<EDLItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'disputed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [edlTypeFilter, setEdlTypeFilter] = useState<'all' | 'entry' | 'exit'>('all');

  // Données simulées basées sur le cahier des charges
  const [edls, setEdls] = useState<EDL[]>([
    {
      id: 1,
      type: 'exit',
      tenant: {
        id: 101,
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        phone: "06 12 34 56 78",
        moveInDate: "2022-01-15",
        moveOutDate: "2024-08-01",
        rentAmount: 650,
        deposit: 1300,
        hasUnpaidRent: false,
        emergencyContact: {
          name: "Marie Dupont",
          phone: "06 98 76 54 32",
          relation: "Épouse"
        }
      },
      property: {
        id: 201,
        address: "Résidence Lumière, Apt 305",
        type: "T2",
        surface: 45,
        constructionYear: 2005,
        lastRenovationYear: 2018,
        energyClass: "C",
        photos: ["photo1.jpg", "photo2.jpg"]
      },
      date: "2024-08-01",
      conductedBy: "Sophie Martin",
      status: "pending",
      items: [
        {
          id: 1,
          room: "Salon",
          element: "Mur principal",
          condition: "good",
          notes: "Peinture en bon état",
          photos: ["photo3.jpg"],
          isChargeable: false
        },
        {
          id: 2,
          room: "Cuisine",
          element: "Plan de travail",
          condition: "damaged",
          notes: "Rayure profonde de 20cm",
          photos: ["photo4.jpg", "photo5.jpg"],
          isChargeable: true,
          chargeAmount: 150,
          tenantComment: "Rayure présente à l'entrée"
        },
        {
          id: 3,
          room: "Salle de bain",
          element: "Mitigeur douche",
          condition: "poor",
          notes: "Fonctionne mais montre des signes d'usure",
          photos: ["photo6.jpg"],
          isChargeable: false
        }
      ],
      meterReadings: {
        electricity: 12345,
        water: 456,
        gas: 789
      },
      signatures: {
        tenant: "signature1.png",
        date: "2024-08-01"
      },
      version: 1
    },
    {
      id: 2,
      type: 'entry',
      tenant: {
        id: 102,
        name: "Marie Lambert",
        email: "marie.lambert@example.com",
        phone: "07 65 43 21 09",
        moveInDate: "2024-08-15",
        moveOutDate: "",
        rentAmount: 720,
        deposit: 1440,
        hasUnpaidRent: false,
        emergencyContact: {
          name: "Pierre Lambert",
          phone: "07 12 34 56 78",
          relation: "Conjoint"
        }
      },
      property: {
        id: 202,
        address: "Résidence Soleil, Apt 102",
        type: "T1",
        surface: 32,
        constructionYear: 2010,
        lastRenovationYear: 2022,
        energyClass: "B",
        photos: ["photo7.jpg", "photo8.jpg"]
      },
      date: "2024-08-15",
      conductedBy: "Sophie Martin",
      status: "completed",
      items: [
        {
          id: 1,
          room: "Pièce principale",
          element: "Sol PVC",
          condition: "good",
          notes: "Neuf, posé lors de la rénovation",
          photos: ["photo9.jpg"],
          isChargeable: false
        },
        {
          id: 2,
          room: "Cuisine",
          element: "Plaque de cuisson",
          condition: "fair",
          notes: "Fonctionnelle mais légères traces d'usage",
          photos: ["photo10.jpg"],
          isChargeable: false
        }
      ],
      meterReadings: {
        electricity: 5432,
        water: 123,
        gas: 456
      },
      signatures: {
        tenant: "signature2.png",
        agent: "signature_sophie.png",
        date: "2024-08-15"
      },
      version: 1
    },
    {
      id: 3,
      type: 'exit',
      tenant: {
        id: 103,
        name: "Thomas Leroy",
        email: "thomas.leroy@example.com",
        phone: "06 54 32 10 98",
        moveInDate: "2021-03-10",
        moveOutDate: "2024-07-20",
        rentAmount: 800,
        deposit: 1600,
        hasUnpaidRent: true,
        emergencyContact: {
          name: "Julie Leroy",
          phone: "06 87 65 43 21",
          relation: "Sœur"
        }
      },
      property: {
        id: 203,
        address: "Résidence Jardin, Apt 78",
        type: "T3",
        surface: 65,
        constructionYear: 1995,
        lastRenovationYear: 2015,
        energyClass: "D",
        photos: ["photo11.jpg", "photo12.jpg"]
      },
      date: "2024-07-20",
      conductedBy: "Lucie Bernard",
      status: "disputed",
      items: [
        {
          id: 1,
          room: "Chambre principale",
          element: "Porte",
          condition: "damaged",
          notes: "Trou dans la porte, probablement coup de poing",
          photos: ["photo13.jpg"],
          isChargeable: true,
          chargeAmount: 250,
          tenantComment: "Porte déjà abîmée à l'entrée mais non notée"
        },
        {
          id: 2,
          room: "Salle de bain",
          element: "Carrelage mur",
          condition: "damaged",
          notes: "3 carreaux cassés",
          photos: ["photo14.jpg"],
          isChargeable: true,
          chargeAmount: 180
        }
      ],
      meterReadings: {
        electricity: 8765,
        water: 321,
        gas: 654
      },
      signatures: {
        tenant: "signature3.png",
        date: "2024-07-20"
      },
      version: 2
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSaveEDL = (updatedEDL: EDL) => {
    setEdls(prev => 
      prev.map(edl => edl.id === updatedEDL.id ? updatedEDL : edl)
    );
    setSelectedEDL(updatedEDL);
  };

  const handleValidateEDL = (id: number) => {
    setEdls(prev => 
      prev.map(edl => 
        edl.id === id ? { 
          ...edl, 
          status: "completed",
          signatures: {
            ...edl.signatures,
            agent: "signature_agent.png",
            date: new Date().toISOString().split('T')[0]
          }
        } : edl
      )
    );
    setSelectedEDL(null);
  };

  const handleDisputeEDL = (id: number) => {
    setEdls(prev => 
      prev.map(edl => 
        edl.id === id ? { 
          ...edl, 
          status: "disputed",
          version: edl.version + 1
        } : edl
      )
    );
    setSelectedEDL(null);
  };

  const filteredEDLs = edls.filter(edl => {
    // Filtre par statut
    if (filter !== 'all' && edl.status !== filter) return false;
    
    // Filtre par type
    if (edlTypeFilter !== 'all' && edl.type !== edlTypeFilter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        edl.tenant.name.toLowerCase().includes(term) ||
        edl.property.address.toLowerCase().includes(term) ||
        edl.conductedBy.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <CircleDashed className="h-5 w-5 text-yellow-500" />;
      case 'in_progress': return <Construction className="h-5 w-5 text-blue-500" />;
      case 'completed': return <Check className="h-5 w-5 text-green-500" />;
      case 'disputed': return <AlertOctagon className="h-5 w-5 text-orange-500" />;
      default: return <CircleDashed className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'disputed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'disputed': return 'Contesté';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'entry': return "Entrée";
      case 'exit': return "Sortie";
      default: return type;
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
            <ClipboardEdit className="h-8 w-8 mr-3" />
            Gestion des États des Lieux
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">EDL à compléter</h3>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {edls.filter(e => e.status === 'pending').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {edls.filter(e => e.status === 'pending').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En attente de finalisation
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">EDL contestés</h3>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {edls.filter(e => e.status === 'disputed').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {edls.filter(e => e.status === 'disputed').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Requièrent une attention particulière
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">EDL ce mois</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {edls.filter(e => e.date.startsWith('2024-08')).length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {edls.filter(e => e.date.startsWith('2024-08')).length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Réalisés ou programmés
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
              <CircleDashed className="h-4 w-4 mr-1" />
              En attente
              <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {edls.filter(e => e.status === 'pending').length}
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
              <Construction className="h-4 w-4 mr-1" />
              En cours
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {edls.filter(e => e.status === 'in_progress').length}
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
              <Check className="h-4 w-4 mr-1" />
              Terminés
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {edls.filter(e => e.status === 'completed').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('disputed')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'disputed'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <AlertOctagon className="h-4 w-4 mr-1" />
              Contestés
              <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {edls.filter(e => e.status === 'disputed').length}
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
            <select
              value={edlTypeFilter}
              onChange={(e) => setEdlTypeFilter(e.target.value as 'all' | 'entry' | 'exit')}
              className="py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
            >
              <option value="all">Tous types</option>
              <option value="entry">Entrée</option>
              <option value="exit">Sortie</option>
            </select>
          </nav>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Réalisé par</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredEDLs.length > 0 ? (
                filteredEDLs.map(edl => (
                  <tr 
                    key={edl.id} 
                    className={`
                      hover:bg-gray-50 dark:hover:bg-neutral-700
                      ${edl.status === 'disputed' ? 'bg-red-50/30 dark:bg-red-900/10' : ''}
                    `}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        edl.type === 'entry' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {getTypeLabel(edl.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{edl.tenant.name}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {edl.type === 'entry' ? edl.tenant.moveInDate : edl.tenant.moveOutDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{edl.property.address}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {edl.property.type} - {edl.property.surface}m²
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{edl.date}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        v{edl.version}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{edl.conductedBy}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getStatusIcon(edl.status)}
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(edl.status)}`}>
                          {getStatusLabel(edl.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setSelectedEDL(edl)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <FileSearch className="h-4 w-4 mr-1" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun état des lieux trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de détail EDL */}
      {selectedEDL && (
        <EDLDetailModal
          edl={selectedEDL}
          onClose={() => setSelectedEDL(null)}
          onSave={handleSaveEDL}
          onValidate={() => handleValidateEDL(selectedEDL.id)}
          onDispute={() => handleDisputeEDL(selectedEDL.id)}
        />
      )}

      {/* Modal d'édition d'élément */}
      {/*{editingItem && (
        <EDLItemEditor
          item={editingItem}
          onSave={handleSaveItem => {
            const updatedItem = { ...editingItem, ...handleSaveItem };
            const updatedItems = edl.items.map(item =>
              item.id === updatedItem.id ? updatedItem : item
            );
            const updatedEDL = { ...edl, items: updatedItems };
            onSave(updatedEDL);
            setIsEditing(false);
            setCurrentItem(null);
          }}
          onCancel={() => setEditingItem(null)}
        />
      )}*/}
    </div>
  );
}