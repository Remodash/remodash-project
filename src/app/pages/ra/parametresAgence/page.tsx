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
  User,
  UserPlus,
  Shield,
  HardHat,
  ClipboardList,
  Calendar,
  Key,
  Edit,
  Trash2,
  Search,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

// Types basés sur le cahier des charges
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: 'ra' | 'gt' | 'gl' | 'gardien' | 'cedl' | 'comptabilité' | 'contentieux' | 'attribution';
  email: string;
  phone: string;
  assignedProperties?: string[];
  isActive: boolean;
  hireDate: string;
  lastTraining?: string;
  permissions: {
    diagnostics: boolean;
    workOrders: boolean;
    inventory: boolean;
    finances: boolean;
    tenantManagement: boolean;
  };
}

interface AgencySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  interventionHours: string;
  emergencyContact: string;
  paymentDeadline: number;
  penaltyRate: number;
  penaltyCap: number;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  
  
  const sidebarItems = [
  { icon: Home, label: 'Tableau de Bord', href: '/dashboard/ra' },
  { icon: FileText, label: 'Approbations Diagnostics', href: '/pages/ra/approbationsDiagnostics' },
  { icon: ClipboardCheck, label: 'Validation Bons Travaux', href: '/pages/ra/validationBonsTravaux' },
  { icon: Hammer, label: 'Suivi Travaux', href: '/pages/ra/suiviTravaux' },
  { icon: Building, label: 'Parc Immobilier', href: '/pages/ra/parcImmobilier' },
  { icon: Users, label: 'Locataires', href: '/pages/ra/locataires' },
  { icon: CreditCard, label: 'Indicateurs Financiers', href: '/pages/ra/indicateursFinanciers' },
  { icon: Settings, label: 'Paramètres Agence', href: '/pages/ra/parametresAgence' }
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
          Remodash RA
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
              ${item.label === 'Paramètres Agence' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const StaffMemberModal: React.FC<{
  member: StaffMember | null;
  onClose: () => void;
  onSave: (member: StaffMember) => void;
  mode: 'create' | 'edit';
}> = ({ member, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState<StaffMember>(member || {
    id: '',
    firstName: '',
    lastName: '',
    role: 'gl',
    email: '',
    phone: '',
    isActive: true,
    hireDate: new Date().toISOString().split('T')[0],
    permissions: {
      diagnostics: false,
      workOrders: false,
      inventory: false,
      finances: false,
      tenantManagement: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1] as keyof typeof formData.permissions;
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: (e.target as HTMLInputElement).checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'ra': return 'Responsable d&apos;Agence';
      case 'gt': return 'Gestionnaire Technique';
      case 'gl': return 'Gestionnaire Locative';
      case 'gardien': return 'Gardien(ne)';
      case 'cedl': return 'Chargé(e) d&apos;EDL';
      case 'comptabilité': return 'Service Comptabilité';
      case 'contentieux': return 'Service Contentieux';
      case 'attribution': return 'Service Attribution';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <User className="h-8 w-8 mr-2" />
              {mode === 'create' ? 'Ajouter un membre' : 'Modifier membre'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="role">
                  Fonction
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="ra">Responsable d&apos;Agence</option>
                  <option value="gt">Gestionnaire Technique</option>
                  <option value="gl">Gestionnaire Locative</option>
                  <option value="gardien">Gardien(ne)</option>
                  <option value="cedl">Chargé(e) d&apos;EDL</option>
                  <option value="comptabilité">Service Comptabilité</option>
                  <option value="contentieux">Service Contentieux</option>
                  <option value="attribution">Service Attribution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="hireDate">
                  Date d&apos;embauche
                </label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Actif
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-lg mb-3">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permissions.diagnostics"
                    name="permissions.diagnostics"
                    checked={formData.permissions.diagnostics}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="permissions.diagnostics" className="text-sm">
                    Gestion diagnostics
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permissions.workOrders"
                    name="permissions.workOrders"
                    checked={formData.permissions.workOrders}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="permissions.workOrders" className="text-sm">
                    Bons de travaux
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permissions.inventory"
                    name="permissions.inventory"
                    checked={formData.permissions.inventory}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="permissions.inventory" className="text-sm">
                    États des lieux
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permissions.finances"
                    name="permissions.finances"
                    checked={formData.permissions.finances}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="permissions.finances" className="text-sm">
                    Accès financier
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="permissions.tenantManagement"
                    name="permissions.tenantManagement"
                    checked={formData.permissions.tenantManagement}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="permissions.tenantManagement" className="text-sm">
                    Gestion locataires
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                {mode === 'create' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AgencySettingsModal: React.FC<{
  settings: AgencySettings;
  onClose: () => void;
  onSave: (settings: AgencySettings) => void;
}> = ({ settings, onClose, onSave }) => {
  const [formData, setFormData] = useState<AgencySettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Settings className="h-8 w-8 mr-2" />
              Paramètres de l&apos;agence
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Nom de l&apos;agence
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="address">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="workingHours">
                  Heures d&apos;ouverture
                </label>
                <input
                  type="text"
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="interventionHours">
                  Heures d&apos;intervention
                </label>
                <input
                  type="text"
                  id="interventionHours"
                  name="interventionHours"
                  value={formData.interventionHours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="emergencyContact">
                  Contact urgence
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="paymentDeadline">
                  Délai paiement (jours)
                </label>
                <input
                  type="number"
                  id="paymentDeadline"
                  name="paymentDeadline"
                  value={formData.paymentDeadline}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="penaltyRate">
                  Taux pénalité (%)
                </label>
                <input
                  type="number"
                  id="penaltyRate"
                  name="penaltyRate"
                  value={formData.penaltyRate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="penaltyCap">
                  Plafond pénalité (%)
                </label>
                <input
                  type="number"
                  id="penaltyCap"
                  name="penaltyCap"
                  value={formData.penaltyCap}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'ra',
      email: 'marie.dupont@agence.com',
      phone: '06 12 34 56 78',
      isActive: true,
      hireDate: '2020-01-15',
      lastTraining: '2023-05-10',
      permissions: {
        diagnostics: true,
        workOrders: true,
        inventory: true,
        finances: true,
        tenantManagement: true
      }
    },
    {
      id: '2',
      firstName: 'Jean',
      lastName: 'Martin',
      role: 'gt',
      email: 'jean.martin@agence.com',
      phone: '06 23 45 67 89',
      assignedProperties: ['RES-LUM', 'RES-SOL'],
      isActive: true,
      hireDate: '2021-03-22',
      lastTraining: '2023-06-15',
      permissions: {
        diagnostics: true,
        workOrders: true,
        inventory: true,
        finances: false,
        tenantManagement: false
      }
    },
    {
      id: '3',
      firstName: 'Sophie',
      lastName: 'Leroy',
      role: 'gl',
      email: 'sophie.leroy@agence.com',
      phone: '06 34 56 78 90',
      isActive: true,
      hireDate: '2022-05-10',
      permissions: {
        diagnostics: false,
        workOrders: false,
        inventory: true,
        finances: false,
        tenantManagement: true
      }
    },
    {
      id: '4',
      firstName: 'Paul',
      lastName: 'Dubois',
      role: 'gardien',
      email: 'paul.dubois@agence.com',
      phone: '06 45 67 89 01',
      assignedProperties: ['RES-LUM'],
      isActive: true,
      hireDate: '2022-08-30',
      lastTraining: '2023-01-20',
      permissions: {
        diagnostics: false,
        workOrders: false,
        inventory: true,
        finances: false,
        tenantManagement: false
      }
    },
    {
      id: '5',
      firstName: 'Lucie',
      lastName: 'Bernard',
      role: 'cedl',
      email: 'lucie.bernard@agence.com',
      phone: '06 56 78 90 12',
      isActive: true,
      hireDate: '2023-02-15',
      permissions: {
        diagnostics: false,
        workOrders: false,
        inventory: true,
        finances: false,
        tenantManagement: false
      }
    },
    {
      id: '6',
      firstName: 'Thomas',
      lastName: 'Petit',
      role: 'comptabilité',
      email: 'thomas.petit@agence.com',
      phone: '06 67 89 01 23',
      isActive: true,
      hireDate: '2021-11-05',
      permissions: {
        diagnostics: false,
        workOrders: false,
        inventory: false,
        finances: true,
        tenantManagement: false
      }
    }
  ]);

  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    name: 'Agence Immobilière Paris Est',
    address: '25 Rue de la République, 75011 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@agence-paris-est.com',
    workingHours: 'Lundi-Vendredi 9h-12h30 / 14h-18h',
    interventionHours: 'Lundi-Samedi 8h-20h',
    emergencyContact: '06 98 76 54 32 (24h/24)',
    paymentDeadline: 15,
    penaltyRate: 5,
    penaltyCap: 20
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSaveMember = (member: StaffMember) => {
    if (modalMode === 'create') {
      setStaffMembers(prev => [...prev, {
        ...member,
        id: (prev.length + 1).toString()
      }]);
    } else {
      setStaffMembers(prev => prev.map(m => 
        m.id === member.id ? member : m
      ));
    }
    setSelectedMember(null);
    setShowMemberModal(false);
  };

  const handleDeleteMember = (id: string) => {
    setStaffMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSaveSettings = (settings: AgencySettings) => {
    setAgencySettings(settings);
    setShowSettingsModal(false);
  };

  const filteredMembers = staffMembers.filter(member => {
    // Filtre par statut
    if (filter !== 'all' && (
      (filter === 'active' && !member.isActive) ||
      (filter === 'inactive' && member.isActive)
    )) return false;
    
    // Filtre par rôle
    if (roleFilter !== 'all' && member.role !== roleFilter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        member.firstName.toLowerCase().includes(term) ||
        member.lastName.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'ra': return 'Responsable d&apos;Agence';
      case 'gt': return 'Gestionnaire Technique';
      case 'gl': return 'Gestionnaire Locative';
      case 'gardien': return 'Gardien(ne)';
      case 'cedl': return 'Chargé(e) d&apos;EDL';
      case 'comptabilité': return 'Service Comptabilité';
      case 'contentieux': return 'Service Contentieux';
      case 'attribution': return 'Service Attribution';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'ra': return <Shield className="h-4 w-4" />;
      case 'gt': return <HardHat className="h-4 w-4" />;
      case 'gl': return <ClipboardList className="h-4 w-4" />;
      case 'gardien': return <Key className="h-4 w-4" />;
      case 'cedl': return <ClipboardList className="h-4 w-4" />;
      case 'comptabilité': return <CreditCard className="h-4 w-4" />;
      case 'contentieux': return <AlertCircle className="h-4 w-4" />;
      case 'attribution': return <Building className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
            <Settings className="h-8 w-8 mr-3" />
            Paramètres de l&apos;Agence
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div 
            className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowSettingsModal(true)}
          >
            <div className="flex items-center">
              <Building className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-medium">Informations agence</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              {agencySettings.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              {agencySettings.address}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-medium">Effectif total</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {staffMembers.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              {staffMembers.filter(m => m.isActive).length} actifs
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-medium">Prochaine formation</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {staffMembers.filter(m => m.lastTraining).length > 0 ? 
                new Date(Math.max(...staffMembers
                  .filter(m => m.lastTraining)
                  .map(m => new Date(m.lastTraining!).getTime())
                )).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })
                : 'Aucune'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Dernière formation organisée
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Gestion du personnel
          </h2>
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
            <button 
              onClick={() => {
                setSelectedMember(null);
                setModalMode('create');
                setShowMemberModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Ajouter
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label htmlFor="filter" className="block text-sm font-medium mb-1">Statut</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="roleFilter" className="block text-sm font-medium mb-1">Fonction</label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
            >
              <option value="all">Toutes</option>
              <option value="ra">Responsable d&apos;Agence</option>
              <option value="gt">Gestionnaire Technique</option>
              <option value="gl">Gestionnaire Locative</option>
              <option value="gardien">Gardien(ne)</option>
              <option value="cedl">Chargé(e) d&apos;EDL</option>
              <option value="comptabilité">Comptabilité</option>
              <option value="contentieux">Contentieux</option>
              <option value="attribution">Attribution</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Fonction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date embauche</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredMembers.length > 0 ? (
                filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        ID: {member.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {getRoleIcon(member.role)}
                        <span className="ml-2">{getRoleLabel(member.role)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{member.email}</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {member.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {new Date(member.hireDate).toLocaleDateString('fr-FR')}
                      </div>
                      {member.lastTraining && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          Formé le {new Date(member.lastTraining).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.isActive)}`}>
                        {member.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedMember(member);
                            setModalMode('edit');
                            setShowMemberModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                    Aucun membre trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal pour ajouter/modifier un membre */}
      {showMemberModal && (
        <StaffMemberModal
          member={selectedMember}
          onClose={() => {
            setSelectedMember(null);
            setShowMemberModal(false);
          }}
          onSave={handleSaveMember}
          mode={modalMode}
        />
      )}

      {/* Modal pour les paramètres de l'agence */}
      {showSettingsModal && (
        <AgencySettingsModal
          settings={agencySettings}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}