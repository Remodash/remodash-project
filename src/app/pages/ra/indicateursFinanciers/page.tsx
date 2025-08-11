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
  Search,
  BarChart2,
  PieChart,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

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
              ${item.label === 'Indicateurs Financiers' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface UnpaidItem {
  id: string;
  tenant: string;
  property: string;
  amount: number;
  daysLate: number;
  status: 'new' | 'in_progress' | 'recovered' | 'written_off';
  lastAction: string;
}

interface WorkCost {
  id: string;
  property: string;
  workType: string;
  estimatedCost: number;
  actualCost: number;
  variance: number;
  status: 'planned' | 'in_progress' | 'completed' | 'paid';
  contractor: string;
}

interface Penalty {
  id: string;
  contractor: string;
  property: string;
  amount: number;
  daysLate: number;
  reason: string;
  status: 'pending' | 'applied' | 'disputed' | 'waived';
}

export default function FinancialIndicatorsPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'unpaid' | 'work_costs' | 'penalties'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées basées sur le cahier des charges
  const [metrics] = useState<FinancialMetric[]>([
    {
      id: '1',
      label: 'Total impayés',
      value: 12450,
      change: 8.2,
      target: 10000,
      unit: '€',
      trend: 'up'
    },
    {
      id: '2',
      label: 'Coût moyen travaux',
      value: 1250,
      change: -3.5,
      target: 1200,
      unit: '€/logement',
      trend: 'down'
    },
    {
      id: '3',
      label: 'Délai moyen travaux',
      value: 12,
      change: -15,
      target: 10,
      unit: 'jours',
      trend: 'down'
    },
    {
      id: '4',
      label: 'Pénalités appliquées',
      value: 3200,
      change: 25,
      target: 2500,
      unit: '€',
      trend: 'up'
    },
    {
      id: '5',
      label: 'Taux de recouvrement',
      value: 78,
      change: 2.5,
      target: 80,
      unit: '%',
      trend: 'up'
    },
    {
      id: '6',
      label: 'Délai moyen recouvrement',
      value: 45,
      change: -5,
      target: 40,
      unit: 'jours',
      trend: 'down'
    }
  ]);

  const [unpaidItems] = useState<UnpaidItem[]>([
    {
      id: '1',
      tenant: 'Dupont Jean',
      property: 'RES-LUM-305',
      amount: 850,
      daysLate: 45,
      status: 'in_progress',
      lastAction: 'Relance envoyée'
    },
    {
      id: '2',
      tenant: 'Martin Sophie',
      property: 'RES-SOL-102',
      amount: 1200,
      daysLate: 60,
      status: 'new',
      lastAction: 'Aucune action'
    },
    {
      id: '3',
      tenant: 'Bernard Élodie',
      property: 'RES-HOR-210',
      amount: 650,
      daysLate: 30,
      status: 'in_progress',
      lastAction: 'Mise en demeure'
    },
    {
      id: '4',
      tenant: 'Petit Thomas',
      property: 'RES-JAR-78',
      amount: 950,
      daysLate: 90,
      status: 'recovered',
      lastAction: 'Paiement reçu'
    }
  ]);

  const [workCosts] = useState<WorkCost[]>([
    {
      id: '1',
      property: 'RES-LUM-305',
      workType: 'Remise en état',
      estimatedCost: 1250,
      actualCost: 1400,
      variance: -150,
      status: 'completed',
      contractor: 'BTP Services'
    },
    {
      id: '2',
      property: 'RES-SOL-102',
      workType: 'Peinture complète',
      estimatedCost: 850,
      actualCost: 800,
      variance: 50,
      status: 'paid',
      contractor: 'Peintures Dupont'
    },
    {
      id: '3',
      property: 'RES-JAR-78',
      workType: 'Remplacement chaudière',
      estimatedCost: 3200,
      actualCost: 3500,
      variance: -300,
      status: 'in_progress',
      contractor: 'Chauffage Pro'
    },
    {
      id: '4',
      property: 'RES-HOR-210',
      workType: 'Électricité',
      estimatedCost: 750,
      actualCost: 750,
      variance: 0,
      status: 'planned',
      contractor: 'Élec Services'
    }
  ]);

  const [penalties] = useState<Penalty[]>([
    {
      id: '1',
      contractor: 'BTP Services',
      property: 'RES-LUM-305',
      amount: 250,
      daysLate: 5,
      reason: 'Retard livraison',
      status: 'applied'
    },
    {
      id: '2',
      contractor: 'Peintures Dupont',
      property: 'RES-SOL-102',
      amount: 150,
      daysLate: 3,
      reason: 'Travaux non terminés',
      status: 'pending'
    },
    {
      id: '3',
      contractor: 'Chauffage Pro',
      property: 'RES-JAR-78',
      amount: 400,
      daysLate: 7,
      reason: 'Retard démarrage',
      status: 'disputed'
    },
    {
      id: '4',
      contractor: 'Élec Services',
      property: 'RES-HOR-210',
      amount: 200,
      daysLate: 4,
      reason: 'Matériel manquant',
      status: 'waived'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const filteredUnpaidItems = unpaidItems.filter(item => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.tenant.toLowerCase().includes(term) ||
        item.property.toLowerCase().includes(term) ||
        item.lastAction.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const filteredWorkCosts = workCosts.filter(item => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.property.toLowerCase().includes(term) ||
        item.workType.toLowerCase().includes(term) ||
        item.contractor.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const filteredPenalties = penalties.filter(item => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.contractor.toLowerCase().includes(term) ||
        item.property.toLowerCase().includes(term) ||
        item.reason.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'recovered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'written_off': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'planned': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'applied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'disputed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'waived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return 'Nouveau';
      case 'in_progress': return 'En cours';
      case 'recovered': return 'Recouvré';
      case 'written_off': return 'Irrecouvrable';
      case 'planned': return 'Planifié';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'applied': return 'Appliqué';
      case 'disputed': return 'Contesté';
      case 'waived': return 'Annulé';
      default: return status;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch(trend) {
      case 'up': return <ChevronUp className="h-4 w-4 text-red-500" />;
      case 'down': return <ChevronDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <div className="h-4 w-4 text-gray-500">-</div>;
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
            <CreditCard className="h-8 w-8 mr-3" />
            Indicateurs Financiers
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'month' | 'quarter' | 'year')}
              className="p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
            >
              <option value="month">Mensuel</option>
              <option value="quarter">Trimestriel</option>
              <option value="year">Annuel</option>
            </select>
            <button className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center">
              <Download className="h-5 w-5 mr-1" />
              Exporter
            </button>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Vue d&apos;ensemble
            </button>
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'unpaid'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Impayés
              <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                {unpaidItems.filter(i => i.status !== 'recovered' && i.status !== 'written_off').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('work_costs')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'work_costs'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Hammer className="h-4 w-4 mr-1" />
              Coûts travaux
            </button>
            <button
              onClick={() => setActiveTab('penalties')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'penalties'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Clock className="h-4 w-4 mr-1" />
              Pénalités
              <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                {penalties.filter(p => p.status === 'pending' || p.status === 'disputed').length}
              </span>
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {metrics.map(metric => (
                <div key={metric.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">{metric.label}</h3>
                    <div className="flex items-center">
                      {getTrendIcon(metric.trend)}
                      <span className={`ml-1 text-sm ${
                        metric.trend === 'up' ? 'text-red-500' : 
                        metric.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
                    {metric.value.toLocaleString('fr-FR')} {metric.unit}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className={`h-2.5 rounded-full ${
                          metric.value > metric.target ? 'bg-red-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${Math.min(100, Math.abs(metric.value / metric.target * 100))}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      Objectif: {metric.target.toLocaleString('fr-FR')} {metric.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Répartition des impayés
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-gray-400 dark:text-neutral-600">
                    Graphique de répartition des impayés
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Évolution des coûts travaux
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-gray-400 dark:text-neutral-600">
                    Graphique d&apos;évolution des coûts
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'unpaid' && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Liste des impayés
              </h3>
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
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Locataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Jours de retard</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dernière action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredUnpaidItems.length > 0 ? (
                  filteredUnpaidItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3 font-medium">{item.tenant}</td>
                      <td className="px-4 py-3">{item.property}</td>
                      <td className="px-4 py-3">{item.amount.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3">{item.daysLate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.lastAction}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                      Aucun impayé trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'work_costs' && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <Hammer className="h-5 w-5 mr-2" />
                Coûts des travaux
              </h3>
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
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type travaux</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût estimé</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Coût réel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Écart</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredWorkCosts.length > 0 ? (
                  filteredWorkCosts.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3 font-medium">{item.property}</td>
                      <td className="px-4 py-3">{item.workType}</td>
                      <td className="px-4 py-3">{item.contractor}</td>
                      <td className="px-4 py-3">{item.estimatedCost.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3">{item.actualCost.toLocaleString('fr-FR')} €</td>
                      <td className={`px-4 py-3 ${
                        item.variance < 0 ? 'text-red-500' : 
                        item.variance > 0 ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {item.variance.toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                      Aucun coût de travaux trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'penalties' && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pénalités appliquées
              </h3>
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
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Prestataire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Logement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Jours de retard</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Raison</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredPenalties.length > 0 ? (
                  filteredPenalties.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                      <td className="px-4 py-3 font-medium">{item.contractor}</td>
                      <td className="px-4 py-3">{item.property}</td>
                      <td className="px-4 py-3">{item.amount.toLocaleString('fr-FR')} €</td>
                      <td className="px-4 py-3">{item.daysLate}</td>
                      <td className="px-4 py-3">{item.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-neutral-400">
                      Aucune pénalité trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}