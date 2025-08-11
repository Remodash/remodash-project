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
  CheckCircle2,
  AlertCircle,
  FileUp,
  X,
  Phone,
  MapPin,
  User as UserIcon,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowRightLeft,
  Search,
  Mail
} from 'lucide-react';

// Types
interface PaymentRecord {
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'late';
}

interface Tenant {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  socialSecurityNumber?: string;
  idDocumentType: 'cni' | 'passport' | 'titre_sejour';
  idDocumentNumber?: string;
  idDocumentExpiry?: string;
  familySituation: 'single' | 'married' | 'divorced' | 'widowed' | 'pacs';
  address: string;
  previousAddresses: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profession?: string;
  employmentStatus: 'cdi' | 'cdd' | 'interim' | 'unemployed' | 'retired' | 'student';
  annualIncome?: number;
  housingBenefits: boolean;
  rib?: string;
  paymentHistory: PaymentRecord[];
  currentPropertyId: string;
  currentPropertyAddress: string;
  leaseType: 'plai' | 'plus' | 'pls' | 'free';
  leaseStartDate: string;
  leaseEndDate?: string;
  rentAmount: number;
  chargesAmount: number;
  inventoryStatus: 'pending' | 'completed' | 'dispute';
  status: 'active' | 'leaving' | 'former';
  hasPaymentIncidents: boolean;
  lastPaymentDate?: string;
  comments?: string;
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
              ${item.label === 'Locataires' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const TenantDetailModal: React.FC<{
  tenant: Tenant;
  onClose: () => void;
  onEdit: () => void;
}> = ({ tenant, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Fiche Locataire - {tenant.firstName} {tenant.lastName}
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-neutral-400">
                (ID: {tenant.tenantId})
              </span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <X />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Informations Personnelles
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Prénom</p>
                  <p className="text-gray-800 dark:text-neutral-200">{tenant.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Nom</p>
                  <p className="text-gray-800 dark:text-neutral-200">{tenant.lastName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Date de naissance</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.birthDate ? new Date(tenant.birthDate).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Lieu de naissance</p>
                  <p className="text-gray-800 dark:text-neutral-200">{tenant.birthPlace || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Nationalité</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.nationality || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Situation familiale</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.familySituation === 'single' ? 'Célibataire' :
                   tenant.familySituation === 'married' ? 'Marié(e)' :
                   tenant.familySituation === 'divorced' ? 'Divorcé(e)' :
                   tenant.familySituation === 'widowed' ? 'Veuf/Veuve' : 'PACS'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Informations de Contact
              </h3>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Email</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Téléphone</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Adresse</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Contact urgence</p>
                  <p className="text-gray-800 dark:text-neutral-200">{tenant.emergencyContactName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Téléphone urgence</p>
                  <p className="text-gray-800 dark:text-neutral-200">{tenant.emergencyContactPhone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Situation Professionnelle
              </h3>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Profession</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.profession || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Situation professionnelle</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.employmentStatus === 'cdi' ? 'CDI' :
                   tenant.employmentStatus === 'cdd' ? 'CDD' :
                   tenant.employmentStatus === 'interim' ? 'Intérim' :
                   tenant.employmentStatus === 'unemployed' ? 'Sans emploi' :
                   tenant.employmentStatus === 'retired' ? 'Retraité' : 'Étudiant'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Revenu annuel</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.annualIncome ? `${tenant.annualIncome.toLocaleString('fr-FR')} €` : '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Bénéficie d&apos;APL</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.housingBenefits ? 'Oui' : 'Non'}
                </p>
              </div>
            </div>

            {/* Housing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Informations Locatives
              </h3>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">ID Propriété</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.currentPropertyId}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Adresse du logement</p>
                <p className="text-gray-800 dark:text-neutral-200">{tenant.currentPropertyAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Type de bail</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.leaseType === 'free' ? 'Libre' :
                     tenant.leaseType === 'plai' ? 'PLAI' :
                     tenant.leaseType === 'plus' ? 'PLUS' : 'PLS'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Statut</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.status === 'active' ? 'Actif' :
                     tenant.status === 'leaving' ? 'En départ' : 'Ancien'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Date début bail</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {new Date(tenant.leaseStartDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Date fin bail</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.leaseEndDate ? new Date(tenant.leaseEndDate).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Loyer</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.rentAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">Charges</p>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {tenant.chargesAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">État des lieux</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.inventoryStatus === 'pending' ? 'À faire' :
                   tenant.inventoryStatus === 'completed' ? 'Effectué' : 'Litige'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Incidents de paiement</p>
                <p className="text-gray-800 dark:text-neutral-200">
                  {tenant.hasPaymentIncidents ? 'Oui' : 'Non'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {tenant.paymentHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Historique des Paiements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-neutral-700">
                    <tr>
                      <th className="p-2 text-left text-gray-600 dark:text-neutral-300">Date</th>
                      <th className="p-2 text-left text-gray-600 dark:text-neutral-300">Montant</th>
                      <th className="p-2 text-left text-gray-600 dark:text-neutral-300">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.paymentHistory.map((payment, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-neutral-700">
                        <td className="p-2 text-gray-800 dark:text-neutral-200">
                          {new Date(payment.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-2 text-gray-800 dark:text-neutral-200">
                          {payment.amount.toLocaleString('fr-FR')} €
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {payment.status === 'paid' ? 'Payé' :
                             payment.status === 'pending' ? 'En attente' : 'En retard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tenant.comments && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-neutral-300">
                Commentaires
              </h3>
              <p className="mt-2 text-gray-800 dark:text-neutral-200 whitespace-pre-line">
                {tenant.comments}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Modifier
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TenantsPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'leaving' | 'former'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data from the provided file
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      tenantId: 'T1001',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      birthDate: '1985-05-15',
      birthPlace: 'Paris',
      nationality: 'Française',
      socialSecurityNumber: '185056789012345',
      idDocumentType: 'cni',
      idDocumentNumber: '12AB34567',
      idDocumentExpiry: '2025-05-15',
      familySituation: 'married',
      address: 'Apt 305, Résidence Lumière, 75001 Paris',
      previousAddresses: ['12 Rue des Lilas, 75020 Paris'],
      emergencyContactName: 'Marie Dupont',
      emergencyContactPhone: '0698765432',
      profession: 'Ingénieur informatique',
      employmentStatus: 'cdi',
      annualIncome: 45000,
      housingBenefits: true,
      rib: 'FR7630001007941234567890185',
      paymentHistory: [
        { date: '2024-07-01', amount: 850, status: 'paid' },
        { date: '2024-06-01', amount: 850, status: 'paid' },
        { date: '2024-05-01', amount: 850, status: 'paid' }
      ],
      currentPropertyId: 'APT305',
      currentPropertyAddress: 'Apt 305, Résidence Lumière, 75001 Paris',
      leaseType: 'free',
      leaseStartDate: '2022-01-15',
      leaseEndDate: '2025-01-15',
      rentAmount: 850,
      chargesAmount: 120,
      inventoryStatus: 'completed',
      status: 'active',
      hasPaymentIncidents: false,
      lastPaymentDate: '2024-07-01',
      comments: 'Locataire modèle'
    },
    {
      id: '2',
      tenantId: 'T1002',
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@example.com',
      phone: '0687654321',
      birthDate: '1990-08-22',
      birthPlace: 'Lyon',
      nationality: 'Française',
      idDocumentType: 'passport',
      idDocumentNumber: '65TR78901',
      familySituation: 'single',
      address: 'Apt 12, Résidence Soleil, 75015 Paris',
      previousAddresses: [],
      profession: 'Designer graphique',
      employmentStatus: 'cdd',
      annualIncome: 32000,
      housingBenefits: false,
      paymentHistory: [
        { date: '2024-07-01', amount: 720, status: 'late' },
        { date: '2024-06-05', amount: 720, status: 'paid' }
      ],
      currentPropertyId: 'APT12',
      currentPropertyAddress: 'Apt 12, Résidence Soleil, 75015 Paris',
      leaseType: 'plai',
      leaseStartDate: '2023-03-10',
      rentAmount: 720,
      chargesAmount: 90,
      inventoryStatus: 'completed',
      status: 'active',
      hasPaymentIncidents: true,
      lastPaymentDate: '2024-07-01',
      comments: 'Quelques retards de paiement'
    },
    {
      id: '3',
      tenantId: 'T1003',
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'pierre.martin@example.com',
      phone: '0678912345',
      birthDate: '1978-11-30',
      birthPlace: 'Marseille',
      nationality: 'Française',
      idDocumentType: 'titre_sejour',
      idDocumentNumber: 'TR987654',
      idDocumentExpiry: '2026-02-28',
      familySituation: 'divorced',
      address: 'Apt 45, Résidence Étoile, 75018 Paris',
      previousAddresses: ['5 Rue des Oliviers, 13001 Marseille'],
      emergencyContactName: 'Sophie Martin',
      emergencyContactPhone: '0645678912',
      profession: 'Enseignant',
      employmentStatus: 'cdi',
      annualIncome: 38000,
      housingBenefits: true,
      rib: 'FR7630001007949876543210987',
      paymentHistory: [
        { date: '2024-07-01', amount: 680, status: 'paid' },
        { date: '2024-06-01', amount: 680, status: 'paid' }
      ],
      currentPropertyId: 'APT45',
      currentPropertyAddress: 'Apt 45, Résidence Étoile, 75018 Paris',
      leaseType: 'plus',
      leaseStartDate: '2021-09-01',
      leaseEndDate: '2024-08-31',
      rentAmount: 680,
      chargesAmount: 80,
      inventoryStatus: 'pending',
      status: 'leaving',
      hasPaymentIncidents: false,
      lastPaymentDate: '2024-07-01',
      comments: 'Départ prévu fin août'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const filteredTenants = tenants.filter(tenant => {
    // Filter by status
    if (filter !== 'all' && tenant.status !== filter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        tenant.firstName.toLowerCase().includes(term) ||
        tenant.lastName.toLowerCase().includes(term) ||
        tenant.tenantId.toLowerCase().includes(term) ||
        tenant.currentPropertyAddress.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const renderStatusBadge = (status: Tenant['status']) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
      leaving: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <ArrowRightLeft className="h-4 w-4 mr-1" /> },
      former: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <UserIcon className="h-4 w-4 mr-1" /> }
    };

    const text = {
      active: 'Actif',
      leaving: 'En départ',
      former: 'Ancien'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${config[status].color}`}>
        {config[status].icon}
        {text[status]}
      </span>
    );
  };

  const renderPaymentStatus = (hasIncidents: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
        hasIncidents ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {hasIncidents ? <AlertCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
        {hasIncidents ? 'Incidents' : 'À jour'}
      </span>
    );
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    leaving: tenants.filter(t => t.status === 'leaving').length,
    former: tenants.filter(t => t.status === 'former').length,
    withIncidents: tenants.filter(t => t.hasPaymentIncidents).length
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <Users className="h-8 w-8 mr-3" />
            Gestion des Locataires
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
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Total locataires</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.total}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.total}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Locataires enregistrés
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Actifs</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {stats.active}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.active}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En cours de location
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">En départ</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.leaving}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.leaving}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Départ programmé
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Avec incidents</h3>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {stats.withIncidents}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {stats.withIncidents}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Retards de paiement
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Users className="h-4 w-4 mr-1" />
              Tous
              <span className="ml-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {stats.total}
              </span>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'active'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Actifs
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {stats.active}
              </span>
            </button>
            <button
              onClick={() => setFilter('leaving')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'leaving'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              En départ
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {stats.leaving}
              </span>
            </button>
            <button
              onClick={() => setFilter('former')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'former'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <UserIcon className="h-4 w-4 mr-1" />
              Anciens
              <span className="ml-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {stats.former}
              </span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => {}} // Add import functionality
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600"
            >
              <FileUp className="h-5 w-5 mr-2" />
              Importer
            </button>

            <button 
              onClick={() => {}} // Add new tenant functionality
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau locataire
            </button>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-neutral-700">
                <tr>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">ID</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Locataire</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Contact</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Logement</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Statut</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Paiements</th>
                  <th className="p-3 text-center text-gray-600 dark:text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map(tenant => (
                    <tr 
                      key={tenant.id} 
                      className={`border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50 ${
                        tenant.hasPaymentIncidents ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                      }`}
                    >
                      <td className="p-3 text-gray-800 dark:text-neutral-200 font-mono text-sm">
                        {tenant.tenantId}
                      </td>
                      <td className="p-3 text-gray-800 dark:text-neutral-200">
                        <div className="font-medium">{tenant.firstName} {tenant.lastName}</div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">{tenant.profession}</div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-neutral-400">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{tenant.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate max-w-xs">{tenant.email}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-neutral-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{tenant.currentPropertyAddress.split(',')[0]}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 ml-6">
                          {tenant.currentPropertyAddress.split(',').slice(1).join(',')}
                        </div>
                      </td>
                      <td className="p-3">
                        {renderStatusBadge(tenant.status)}
                        {tenant.leaseEndDate && (
                          <div className="text-xs mt-1 text-gray-500 dark:text-neutral-400">
                            Fin bail: {new Date(tenant.leaseEndDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {renderPaymentStatus(tenant.hasPaymentIncidents)}
                        {tenant.lastPaymentDate && (
                          <div className="text-xs mt-1 text-gray-500 dark:text-neutral-400">
                            Dernier paiement: {new Date(tenant.lastPaymentDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="p-3 flex justify-center space-x-2">
                        <button
                          onClick={() => setSelectedTenant(tenant)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Voir détails"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {}} // Add edit functionality
                          className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          title="Modifier"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {}} // Add delete functionality
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-neutral-400">
                      <FileText className="h-10 w-10 mx-auto mb-2" />
                      <p className="text-lg font-medium text-gray-800 dark:text-neutral-200">Aucun locataire trouvé</p>
                      <p>
                        {searchTerm 
                          ? "Aucun locataire ne correspond à votre recherche" 
                          : filter !== 'all' 
                            ? `Vous n'avez aucun locataire ${filter === 'active' ? 'actif' : filter === 'leaving' ? 'en départ' : 'ancien'}` 
                            : "Vous n'avez aucun locataire enregistré"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tenant Detail Modal */}
        {selectedTenant && (
          <TenantDetailModal
            tenant={selectedTenant}
            onClose={() => setSelectedTenant(null)}
            onEdit={() => {
              setSelectedTenant(null);
              // Add edit functionality here
            }}
          />
        )}
      </main>
    </div>
  );
}