'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Receipt,
} from 'lucide-react';

// Types basés sur le cahier des charges
interface TenantPayment {
  id: number;
  tenant: {
    name: string;
    property: string;
    ssn?: string;
  };
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  amount: number;
  dueDate: string;
  paidAmount?: number;
  unpaidAmount?: number;
  daysOverdue?: number;
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  date: string;
  amount: number;
  method: string;
  reference: string;
}

interface LegalCase {
  id: number;
  tenant: {
    name: string;
    property: string;
  };
  unpaidAmount: number;
  status: 'new' | 'in_progress' | 'court' | 'resolved';
  lastAction: string;
  nextStep?: string;
}

interface FinancialOverview {
  totalReceivable: number;
  totalCollected: number;
  overdueAmount: number;
  collectionRate: number;
  pendingLegalCases: number;
}

const Sidebar: React.FC<{ 
  isExpanded: boolean, 
  toggleSidebar: () => void 
}> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/accounting' },
    { icon: CreditCard, label: 'Paiements', href: '/dashboard/accounting/payments' },
    { icon: AlertCircle, label: 'Impayés', href: '/dashboard/accounting/unpaid' },
    { icon: Receipt, label: 'Contentieux', href: '/dashboard/accounting/legal' },
    { icon: BarChart2, label: 'Rapports', href: '/dashboard/accounting/reports' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/accounting/settings' }
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
          Comptabilité
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

export default function AccountingDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'unpaid' | 'legal'>('overview');

  // Données simulées basées sur le cahier des charges
  const [financialOverview] = useState<FinancialOverview>({
    totalReceivable: 125430,
    totalCollected: 98450,
    overdueAmount: 26980,
    collectionRate: 78.5,
    pendingLegalCases: 12
  });

  const [tenantPayments] = useState<TenantPayment[]>([
    {
      id: 1,
      tenant: {
        name: 'Marie Dupont',
        property: 'Résidence Lumière, Apt 305',
        ssn: '1234567890123'
      },
      status: 'paid',
      amount: 850,
      dueDate: '2024-08-01',
      paidAmount: 850,
      paymentHistory: [
        {
          date: '2024-08-01',
          amount: 850,
          method: 'Virement',
          reference: 'VIR-2024-08-001'
        }
      ]
    },
    {
      id: 2,
      tenant: {
        name: 'Jean Martin',
        property: 'Résidence Soleil, Apt 102'
      },
      status: 'unpaid',
      amount: 720,
      dueDate: '2024-07-01',
      unpaidAmount: 720,
      daysOverdue: 38,
      paymentHistory: []
    },
    {
      id: 3,
      tenant: {
        name: 'Sophie Bernard',
        property: 'Résidence Jardin, Apt 201'
      },
      status: 'partial',
      amount: 920,
      dueDate: '2024-08-01',
      paidAmount: 500,
      unpaidAmount: 420,
      daysOverdue: 7,
      paymentHistory: [
        {
          date: '2024-08-05',
          amount: 500,
          method: 'Chèque',
          reference: 'CHQ-2024-08-005'
        }
      ]
    }
  ]);

  const [legalCases] = useState<LegalCase[]>([
    {
      id: 1,
      tenant: {
        name: 'Jean Martin',
        property: 'Résidence Soleil, Apt 102'
      },
      unpaidAmount: 2160,
      status: 'in_progress',
      lastAction: '2024-07-15 - Mise en demeure envoyée',
      nextStep: 'Saisie des revenus si non-paiement avant 2024-09-01'
    },
    {
      id: 2,
      tenant: {
        name: 'Luc Dubois',
        property: 'Résidence Parc, Apt 503'
      },
      unpaidAmount: 1540,
      status: 'court',
      lastAction: '2024-08-01 - Assignation en justice',
      nextStep: 'Audience prévue le 2024-10-15'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Aperçu Financier</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">À Recevoir</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {financialOverview.totalReceivable.toLocaleString('fr-FR')} €
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Encaissé</h3>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {financialOverview.totalCollected.toLocaleString('fr-FR')} €
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Taux de recouvrement: {financialOverview.collectionRate}%
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Impayés</h3>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {financialOverview.overdueAmount.toLocaleString('fr-FR')} €
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-neutral-400">Contentieux</h3>
            <Receipt className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {financialOverview.pendingLegalCases}
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Dossiers en cours
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <h3 className="font-medium mb-4">Derniers Paiements</h3>
          <div className="space-y-3">
            {tenantPayments
              .filter(p => p.status === 'paid')
              .slice(0, 3)
              .map(payment => (
                <div key={payment.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{payment.tenant.name}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {payment.tenant.property}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {payment.paidAmount?.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {payment.paymentHistory[0]?.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button 
            onClick={() => setActiveTab('payments')}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir tous les paiements →
          </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <h3 className="font-medium mb-4">Impayés Récurrents</h3>
          <div className="space-y-3">
            {tenantPayments
              .filter(p => p.status === 'unpaid' || p.status === 'partial')
              .sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0))
              .slice(0, 3)
              .map(payment => (
                <div key={payment.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{payment.tenant.name}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {payment.tenant.property}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600 dark:text-red-400">
                        {payment.unpaidAmount?.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {payment.daysOverdue} jours de retard
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <button 
            onClick={() => setActiveTab('unpaid')}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir tous les impayés →
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Suivi des Paiements</h2>
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-1 text-sm bg-white dark:bg-neutral-800">
            <option>Tous les statuts</option>
            <option>Payé</option>
            <option>Partiel</option>
            <option>Impayé</option>
          </select>
          <input 
            type="month" 
            className="border rounded px-3 py-1 text-sm bg-white dark:bg-neutral-800"
            defaultValue="2024-08"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Montant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Échéance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {tenantPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                <td className="px-4 py-3">
                  <div className="font-medium">{payment.tenant.name}</div>
                  {payment.tenant.ssn && (
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {payment.tenant.ssn}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{payment.tenant.property}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{payment.amount.toLocaleString('fr-FR')} €</div>
                  {payment.paidAmount && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Payé: {payment.paidAmount.toLocaleString('fr-FR')} €
                    </div>
                  )}
                  {payment.unpaidAmount && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Dû: {payment.unpaidAmount.toLocaleString('fr-FR')} €
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>{payment.dueDate}</div>
                  {payment.daysOverdue && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {payment.daysOverdue} jours de retard
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {payment.status === 'paid' ? 'Payé' :
                     payment.status === 'partial' ? 'Partiel' : 'Impayé'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUnpaidTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Impayés</h2>
        <div className="flex space-x-2">
          <select className="border rounded px-3 py-1 text-sm bg-white dark:bg-neutral-800">
            <option>Tous les retards</option>
            <option>+30 jours</option>
            <option>+60 jours</option>
            <option>+90 jours</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Montant dû</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Jours retard</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {tenantPayments
              .filter(p => p.status === 'unpaid' || p.status === 'partial')
              .sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0))
              .map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-4 py-3">
                    <div className="font-medium">{payment.tenant.name}</div>
                    {payment.tenant.ssn && (
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        {payment.tenant.ssn}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{payment.tenant.property}</td>
                  <td className="px-4 py-3 font-medium text-red-600 dark:text-red-400">
                    {(payment.unpaidAmount || payment.amount).toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-red-500" />
                      {payment.daysOverdue} jours
                    </div>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Relancer
                    </button>
                    <button 
                      onClick={() => setActiveTab('legal')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Contentieux
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLegalTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Suivi Contentieux</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {legalCases.map(legalCase => (
          <div key={legalCase.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{legalCase.tenant.name}</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {legalCase.tenant.property}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                legalCase.status === 'new' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                legalCase.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                legalCase.status === 'court' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}>
                {legalCase.status === 'new' ? 'Nouveau' :
                 legalCase.status === 'in_progress' ? 'En cours' :
                 legalCase.status === 'court' ? 'Tribunal' : 'Résolu'}
              </span>
            </div>
            
            <div className="mt-4">
              <p className="font-medium text-lg">
                {legalCase.unpaidAmount.toLocaleString('fr-FR')} €
              </p>
              
              <div className="mt-3 text-sm">
                <p className="font-medium">Dernière action:</p>
                <p className="text-gray-500 dark:text-neutral-400">
                  {legalCase.lastAction}
                </p>
              </div>
              
              {legalCase.nextStep && (
                <div className="mt-3 text-sm">
                  <p className="font-medium">Prochaine étape:</p>
                  <p className="text-gray-500 dark:text-neutral-400">
                    {legalCase.nextStep}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Historique
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-neutral-600">
                Documents
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
          Tableau de Bord Comptabilité
        </h1>
        
        <div className="mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Paiements
            </button>
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'unpaid'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Impayés
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'legal'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Contentieux
            </button>
          </nav>
        </div>
        
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'unpaid' && renderUnpaidTab()}
        {activeTab === 'legal' && renderLegalTab()}
      </main>
    </div>
  );
}