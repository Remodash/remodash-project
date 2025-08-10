'use client';

import React, { useState, useRef, ChangeEvent, JSX } from 'react';
import {
  Users, UserPlus, FileText, FileUp, FileDown,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Eye, EyeOff, Search, Trash2, Pencil,
  Building, HardHat, ClipboardList, ClipboardCheck,
  CreditCard, Key, Lock, LayoutDashboard,
  Shield, Mail, Settings, UserCog, UserCircle,
  Home, Hammer, AlertCircle, Clock, PieChart,
  X, ArrowLeft, FileSearch, AlertTriangle, Info, Phone
} from 'lucide-react';
import Link from 'next/link';

// Types et interfaces
type UserRole = 'admin' | 'ga' | 'gl' | 'gt' | 'pd' | 'pt' | 'ra' | 'sc' | 'sco';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  role: UserRole;
  color: string;
}

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  currentRole: UserRole;
}

// Données et constantes
const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  ga: 'Gardien',
  gl: 'Gestionnaire Locative',
  gt: 'Gestionnaire Technique',
  pd: 'Prestataire Diagnostic',
  pt: 'Prestataire Travaux',
  ra: 'Responsable d\'Agence',
  sc: 'Service Contentieux',
  sco: 'Service Comptable'
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  ra: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ga: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  gl: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  gt: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  pd: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  pt: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  sc: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  sco: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
};

const roleIcons: Record<UserRole, JSX.Element> = {
  admin: <Shield className="h-4 w-4" />,
  ga: <Key className="h-4 w-4" />,
  gl: <Building className="h-4 w-4" />,
  gt: <HardHat className="h-4 w-4" />,
  pd: <ClipboardList className="h-4 w-4" />,
  pt: <ClipboardCheck className="h-4 w-4" />,
  ra: <UserCog className="h-4 w-4" />,
  sc: <FileText className="h-4 w-4" />,
  sco: <CreditCard className="h-4 w-4" />
};

// Composants
const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar, currentRole }) => {
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', href: '/dashboard/admin', role: 'admin', color: 'bg-red-500' },
    { icon: Users, label: 'Utilisateurs', href: '/dashboard/admin/users', role: 'admin', color: 'bg-red-500' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/admin/settings', role: 'admin', color: 'bg-red-500' },
    { icon: Building, label: 'Locatives', href: '/dashboard/gl', role: 'gl', color: 'bg-green-500' },
    { icon: HardHat, label: 'Technique', href: '/dashboard/gt', role: 'gt', color: 'bg-amber-500' },
    { icon: Key, label: 'Gardiens', href: '/dashboard/ga', role: 'ga', color: 'bg-blue-500' },
    { icon: UserCog, label: 'Agence', href: '/dashboard/ra', role: 'ra', color: 'bg-purple-500' },
    { icon: ClipboardList, label: 'Diagnostics', href: '/dashboard/pd', role: 'pd', color: 'bg-indigo-500' },
    { icon: ClipboardCheck, label: 'Travaux', href: '/dashboard/pt', role: 'pt', color: 'bg-teal-500' },
    { icon: FileText, label: 'Contentieux', href: '/dashboard/sc', role: 'sc', color: 'bg-orange-500' },
    { icon: CreditCard, label: 'Comptabilité', href: '/dashboard/sco', role: 'sco', color: 'bg-cyan-500' }
  ];

  const filteredItems = sidebarItems.filter(item => 
    currentRole === 'admin' || item.role === currentRole
  );

  const adminItems = filteredItems.filter(item => item.role === 'admin');
  const otherItems = filteredItems.filter(item => item.role !== 'admin');

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-neutral-200 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Remodash
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          aria-label={isExpanded ? "Réduire le menu" : "Étendre le menu"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {adminItems.length > 0 && (
          <div className="mb-6 bg-white dark:bg-neutral-800 p-2 rounded-lg mx-2">
            <h2 className={`px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              Administration
            </h2>
            {adminItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={index} 
                  href={item.href} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${item.href.includes(currentRole) ? `${item.color} text-white` : 'hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div>
          <h2 className={`px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Tableaux de Bord
          </h2>
          <div className="grid grid-cols-1 gap-1 px-2">
            {otherItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={index} 
                  href={item.href} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${item.href.includes(currentRole) ? `${item.color} text-white` : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300'}`}
                >
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">{roleLabels[item.role]}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white p-2 rounded-full">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <p className="text-sm font-medium">Admin System</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1', firstName: 'Admin', lastName: 'System', email: 'admin@remodash.com', role: 'admin', phone: '0600000000',
      createdAt: '2024-01-01', lastLogin: '2024-07-20T10:30:00', isActive: true
    },
    {
      id: '2', firstName: 'Jean', lastName: 'Dupont', email: 'gl1@remodash.com', role: 'gl', phone: '0612345678',
      createdAt: '2024-02-15', lastLogin: '2024-07-19T14:45:00', isActive: true
    },
    {
      id: '3', firstName: 'Marie', lastName: 'Martin', email: 'gt1@remodash.com', role: 'gt', phone: '0623456789',
      createdAt: '2024-03-10', lastLogin: '2024-07-20T09:15:00', isActive: true
    },
    {
      id: '4', firstName: 'Pierre', lastName: 'Durand', email: 'ga1@remodash.com', role: 'ga', phone: '0634567890',
      createdAt: '2024-04-05', lastLogin: '2024-07-18T16:20:00', isActive: true
    },
    {
      id: '5', firstName: 'Diagnostic', lastName: 'Expert', email: 'pd1@remodash.com', role: 'pd', phone: '0645678901',
      createdAt: '2024-05-20', lastLogin: '2024-07-17T11:10:00', isActive: true
    },
    {
      id: '6', firstName: 'Thomas', lastName: 'Lefevre', email: 'sc1@remodash.com', role: 'sc', phone: '0678901234',
      createdAt: '2024-06-12', lastLogin: '2024-07-15T10:00:00', isActive: true
    },
    {
      id: '7', firstName: 'Sophie', lastName: 'Dubois', email: 'sco1@remodash.com', role: 'sco', phone: '0689012345',
      createdAt: '2024-07-01', lastLogin: '2024-07-20T11:20:00', isActive: false
    },
    {
      id: '8', firstName: 'Paul', lastName: 'Bernard', email: 'ra1@remodash.com', role: 'ra', phone: '0690123456',
      createdAt: '2024-07-05', lastLogin: '2024-07-19T08:45:00', isActive: true
    },
    {
      id: '9', firstName: 'Lucie', lastName: 'Petit', email: 'pt1@remodash.com', role: 'pt', phone: '0601234567',
      createdAt: '2024-07-10', lastLogin: '2024-07-18T15:30:00', isActive: true
    },
    {
      id: '10', firstName: 'Marc', lastName: 'Robert', email: 'gl2@remodash.com', role: 'gl', phone: '0612345678',
      createdAt: '2024-07-15', lastLogin: '2024-07-20T12:15:00', isActive: false
    }
  ]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>({
    firstName: '', lastName: '', email: '', role: 'gl', phone: '', isActive: true
  });

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    if (isEditUserModalOpen && selectedUser) {
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...formData, id: user.id, createdAt: user.createdAt, lastLogin: user.lastLogin } : user
      );
      setUsers(updatedUsers);
      setIsEditUserModalOpen(false);
    } else {
      const newUser: User = { ...formData, id: (users.length + 1).toString(), createdAt: now };
      setUsers([...users, newUser]);
      setIsAddUserModalOpen(false);
    }
    setFormData({ firstName: '', lastName: '', email: '', role: 'gl', phone: '', isActive: true });
    setCurrentPage(1); // Reset to first page after adding/editing
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role,
      phone: user.phone || '', isActive: user.isActive
    });
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      setUsers(users.filter(user => user.id !== id));
      // Adjust current page if we deleted the last item on the page
      if (filteredUsers.length % usersPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleToggleActive = (id: string) => {
    setUsers(users.map(user => user.id === id ? { ...user, isActive: !user.isActive } : user));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (!result) { alert('Erreur de lecture du fichier'); setIsLoading(false); return; }

        let importedData: any[];
        try {
          importedData = JSON.parse(result.toString());
          if (!Array.isArray(importedData)) { throw new Error('Le fichier JSON doit contenir un tableau'); }
        } catch (error) { throw new Error('Format JSON invalide'); }

        const importedUsers = importedData
          .filter(item => item.email && item.role)
          .map((item, index) => ({
            id: (users.length + index + 1).toString(),
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            email: item.email,
            role: item.role,
            phone: item.phone || '',
            createdAt: item.createdAt || new Date().toISOString().split('T')[0],
            lastLogin: item.lastLogin || undefined,
            isActive: item.isActive !== undefined ? item.isActive : true
          }));

        if (importedUsers.length === 0) { throw new Error('Aucune donnée valide trouvée dans le fichier'); }

        setUsers([...users, ...importedUsers]);
        alert(`${importedUsers.length} utilisateurs importés avec succès`);
        setCurrentPage(Math.ceil((users.length + importedUsers.length) / usersPerPage)); // Go to last page

      } catch (error) {
        console.error('Erreur d\'import:', error);
        alert(`Erreur lors de l'import: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `remodash-users-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      roleLabels[user.role].toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    roles: Object.keys(roleLabels).map(role => ({
      role: role as UserRole,
      count: users.filter(u => u.role === role).length
    }))
  };

  // Pagination controls component
  const PaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500 dark:text-neutral-400">
          Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Précédent
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Suivant
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
        currentRole={currentRole}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            Administration des Utilisateurs
          </h1>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Utilisateurs', value: stats.total, icon: Users, color: 'gray' },
            { label: 'Actifs', value: stats.active, icon: CheckCircle2, color: 'green' },
            { label: 'Inactifs', value: stats.inactive, icon: XCircle, color: 'red' },
            { label: 'Rôles', value: stats.roles.length, icon: UserCog, color: 'blue' }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">{item.label}</h3>
                <span className={`bg-${item.color}-100 text-${item.color}-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-${item.color}-900 dark:text-${item.color}-200`}>
                  {item.value}
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
          {stats.roles.map(({ role, count }) => (
            <button
              key={role}
              onClick={() => {
                setSearchTerm(roleLabels[role]);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center whitespace-nowrap transition-colors ${
                searchTerm === roleLabels[role] 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              <span className="flex items-center">
                {roleIcons[role]}
                <span className="ml-1.5">{roleLabels[role]} ({count})</span>
              </span>
            </button>
          ))}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-full text-sm flex items-center bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-500"
            >
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Liste des Utilisateurs</h2>
              <div className="flex space-x-3">
                <button
                  onClick={triggerFileInput}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FileUp className="h-4 w-4 mr-2 animate-spin" />
                      Import...
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4 mr-2" />
                      Importer
                    </>
                  )}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".json" className="hidden" disabled={isLoading} />
                <button 
                  onClick={exportUsers} 
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Exporter
                </button>
                <button 
                  onClick={() => setIsAddUserModalOpen(true)} 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Créé le</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentUsers.length > 0 ? (
                  currentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <UserCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-neutral-200">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-neutral-400">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                                <span className="inline-flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {user.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {roleIcons[user.role]}
                          <span className="ml-1">{roleLabels[user.role]}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Inactif
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-neutral-400">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="Modifier"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className={`p-1 rounded-full ${user.isActive ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30'}`}
                            title={user.isActive ? "Désactiver" : "Activer"}
                          >
                            {user.isActive ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-12 w-12 text-gray-400 dark:text-neutral-600 mb-2" />
                        <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                        <p className="text-sm mt-1">Essayez de modifier votre recherche ou ajoutez un nouvel utilisateur</p>
                        <button
                          onClick={() => setIsAddUserModalOpen(true)}
                          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajouter un utilisateur
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-700">
              <PaginationControls />
            </div>
          )}
        </div>
      </main>

      {/* Modal pour ajouter/modifier un utilisateur */}
      {(isAddUserModalOpen || isEditUserModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  {isEditUserModalOpen ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
                </h2>
                <button 
                  onClick={() => isEditUserModalOpen ? setIsEditUserModalOpen(false) : setIsAddUserModalOpen(false)} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
                >
                  <X />
                </button>
              </div>
              
              <form onSubmit={handleSubmitUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rôle*</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                      required
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                  />
                  <label className="ml-2 text-sm font-medium">Compte actif</label>
                </div>
                
                {isEditUserModalOpen && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Pour modifier le mot de passe, un lien de réinitialisation sera envoyé à l'utilisateur.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => isEditUserModalOpen ? setIsEditUserModalOpen(false) : setIsAddUserModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isEditUserModalOpen ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;