'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  FileText,
  ClipboardCheck,
  Building,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  Info,
  FileSignature,
  ClipboardList,
  Mail,
  Plus,
  Send,
  User,
  Search,
  CircleDashed,
  Check,
  ChevronUp,
  ChevronDown,
  Phone,
  Ruler,
  Hash,
  BookOpen,
  FileInput,
  FileOutput,
  CalendarDays,
  MessageSquare, 
  ArrowUpDown, Wallet
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

interface LeaveNotice {
  id: string;
  noticeId: string;
  tenant: Tenant;
  property: Property;
  status: 'received' | 'processed' | 'litigation' | 'completed';
  noticeDate: string;
  leaveDate: string;
  receptionDate?: string;
  noticeType: 'letter' | 'email' | 'in_person';
  acknowledgmentReceipt: boolean;
  pendingPayments: boolean;
  comments?: string;
  sentTo?: {
    contentieux?: boolean;
    comptabilite?: boolean;
    gardien?: boolean;
    gestionnaireTechnique?: boolean;
    serviceSocial?: boolean;
  };
  diagnosticsRequired?: string[];
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  
  
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
              ${item.label === 'Déclarations Congé' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const LeaveNoticeModal: React.FC<{ 
  notice: LeaveNotice, 
  onClose: () => void, 
  onSendToServices: () => void 
}> = ({ notice, onClose, onSendToServices }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSendToServices = async () => {
    setIsSending(true);
    setSendSuccess(false);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Appeler la fonction parente
      onSendToServices();
      
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi aux services", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <FileSignature className="h-6 w-6 mr-2" />
              Détails déclaration - {notice.noticeId}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <XCircle />
            </button>
          </div>

          {sendSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center dark:bg-green-900 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              La déclaration a bien été envoyée aux services concernés
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations locataire
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Nom:</span> {notice.tenant.name}</p>
                <p><span className="font-medium">ID:</span> {notice.tenant.id}</p>
                <p><span className="font-medium">Contact:</span> {notice.tenant.contact}</p>
                <p><span className="font-medium">Email:</span> {notice.tenant.email}</p>
                <p><span className="font-medium">Contact urgence:</span> {notice.tenant.emergencyContact}</p>
                {notice.tenant.socialFollowup && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    <Info className="inline h-4 w-4 mr-1" />
                    Suivi social actif
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Informations logement
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Adresse:</span> {notice.property.address}</p>
                <p><span className="font-medium">Localisation:</span> {notice.property.building}, {notice.property.floor}, Porte {notice.property.doorNumber}</p>
                <p><span className="font-medium">Type:</span> {notice.property.type} ({notice.property.surface}m²)</p>
                <p><span className="font-medium">Année construction:</span> {notice.property.constructionYear}</p>
                {notice.property.energyClass && (
                  <p><span className="font-medium">Classe énergie:</span> {notice.property.energyClass}</p>
                )}
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
                Dates clés
              </h3>
              {expandedSection === 'dates' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'dates' && (
              <div className="mt-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Notification: {new Date(notice.noticeDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Départ: {new Date(notice.leaveDate).toLocaleDateString()}</span>
                  </div>
                  {notice.receptionDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Réception AR: {new Date(notice.receptionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('status')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Statut et notifications
              </h3>
              {expandedSection === 'status' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'status' && (
              <div className="mt-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {notice.noticeType === 'letter' ? 'Courrier' : notice.noticeType === 'email' ? 'Email' : 'En personne'}</p>
                  <p><span className="font-medium">AR:</span> {notice.acknowledgmentReceipt ? 'Oui' : 'Non'}</p>
                  <p><span className="font-medium">Impayés:</span> {notice.pendingPayments ? 'Oui' : 'Non'}</p>
                  <p>
                    <span className="font-medium">Envoyé à:</span> 
                    {notice.sentTo?.contentieux && ' Contentieux,'}
                    {notice.sentTo?.comptabilite && ' Comptabilité,'}
                    {notice.sentTo?.gardien && ' Gardien,'}
                    {notice.sentTo?.gestionnaireTechnique && ' Gestionnaire Technique,'}
                    {notice.sentTo?.serviceSocial && ' Service Social'}
                    {!notice.sentTo?.contentieux && !notice.sentTo?.comptabilite && 
                     !notice.sentTo?.gardien && !notice.sentTo?.gestionnaireTechnique && 
                     !notice.sentTo?.serviceSocial && ' Aucun service'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {notice.diagnosticsRequired && notice.diagnosticsRequired.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('diagnostics')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Diagnostics requis ({notice.diagnosticsRequired.length})
                </h3>
                {expandedSection === 'diagnostics' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'diagnostics' && (
                <div className="mt-3 p-3 border rounded-lg">
                  <ul className="list-disc pl-5 space-y-1">
                    {notice.diagnosticsRequired.map((diag, index) => (
                      <li key={index}>{diag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {notice.comments && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('comments')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Commentaires
                </h3>
                {expandedSection === 'comments' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'comments' && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50 dark:bg-neutral-700">
                  <p>{notice.comments}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={handleSendToServices}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${
                notice.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={notice.status === 'completed' || isSending}
            >
              {isSending ? (
                <>
                  <CircleDashed className="h-5 w-5 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer aux services
                </>
              )}
            </button>
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

const NewNoticeModal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (newNotice: Omit<LeaveNotice, 'id' | 'noticeId' | 'status' | 'diagnosticsRequired' | 'sentTo'>) => void,
  properties: Property[],
  tenants: Tenant[]
}> = ({ isOpen, onClose, onSubmit, properties, tenants }) => {
  const [formData, setFormData] = useState<Omit<LeaveNotice, 'id' | 'noticeId' | 'status' | 'diagnosticsRequired' | 'sentTo'>>({
    tenant: tenants[0],
    property: properties[0],
    noticeDate: new Date().toISOString().split('T')[0],
    leaveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    noticeType: 'letter',
    acknowledgmentReceipt: true,
    pendingPayments: false,
    comments: ''
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
              <FileInput className="h-8 w-8 mr-3" />
              Nouvelle déclaration de congé
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
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Phone className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.tenant.contact}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Mail className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.tenant.email}</span>
                      </div>
                    </div>
                  </div>

                  {formData.tenant.socialFollowup && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center border border-orange-200 dark:border-orange-800">
                      <Info className="h-5 w-5 mr-2 text-orange-500 dark:text-orange-400" />
                      <span className="text-base">Ce locataire a un suivi social actif</span>
                    </div>
                  )}
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

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <BookOpen className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.property.type}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Surface</label>
                      <div className="flex items-center p-3 bg-white dark:bg-neutral-600 rounded-lg border border-gray-200 dark:border-neutral-500">
                        <Ruler className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
                        <span className="text-lg">{formData.property.surface}m²</span>
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
                Dates et modalités
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-2">Date notification*</label>
                  <input
                    type="date"
                    name="noticeDate"
                    value={formData.noticeDate}
                    onChange={handleInputChange}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Date départ*</label>
                  <input
                    type="date"
                    name="leaveDate"
                    value={formData.leaveDate}
                    onChange={handleInputChange}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Type notification*</label>
                  <select
                    name="noticeType"
                    value={formData.noticeType}
                    onChange={handleInputChange}
                    className="w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="letter">Courrier</option>
                    <option value="email">Email</option>
                    <option value="in_person">En personne</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="acknowledgmentReceipt"
                    checked={formData.acknowledgmentReceipt}
                    onChange={handleInputChange}
                    className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500"
                  />
                  <label className="text-lg font-medium">Accusé de réception</label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="pendingPayments"
                    checked={formData.pendingPayments}
                    onChange={handleInputChange}
                    className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500"
                  />
                  <label className="text-lg font-medium">Impayés</label>
                </div>
              </div>
            </div>

            {/* Section Commentaires */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-medium text-xl mb-4 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3" />
                Commentaires
              </h3>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={4}
                className="w-full border-2 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-600 dark:border-neutral-500 text-lg"
                placeholder="Ajoutez des commentaires si nécessaire..."
              />
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
                Enregistrer la déclaration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function GLDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<LeaveNotice | null>(null);
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'received' | 'processed' | 'litigation'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'ascending' | 'descending'} | null>(null);

  // Données simulées basées sur le cahier des charges
  const [tenants] = useState<Tenant[]>([
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

  const [properties] = useState<Property[]>([
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

  const [leaveNotices, setLeaveNotices] = useState<LeaveNotice[]>([
    {
      id: '1',
      noticeId: '2024-001',
      tenant: tenants[0],
      property: properties[0],
      status: 'processed',
      noticeDate: new Date().toISOString(),
      leaveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      receptionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      noticeType: 'letter',
      acknowledgmentReceipt: true,
      pendingPayments: false,
      diagnosticsRequired: ['DPE', 'Électricité'],
      sentTo: {
        gardien: true,
        gestionnaireTechnique: true
      }
    },
    {
      id: '2',
      noticeId: '2024-002',
      tenant: tenants[1],
      property: properties[1],
      status: 'litigation',
      noticeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      leaveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      receptionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      noticeType: 'email',
      acknowledgmentReceipt: false,
      pendingPayments: true,
      diagnosticsRequired: ['Amiante', 'Plomb', 'Électricité', 'Gaz'],
      comments: 'Impayés à régulariser. Logement construit avant 1997, nécessite diagnostic amiante.',
      sentTo: {
        contentieux: true,
        comptabilite: true,
        gardien: true,
        gestionnaireTechnique: true,
        serviceSocial: true
      }
    },
    {
      id: '3',
      noticeId: '2024-003',
      tenant: tenants[2],
      property: properties[2],
      status: 'received',
      noticeDate: new Date().toISOString(),
      leaveDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      noticeType: 'in_person',
      acknowledgmentReceipt: true,
      pendingPayments: false,
      diagnosticsRequired: ['DPE']
    }
  ]);

  const handleSendToServices = (notice: LeaveNotice) => {
    const updatedNotice: LeaveNotice = {
      ...notice,
      sentTo: {
        ...notice.sentTo,
        contentieux: notice.pendingPayments ? true : (notice.sentTo?.contentieux ?? false),
        comptabilite: notice.pendingPayments ? true : (notice.sentTo?.comptabilite ?? false),
        gardien: true,
        gestionnaireTechnique: true,
        serviceSocial: notice.tenant.socialFollowup ? true : (notice.sentTo?.serviceSocial ?? false)
      },
      status: notice.pendingPayments ? 'litigation' : 'processed',
      diagnosticsRequired: getRequiredDiagnostics(notice.property)
    };

    setLeaveNotices(leaveNotices.map(n =>
      n.id === notice.id ? updatedNotice : n
    ));
    setSelectedNotice(updatedNotice);
  };

  const handleAddNewNotice = (newNotice: Omit<LeaveNotice, 'id' | 'noticeId' | 'status' | 'diagnosticsRequired' | 'sentTo'>) => {
    const noticeId = `2024-${(leaveNotices.length + 100).toString().padStart(3, '0')}`;
    
    const diagnosticsRequired = getRequiredDiagnostics(newNotice.property);
    
    const notice: LeaveNotice = {
      ...newNotice,
      id: (leaveNotices.length + 1).toString(),
      noticeId,
      status: 'received',
      diagnosticsRequired,
      sentTo: {}
    };
    
    setLeaveNotices([...leaveNotices, notice]);
    setIsNewNoticeModalOpen(false);
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

  const sortedNotices = React.useMemo(() => {
    const sortableNotices = [...leaveNotices];
    if (sortConfig !== null) {
      sortableNotices.sort((a, b) => {
        // Gestion des différents types de tri
        if (sortConfig.key === 'noticeId') {
          return sortConfig.direction === 'ascending' 
            ? a.noticeId.localeCompare(b.noticeId)
            : b.noticeId.localeCompare(a.noticeId);
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
        if (sortConfig.key === 'noticeDate' || sortConfig.key === 'leaveDate') {
          return sortConfig.direction === 'ascending' 
            ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
            : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
        }
        if (sortConfig.key === 'status') {
          return sortConfig.direction === 'ascending' 
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      });
    }
    return sortableNotices;
  }, [leaveNotices, sortConfig]);

  const filteredNotices = sortedNotices.filter(notice => {
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

  // Statistiques
  const stats = {
    total: leaveNotices.length,
    received: leaveNotices.filter(n => n.status === 'received').length,
    processed: leaveNotices.filter(n => n.status === 'processed').length,
    litigation: leaveNotices.filter(n => n.status === 'litigation').length,
    withPayments: leaveNotices.filter(n => n.pendingPayments).length,
    socialCases: leaveNotices.filter(n => n.tenant.socialFollowup).length
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'received': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Reçu</span>;
      case 'processed': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Traité</span>;
      case 'litigation': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Litige</span>;
      case 'completed': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Terminé</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Inconnu</span>;
    }
  };

  const getNoticeTypeIcon = (type: string) => {
    switch(type) {
      case 'letter': return <FileText className="h-4 w-4 mr-1" />;
      case 'email': return <Mail className="h-4 w-4 mr-1" />;
      case 'in_person': return <User className="h-4 w-4 mr-1" />;
      default: return <FileText className="h-4 w-4 mr-1" />;
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
            <Home className="h-8 w-8 mr-3" />
            Tableau de bord Gestion Locative
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Total déclarations</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.total}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.total}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Déclarations enregistrées
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En attente</h3>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {stats.received}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.received}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              À traiter
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En litige</h3>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {stats.litigation}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.litigation}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Avec impayés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Suivi social</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-200">
                {stats.socialCases}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.socialCases}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Locataires suivis
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
                onClick={() => setFilter('received')}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  filter === 'received'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <CircleDashed className="h-4 w-4 mr-1" />
                Reçus
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {stats.received}
                </span>
              </button>
              <button
                onClick={() => setFilter('processed')}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  filter === 'processed'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <Check className="h-4 w-4 mr-1" />
                Traités
                <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                  {stats.processed}
                </span>
              </button>
              <button
                onClick={() => setFilter('litigation')}
                className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                  filter === 'litigation'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                }`}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Litiges
                <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                  {stats.litigation}
                </span>
              </button>
            </nav>
          </div>
          <button 
            onClick={() => setIsNewNoticeModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle déclaration
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
                    onClick={() => requestSort('noticeId')}
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
                    onClick={() => requestSort('noticeDate')}
                  >
                    <div className="flex items-center">
                      Date notification
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('leaveDate')}
                  >
                    <div className="flex items-center">
                      Date départ
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                    Type
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
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-neutral-200">
                        {notice.noticeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <User className="flex-shrink-0 h-4 w-4 mr-2" />
                          {notice.tenant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Building className="flex-shrink-0 h-4 w-4 mr-2" />
                          {notice.property.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-4 w-4 mr-2" />
                          {new Date(notice.noticeDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 h-4 w-4 mr-2" />
                          {new Date(notice.leaveDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center">
                          {getNoticeTypeIcon(notice.noticeType)}
                          {notice.noticeType === 'letter' ? 'Courrier' : notice.noticeType === 'email' ? 'Email' : 'En personne'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {getStatusBadge(notice.status)}
                        {notice.pendingPayments && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Impayés
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedNotice(notice)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FileText className="h-10 w-10 mx-auto text-gray-400 dark:text-neutral-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-neutral-200">
                          Aucune déclaration trouvée
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                          {filter === 'all' 
                            ? "Aucune déclaration ne correspond à votre recherche" 
                            : `Vous n'avez aucune déclaration ${filter === 'received' ? 'reçue' : filter === 'processed' ? 'traitée' : 'en litige'}`}
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

      {selectedNotice && (
        <LeaveNoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onSendToServices={() => handleSendToServices(selectedNotice)}
        />
      )}

      <NewNoticeModal
        isOpen={isNewNoticeModalOpen}
        onClose={() => setIsNewNoticeModalOpen(false)}
        onSubmit={handleAddNewNotice}
        properties={properties}
        tenants={tenants}
      />
    </div>
  );
}