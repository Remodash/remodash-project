'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  ClipboardCheck,
  Hammer,
  Building,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  FileSearch,
  ClipboardList,
  Plus,
  User,
  Search,
  CircleDashed,
  Check,
  ChevronUp,
  ChevronDown,
  Hash,
  FileOutput,
  CalendarDays,
  ArrowUpDown,
  Camera,
  Image,
  ListChecks,
  Scan, 
  Files, FileEdit
} from 'lucide-react';

// Types basés sur le cahier des charges
interface Tenant {
  id: string;
  name: string;
  contact: string;
  email: string;
  emergencyContact: string;
  paymentStatus: 'up_to_date' | 'partial' | 'late';
  socialFollowup?: boolean;
}

interface Property {
  id: string;
  address: string;
  building: string;
  floor: string;
  doorNumber: string;
  type: string;
  surface: number;
  constructionYear: number;
  energyClass?: string;
}

interface PreEDL {
  id: string;
  preEdlId: string;
  tenant: Tenant;
  property: Property;
  status: 'pending' | 'in_progress' | 'completed' | 'validated';
  scheduledDate: string;
  completionDate?: string;
  conductedBy: string;
  isTenantPresent: boolean;
  meterReadings: {
    electricity?: number;
    water?: number;
    gas?: number;
  };
  photos: string[];
  observations: {
    room: string;
    element: string;
    condition: 'good' | 'fair' | 'poor' | 'damaged';
    notes?: string;
    photo?: string;
  }[];
  diagnosticsRequired?: string[];
  sentToGT?: boolean;
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
        href: '/pages/gt/EDLs', 
        active: true
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
              ${item.active ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const PreEDLModal: React.FC<{ 
  preEDL: PreEDL, 
  onClose: () => void, 
  onValidate: () => void 
}> = ({ preEDL, onClose, onValidate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validateSuccess, setValidateSuccess] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setValidateSuccess(false);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Appeler la fonction parente
      onValidate();
      
      setValidateSuccess(true);
      setTimeout(() => setValidateSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la validation", error);
    } finally {
      setIsValidating(false);
    }
  };

  const getConditionBadge = (condition: string) => {
    switch(condition) {
      case 'good': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Bon état</span>;
      case 'fair': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">État correct</span>;
      case 'poor': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Usure normale</span>;
      case 'damaged': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Endommagé</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Non évalué</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <ClipboardCheck className="h-6 w-6 mr-2" />
              Pré-État des Lieux - {preEDL.preEdlId}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <XCircle />
            </button>
          </div>

          {validateSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center dark:bg-green-900 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Le pré-état des lieux a bien été validé et transmis
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations locataire
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nom:</span> {preEDL.tenant.name}</p>
                <p><span className="font-medium">ID:</span> {preEDL.tenant.id}</p>
                <p><span className="font-medium">Contact:</span> {preEDL.tenant.contact}</p>
                <p><span className="font-medium">Présent lors du pré-EDL:</span> {preEDL.isTenantPresent ? 'Oui' : 'Non'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Informations logement
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Adresse:</span> {preEDL.property.address}</p>
                <p><span className="font-medium">Localisation:</span> {preEDL.property.building}, {preEDL.property.floor}, Porte {preEDL.property.doorNumber}</p>
                <p><span className="font-medium">Type:</span> {preEDL.property.type} ({preEDL.property.surface}m²)</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('dates')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Dates et relevés
              </h3>
              {expandedSection === 'dates' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'dates' && (
              <div className="mt-3 p-3 border rounded-lg">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Date prévue: {new Date(preEDL.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    {preEDL.completionDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Réalisé le: {new Date(preEDL.completionDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Scan className="h-4 w-4 mr-2" />
                      Relevés des compteurs
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Électricité</label>
                        <div className="flex items-center p-2 bg-gray-100 dark:bg-neutral-700 rounded">
                          <span>{preEDL.meterReadings.electricity ?? 'Non relevé'}</span>
                          {preEDL.meterReadings.electricity && <span className="ml-1">kWh</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Eau</label>
                        <div className="flex items-center p-2 bg-gray-100 dark:bg-neutral-700 rounded">
                          <span>{preEDL.meterReadings.water ?? 'Non relevé'}</span>
                          {preEDL.meterReadings.water && <span className="ml-1">m³</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Gaz</label>
                        <div className="flex items-center p-2 bg-gray-100 dark:bg-neutral-700 rounded">
                          <span>{preEDL.meterReadings.gas ?? 'Non relevé'}</span>
                          {preEDL.meterReadings.gas && <span className="ml-1">m³</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('observations')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <ListChecks className="h-5 w-5 mr-2" />
                Observations ({preEDL.observations.length})
              </h3>
              {expandedSection === 'observations' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'observations' && (
              <div className="mt-3 border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-100 dark:bg-neutral-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Pièce</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Élément</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">État</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Photo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                    {preEDL.observations.map((obs, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{obs.room}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">{obs.element}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {getConditionBadge(obs.condition)}
                          {obs.notes && (
                            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{obs.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                          {obs.photo ? (
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
                              <Image className="h-4 w-4 mr-1" /> Voir
                            </button>
                          ) : (
                            <span className="text-gray-400 dark:text-neutral-600">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {preEDL.photos.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('photos')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos ({preEDL.photos.length})
                </h3>
                {expandedSection === 'photos' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'photos' && (
                <div className="mt-3 p-3 border rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {preEDL.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-gray-200 dark:bg-neutral-700 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                          Photo {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {preEDL.diagnosticsRequired && preEDL.diagnosticsRequired.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('diagnostics')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <FileSearch className="h-5 w-5 mr-2" />
                  Diagnostics requis ({preEDL.diagnosticsRequired.length})
                </h3>
                {expandedSection === 'diagnostics' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'diagnostics' && (
                <div className="mt-3 p-3 border rounded-lg">
                  <ul className="list-disc pl-5 space-y-2">
                    {preEDL.diagnosticsRequired.map((diag, index) => (
                      <li key={index} className="text-sm">
                        {diag}
                        {diag === 'Amiante' && preEDL.property.constructionYear < 1997 && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">(Bâtiment construit avant 1997)</span>
                        )}
                        {diag === 'Plomb (CREP)' && preEDL.property.constructionYear < 1949 && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-neutral-400">(Bâtiment construit avant 1949)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            {preEDL.status !== 'validated' && (
              <button
                onClick={handleValidate}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${
                  preEDL.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={preEDL.status === 'completed' || isValidating}
              >
                {isValidating ? (
                  <>
                    <CircleDashed className="h-5 w-5 mr-2 animate-spin" />
                    Validation en cours...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Valider et transmettre
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewPreEDLModal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (newPreEDL: Omit<PreEDL, 'id' | 'preEdlId' | 'status' | 'diagnosticsRequired' | 'sentToGT'>) => void,
  properties: Property[],
  tenants: Tenant[]
}> = ({ isOpen, onClose, onSubmit, properties, tenants }) => {
  const [formData, setFormData] = useState<Omit<PreEDL, 'id' | 'preEdlId' | 'status' | 'diagnosticsRequired' | 'sentToGT'>>({
    tenant: tenants[0],
    property: properties[0],
    scheduledDate: new Date().toISOString().split('T')[0],
    conductedBy: 'Gardien',
    isTenantPresent: true,
    meterReadings: {},
    photos: [],
    observations: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectTenant = (tenantId: string) => {
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      setFormData(prev => ({
        ...prev,
        tenant: selectedTenant
      }));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    const selectedProperty = properties.find(p => p.id === propertyId);
    if (selectedProperty) {
      setFormData(prev => ({
        ...prev,
        property: selectedProperty
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <ClipboardCheck className="h-8 w-8 mr-3" />
              Nouveau pré-état des lieux
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section Locataire */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-xl mb-4 flex items-center">
                <User className="h-6 w-6 mr-3" />
                Informations locataire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-medium mb-2">Locataire*</label>
                  <select
                    value={formData.tenant.id}
                    onChange={(e) => handleSelectTenant(e.target.value)}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  >
                    <option value="">Sélectionnez un locataire</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      name="isTenantPresent"
                      checked={formData.isTenantPresent}
                      onChange={handleInputChange}
                      className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500"
                    />
                    <label className="text-lg font-medium">Locataire présent</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Logement */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-xl mb-4 flex items-center">
                <Building className="h-6 w-6 mr-3" />
                Informations logement
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-medium mb-2">Logement*</label>
                  <select
                    value={formData.property.id}
                    onChange={(e) => handleSelectProperty(e.target.value)}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  >
                    <option value="">Sélectionnez un logement</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.address} ({property.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bâtiment</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Hash className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.property.building}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Étage</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Hash className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.property.floor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Porte</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Hash className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.property.doorNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Dates et modalités */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-xl mb-4 flex items-center">
                <CalendarDays className="h-6 w-6 mr-3" />
                Planification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-2">Date prévue*</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Réalisé par*</label>
                  <select
                    name="conductedBy"
                    value={formData.conductedBy}
                    onChange={handleInputChange}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  >
                    <option value="Gardien">Gardien</option>
                    <option value="Chargé EDL">Chargé EDL</option>
                    <option value="Gestionnaire Technique">Gestionnaire Technique</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Relevés */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-xl mb-4 flex items-center">
                <Scan className="h-6 w-6 mr-3" />
                Relevés des compteurs
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-2">Électricité (kWh)</label>
                  <input
                    type="number"
                    name="electricity"
                    value={formData.meterReadings.electricity || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      meterReadings: {
                        ...prev.meterReadings,
                        electricity: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    placeholder="Entrez la valeur"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Eau (m³)</label>
                  <input
                    type="number"
                    name="water"
                    value={formData.meterReadings.water || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      meterReadings: {
                        ...prev.meterReadings,
                        water: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    placeholder="Entrez la valeur"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Gaz (m³)</label>
                  <input
                    type="number"
                    name="gas"
                    value={formData.meterReadings.gas || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      meterReadings: {
                        ...prev.meterReadings,
                        gas: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    }))}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    placeholder="Entrez la valeur"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 text-lg font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center text-lg font-medium"
              >
                <FileOutput className="h-6 w-6 mr-2" />
                Créer le pré-EDL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function PreEDLPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedPreEDL, setSelectedPreEDL] = useState<PreEDL | null>(null);
  const [isNewPreEDLModalOpen, setIsNewPreEDLModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'validated'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'ascending' | 'descending'} | null>(null);

  // Données simulées basées sur le cahier des charges
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'T1001',
      name: 'Jean Dupont',
      contact: '06 12 34 56 78',
      email: 'jean.dupont@example.com',
      emergencyContact: 'Marie Dupont - 06 98 76 54 32',
      paymentStatus: 'up_to_date'
    },
    {
      id: 'T1002',
      name: 'Marie Dubois',
      contact: '06 87 65 43 21',
      email: 'marie.dubois@example.com',
      emergencyContact: 'Pierre Dubois - 06 12 34 56 78',
      paymentStatus: 'late',
      socialFollowup: true
    },
    {
      id: 'T1003',
      name: 'Sophie Martin',
      contact: '06 45 67 89 01',
      email: 'sophie.martin@example.com',
      emergencyContact: 'Luc Martin - 06 23 45 67 89',
      paymentStatus: 'up_to_date'
    }
  ]);

  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'prop-1',
      address: '12 Rue de la Paix, 75002 Paris',
      building: 'Bâtiment A',
      floor: '3ème étage',
      doorNumber: '12',
      type: 'T2',
      surface: 45,
      constructionYear: 2005,
      energyClass: 'C'
    },
    {
      id: 'prop-2',
      address: '24 Avenue des Champs, 75008 Paris',
      building: 'Bâtiment B',
      floor: 'RDC',
      doorNumber: '5',
      type: 'T3',
      surface: 72,
      constructionYear: 1980,
      energyClass: 'E'
    },
    {
      id: 'prop-3',
      address: '5 Rue du Commerce, 75015 Paris',
      building: 'Bâtiment C',
      floor: '1er étage',
      doorNumber: '8',
      type: 'T1',
      surface: 32,
      constructionYear: 2010,
      energyClass: 'B'
    }
  ]);

  const [preEDLs, setPreEDLs] = useState<PreEDL[]>([
    {
      id: '1',
      preEdlId: '2024-PRE-001',
      tenant: tenants[0],
      property: properties[0],
      status: 'completed',
      scheduledDate: new Date().toISOString(),
      completionDate: new Date().toISOString(),
      conductedBy: 'Gardien',
      isTenantPresent: true,
      meterReadings: {
        electricity: 12345,
        water: 678,
        gas: 456
      },
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
      observations: [
        { room: 'Séjour', element: 'Mur nord', condition: 'good', notes: 'Peinture en bon état' },
        { room: 'Cuisine', element: 'Plan de travail', condition: 'fair', notes: 'Rayures superficielles' },
        { room: 'Salle de bain', element: 'Robinet lavabo', condition: 'poor', notes: 'Fuite légère' }
      ],
      diagnosticsRequired: ['DPE', 'Électricité'],
      sentToGT: true
    },
    {
      id: '2',
      preEdlId: '2024-PRE-002',
      tenant: tenants[1],
      property: properties[1],
      status: 'in_progress',
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      conductedBy: 'Chargé EDL',
      isTenantPresent: false,
      meterReadings: {},
      photos: [],
      observations: [],
      diagnosticsRequired: ['Amiante', 'Plomb', 'Électricité', 'Gaz']
    },
    {
      id: '3',
      preEdlId: '2024-PRE-003',
      tenant: tenants[2],
      property: properties[2],
      status: 'pending',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      conductedBy: 'Gardien',
      isTenantPresent: true,
      meterReadings: {},
      photos: [],
      observations: [],
      diagnosticsRequired: ['DPE']
    }
  ]);

  const handleValidatePreEDL = (preEDL: PreEDL) => {
    const updatedPreEDL: PreEDL = {
      ...preEDL,
      status: 'validated',
      sentToGT: true,
      diagnosticsRequired: getRequiredDiagnostics(preEDL.property)
    };

    setPreEDLs(preEDLs.map(p =>
      p.id === preEDL.id ? updatedPreEDL : p
    ));
    setSelectedPreEDL(updatedPreEDL);
  };

  const handleAddNewPreEDL = (newPreEDL: Omit<PreEDL, 'id' | 'preEdlId' | 'status' | 'diagnosticsRequired' | 'sentToGT'>) => {
    const preEdlId = `2024-PRE-${(preEDLs.length + 100).toString().padStart(3, '0')}`;
    
    const diagnosticsRequired = getRequiredDiagnostics(newPreEDL.property);
    
    const preEDL: PreEDL = {
      ...newPreEDL,
      id: (preEDLs.length + 1).toString(),
      preEdlId,
      status: 'pending',
      diagnosticsRequired,
      sentToGT: false
    };
    
    setPreEDLs([...preEDLs, preEDL]);
    setIsNewPreEDLModalOpen(false);
  };

  const getRequiredDiagnostics = (property: Property): string[] => {
    const diagnostics: string[] = [];
    
    // DPE requis si >10 ans ou absent
    diagnostics.push('DPE');
    
    // Amiante si bâtiment avant 1997
    if (property.constructionYear < 1997) {
      diagnostics.push('Amiante');
    }
    
    // Plomb si bâtiment avant 1949
    if (property.constructionYear < 1949) {
      diagnostics.push('Plomb (CREP)');
    }
    
    // Électricité si installation >15 ans
    diagnostics.push('Électricité');
    
    // Gaz si installation >15 ans et présence d'équipement gaz
    diagnostics.push('Gaz');
    
    return diagnostics;
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPreEDLs = React.useMemo(() => {
    const sortablePreEDLs = [...preEDLs];
    if (sortConfig !== null) {
      sortablePreEDLs.sort((a, b) => {
        if (sortConfig.key === 'preEdlId') {
          return sortConfig.direction === 'ascending' 
            ? a.preEdlId.localeCompare(b.preEdlId)
            : b.preEdlId.localeCompare(a.preEdlId);
        }
        if (sortConfig.key === 'tenant') {
          return sortConfig.direction === 'ascending' 
            ? a.tenant.name.localeCompare(b.tenant.name)
            : b.tenant.name.localeCompare(a.tenant.name);
        }
        if (sortConfig.key === 'property') {
          return sortConfig.direction === 'ascending' 
            ? a.property.address.localeCompare(b.property.address)
            : b.property.address.localeCompare(a.property.address);
        }
        if (sortConfig.key === 'scheduledDate' || sortConfig.key === 'completionDate') {
  const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key]!).getTime() : 0;
  const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key]!).getTime() : 0;
  
  return sortConfig.direction === 'ascending' 
    ? dateA - dateB
    : dateB - dateA;
}
        if (sortConfig.key === 'status') {
          return sortConfig.direction === 'ascending' 
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      });
    }
    return sortablePreEDLs;
  }, [preEDLs, sortConfig]);

  const filteredPreEDLs = sortedPreEDLs.filter(preEDL => {
    // Filtre par statut
    if (filter !== 'all' && preEDL.status !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        preEDL.tenant.name.toLowerCase().includes(term) ||
        preEDL.property.address.toLowerCase().includes(term) ||
        preEDL.preEdlId.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Statistiques
  const stats = {
    total: preEDLs.length,
    pending: preEDLs.filter(p => p.status === 'pending').length,
    in_progress: preEDLs.filter(p => p.status === 'in_progress').length,
    completed: preEDLs.filter(p => p.status === 'completed').length,
    validated: preEDLs.filter(p => p.status === 'validated').length,
    withTenantPresent: preEDLs.filter(p => p.isTenantPresent).length
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Planifié</span>;
      case 'in_progress': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">En cours</span>;
      case 'completed': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Complété</span>;
      case 'validated': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Validé</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Inconnu</span>;
    }
  };

  const getConductedByIcon = (conductedBy: string) => {
    switch(conductedBy) {
      case 'Gardien': return <User className="h-4 w-4 mr-1" />;
      case 'Chargé EDL': return <ClipboardCheck className="h-4 w-4 mr-1" />;
      case 'Gestionnaire Technique': return <Hammer className="h-4 w-4 mr-1" />;
      default: return <User className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
      />
      
      <main className={`
        flex-1 transition-all duration-300 
        ${isSidebarExpanded ? 'ml-64' : 'ml-20'}
        p-6 overflow-y-auto
      `}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <ClipboardCheck className="h-8 w-8 mr-3" />
            Gestion des Pré-États des Lieux
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Total pré-EDL</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.total}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.total}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Pré-EDL enregistrés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Planifiés</h3>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {stats.pending}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.pending}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              À réaliser
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En cours</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.in_progress}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.in_progress}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En cours de réalisation
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Validés</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {stats.validated}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.validated}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Transmis au GT
            </p>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="border-b border-gray-200 dark:border-neutral-700">
            <nav className="flex space-x-4">
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
                <span className="ml-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                  {stats.total}
                </span>
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  filter === 'pending'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <CircleDashed className="h-4 w-4 mr-1" />
                Planifiés
                <span className="ml-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                  {stats.pending}
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
                  {stats.in_progress}
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
                <ClipboardCheck className="h-4 w-4 mr-1" />
                Complétés
                <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                  {stats.completed}
                </span>
              </button>
              <button
                onClick={() => setFilter('validated')}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  filter === 'validated'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <Check className="h-4 w-4 mr-1" />
                Validés
                <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                  {stats.validated}
                </span>
              </button>
            </nav>
          </div>
          <button 
            onClick={() => setIsNewPreEDLModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau pré-EDL
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('preEdlId')}
                  >
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('tenant')}
                  >
                    <div className="flex items-center">
                      Locataire
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('property')}
                  >
                    <div className="flex items-center">
                      Logement
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('scheduledDate')}
                  >
                    <div className="flex items-center">
                      Date prévue
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                    Réalisé par
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Statut
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredPreEDLs.length > 0 ? (
                  filteredPreEDLs.map((preEDL) => (
                    <tr key={preEDL.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {preEDL.preEdlId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <User className="flex-shrink-0 h-4 w-4 mr-2" />
                          {preEDL.tenant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Building className="flex-shrink-0 h-4 w-4 mr-2" />
                          {preEDL.property.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-4 w-4 mr-2" />
                          {new Date(preEDL.scheduledDate).toLocaleDateString()}
                          {preEDL.completionDate && (
                            <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500">
                              (fait le {new Date(preEDL.completionDate).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          {getConductedByIcon(preEDL.conductedBy)}
                          {preEDL.conductedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {getStatusBadge(preEDL.status)}
                        {preEDL.isTenantPresent && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Locataire présent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedPreEDL(preEDL)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                      <div className="flex flex-col items-center justify-center py-8">
                        <ClipboardCheck className="h-10 w-10 mx-auto text-gray-400 dark:text-neutral-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-neutral-200">
                          Aucun pré-EDL trouvé
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                          {filter === 'all' 
                            ? "Aucun pré-EDL ne correspond à votre recherche" 
                            : `Vous n'avez aucun pré-EDL ${filter === 'pending' ? 'planifié' : filter === 'in_progress' ? 'en cours' : filter === 'completed' ? 'complété' : 'validé'}`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedPreEDL && (
        <PreEDLModal
          preEDL={selectedPreEDL}
          onClose={() => setSelectedPreEDL(null)}
          onValidate={() => handleValidatePreEDL(selectedPreEDL)}
        />
      )}

      <NewPreEDLModal
        isOpen={isNewPreEDLModalOpen}
        onClose={() => setIsNewPreEDLModalOpen(false)}
        onSubmit={handleAddNewPreEDL}
        properties={properties}
        tenants={tenants}
      />
    </div>
  );
}