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
  MapPin,
  Layers,
  HomeIcon,
  Box,
  Calendar,
  Clock,
  Thermometer,
  Battery,
  Wifi,
  Droplets,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
  BarChart2,
  PieChart,
  Building2,
  ClipboardList,
  FileSearch
} from 'lucide-react';

// Types basés sur le cahier des charges
interface Property {
  id: string;
  address: string;
  building: string;
  floor: string;
  doorNumber: string;
  type: string;
  rooms: number;
  bedrooms: number;
  surface: number;
  annexSurface?: number;
  constructionYear: number;
  structureType: string;
  heatingType: string;
  energyType: string;
  equipment: string[];
  lastRenovation?: number;
  diagnostics: {
    type: string;
    date: string;
    validity: string;
    status: string;
  }[];
  location: {
    neighborhood: string;
    cityPolicy: string;
    transport: string;
  };
  heritageAffiliation: string;
  financingType: string;
  rentalStatus: 'occupied' | 'vacant' | 'soon_available';
  currentTenant?: string;
  plannedVacancyDate?: string;
  vacancyDuration?: number;
  rentalValue: {
    baseRent: number;
    recoverableCharges: number;
    total: number;
  };
  energyPerformance: {
    class: string;
    consumption: number;
    emissions: number;
  };
  plannedWorks?: {
    type: string;
    year: number;
    budget: number;
  }[];
  parking?: {
    type: string;
    number: string;
    surface: number;
    status: string;
  };
  photos: string[];
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
              ${item.label === 'Parc Immobilier' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''}
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

const PropertyDetailModal: React.FC<{
  property: Property;
  onClose: () => void;
  onEdit: () => void;
  onPlanWorks: () => void;
}> = ({ property, onClose, onEdit, onPlanWorks }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'occupied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'vacant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'soon_available': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'occupied': return 'Occupé';
      case 'vacant': return 'Vacant';
      case 'soon_available': return 'Bientôt disponible';
      default: return status;
    }
  };

  const getEnergyClassColor = (energyClass: string) => {
    switch(energyClass) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'B': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'C': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'D': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'E': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'G': return 'bg-red-800 text-white dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <HomeIcon className="h-8 w-8 mr-2" />
              {property.address}
              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.rentalStatus)}`}>
                {getStatusLabel(property.rentalStatus)}
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
                <MapPin className="h-5 w-5 mr-2" />
                Identification
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Bâtiment:</span> {property.building}</p>
                <p><span className="font-medium">Étage:</span> {property.floor}</p>
                <p><span className="font-medium">Porte:</span> {property.doorNumber}</p>
                <p><span className="font-medium">Type:</span> {property.type} ({property.surface}m²)</p>
                {property.annexSurface && (
                  <p><span className="font-medium">Surface annexe:</span> {property.annexSurface}m²</p>
                )}
                <p><span className="font-medium">Pièces:</span> {property.rooms} ({property.bedrooms} chambres)</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Caractéristiques techniques
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Année construction:</span> {property.constructionYear}</p>
                <p><span className="font-medium">Type structure:</span> {property.structureType}</p>
                <p><span className="font-medium">Chauffage:</span> {property.heatingType} ({property.energyType})</p>
                {property.lastRenovation && (
                  <p><span className="font-medium">Dernière rénovation:</span> {property.lastRenovation}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              onClick={() => toggleSection('equipment')}
            >
              <h3 className="font-medium text-lg flex items-center">
                <Box className="h-5 w-5 mr-2" />
                Équipements ({property.equipment.length})
              </h3>
              {expandedSection === 'equipment' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'equipment' && (
              <div className="mt-3 p-3 border rounded-lg grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.equipment.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {item.includes('Ascenseur') && <Layers className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    {item.includes('VMC') && <Thermometer className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    {item.includes('Interphone') && <Wifi className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    {item.includes('Chaudière') && <Droplets className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    {item.includes('Compteurs') && <Zap className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    {item.includes('Cuisine équipée') && <HomeIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-neutral-400" />}
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Diagnostics
              </h3>
              <div className="space-y-3">
                {property.diagnostics.map((diag, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{diag.type}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        diag.status === 'valid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        diag.status === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {diag.status === 'valid' ? 'Valide' : 'Expiré'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Fait le {diag.date} • Valide jusqu'au {diag.validity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Performance énergétique
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Classe DPE:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEnergyClassColor(property.energyPerformance.class)}`}>
                    {property.energyPerformance.class}
                  </span>
                </p>
                <p><span className="font-medium">Consommation:</span> {property.energyPerformance.consumption} kWh/m².an</p>
                <p><span className="font-medium">Émissions GES:</span> {property.energyPerformance.emissions} kg CO2/m².an</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Localisation et affectation
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Quartier:</span> {property.location.neighborhood}</p>
                <p><span className="font-medium">Politique ville:</span> {property.location.cityPolicy}</p>
                <p><span className="font-medium">Transports:</span> {property.location.transport}</p>
                <p><span className="font-medium">Affectation patrimoniale:</span> {property.heritageAffiliation}</p>
                <p><span className="font-medium">Type financement:</span> {property.financingType}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Valeur locative
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Loyer de base:</span> {property.rentalValue.baseRent} €</p>
                <p><span className="font-medium">Charges récupérables:</span> {property.rentalValue.recoverableCharges} €</p>
                <p><span className="font-medium">Total:</span> {property.rentalValue.total} €</p>
                {property.currentTenant && (
                  <p><span className="font-medium">Locataire actuel:</span> {property.currentTenant}</p>
                )}
                {property.plannedVacancyDate && (
                  <p><span className="font-medium">Date libération prévue:</span> {property.plannedVacancyDate}</p>
                )}
                {property.vacancyDuration && (
                  <p><span className="font-medium">Durée vacance:</span> {property.vacancyDuration} jours</p>
                )}
              </div>
            </div>
          </div>

          {property.plannedWorks && property.plannedWorks.length > 0 && (
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                onClick={() => toggleSection('works')}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <Hammer className="h-5 w-5 mr-2" />
                  Travaux programmés ({property.plannedWorks.length})
                </h3>
                {expandedSection === 'works' ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expandedSection === 'works' && (
                <div className="mt-3 space-y-3">
                  {property.plannedWorks.map((work, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{work.type}</p>
                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                          {work.budget} € (prévu en {work.year})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {property.parking && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-lg mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Stationnement
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {property.parking.type}</p>
                <p><span className="font-medium">Numéro:</span> {property.parking.number}</p>
                <p><span className="font-medium">Surface:</span> {property.parking.surface}m²</p>
                <p><span className="font-medium">État:</span> {property.parking.status}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
            >
              Fermer
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Modifier
            </button>
            <button
              onClick={onPlanWorks}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Hammer className="h-5 w-5 mr-2" />
              Planifier travaux
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PropertiesPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'soon_available'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Données simulées basées sur le cahier des charges
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "RES-LUM-305",
      address: "Résidence Lumière, 12 Avenue des Champs, 75012 Paris",
      building: "Lumière",
      floor: "3",
      doorNumber: "305",
      type: "T2",
      rooms: 2,
      bedrooms: 1,
      surface: 45,
      annexSurface: 5,
      constructionYear: 1995,
      structureType: "Béton",
      heatingType: "Collectif",
      energyType: "Gaz",
      lastRenovation: 2015,
      equipment: ["Ascenseur", "Interphone", "VMC", "Cuisine équipée"],
      diagnostics: [
        {
          type: "DPE",
          date: "01/06/2023",
          validity: "01/06/2033",
          status: "valid"
        },
        {
          type: "Amiante",
          date: "15/03/2022",
          validity: "15/03/2032",
          status: "valid"
        },
        {
          type: "Électricité",
          date: "10/01/2021",
          validity: "10/01/2026",
          status: "valid"
        }
      ],
      location: {
        neighborhood: "Quartier Vert",
        cityPolicy: "QPV",
        transport: "Métro ligne 1 (5 min), Bus 46"
      },
      heritageAffiliation: "Résidence Lumière",
      financingType: "PLUS",
      rentalStatus: "occupied",
      currentTenant: "Jean Dupont",
      rentalValue: {
        baseRent: 650,
        recoverableCharges: 50,
        total: 700
      },
      energyPerformance: {
        class: "C",
        consumption: 150,
        emissions: 25
      },
      plannedWorks: [
        {
          type: "Ravalement façade",
          year: 2025,
          budget: 12000
        }
      ],
      parking: {
        type: "Place extérieure",
        number: "P12",
        surface: 12,
        status: "Bon état"
      },
      photos: ["photo1.jpg", "photo2.jpg"]
    },
    {
      id: "RES-SOL-102",
      address: "Résidence Soleil, 8 Rue du Printemps, 75018 Paris",
      building: "Soleil",
      floor: "1",
      doorNumber: "102",
      type: "T1",
      rooms: 1,
      bedrooms: 0,
      surface: 32,
      constructionYear: 2005,
      structureType: "Brique",
      heatingType: "Individuel",
      energyType: "Électrique",
      equipment: ["Digicode", "VMC", "Compteurs individuels"],
      diagnostics: [
        {
          type: "DPE",
          date: "15/09/2022",
          validity: "15/09/2032",
          status: "valid"
        },
        {
          type: "Amiante",
          date: "15/09/2022",
          validity: "15/09/2032",
          status: "valid"
        }
      ],
      location: {
        neighborhood: "Quartier Fleuri",
        cityPolicy: "NPRU",
        transport: "Métro ligne 4 (10 min), Bus 60"
      },
      heritageAffiliation: "Résidence Soleil",
      financingType: "PLAI",
      rentalStatus: "vacant",
      plannedVacancyDate: "01/09/2023",
      vacancyDuration: 45,
      rentalValue: {
        baseRent: 450,
        recoverableCharges: 40,
        total: 490
      },
      energyPerformance: {
        class: "B",
        consumption: 90,
        emissions: 15
      },
      photos: ["photo3.jpg"]
    },
    {
      id: "RES-JAR-78",
      address: "Résidence Jardin, 25 Allée des Roses, 75020 Paris",
      building: "Jardin",
      floor: "RDC",
      doorNumber: "78",
      type: "T2",
      rooms: 2,
      bedrooms: 1,
      surface: 50,
      constructionYear: 1980,
      structureType: "Béton",
      heatingType: "Collectif",
      energyType: "Gaz",
      lastRenovation: 2018,
      equipment: ["Ascenseur", "Interphone", "VMC", "Chaudière collective"],
      diagnostics: [
        {
          type: "DPE",
          date: "20/05/2021",
          validity: "20/05/2031",
          status: "valid"
        },
        {
          type: "Amiante",
          date: "20/05/2021",
          validity: "20/05/2031",
          status: "valid"
        },
        {
          type: "Gaz",
          date: "20/05/2021",
          validity: "20/05/2026",
          status: "valid"
        }
      ],
      location: {
        neighborhood: "Quartier Nature",
        cityPolicy: "Aucune",
        transport: "Métro ligne 3 (8 min), Tram T3b"
      },
      heritageAffiliation: "Résidence Jardin",
      financingType: "PLS",
      rentalStatus: "soon_available",
      plannedVacancyDate: "01/10/2023",
      rentalValue: {
        baseRent: 750,
        recoverableCharges: 60,
        total: 810
      },
      energyPerformance: {
        class: "D",
        consumption: 180,
        emissions: 30
      },
      plannedWorks: [
        {
          type: "Remplacement chaudière",
          year: 2024,
          budget: 8000
        },
        {
          type: "Rénovation salle de bain",
          year: 2024,
          budget: 3500
        }
      ],
      photos: ["photo4.jpg", "photo5.jpg"]
    },
    {
      id: "RES-HOR-210",
      address: "Résidence Horizon, 40 Boulevard des Cieux, 75019 Paris",
      building: "Horizon",
      floor: "2",
      doorNumber: "210",
      type: "T4",
      rooms: 4,
      bedrooms: 2,
      surface: 82,
      constructionYear: 2010,
      structureType: "Béton",
      heatingType: "Individuel",
      energyType: "Électrique",
      equipment: ["Ascenseur", "Digicode", "VMC", "Cuisine équipée", "Compteurs individuels"],
      diagnostics: [
        {
          type: "DPE",
          date: "10/03/2023",
          validity: "10/03/2033",
          status: "valid"
        },
        {
          type: "Amiante",
          date: "10/03/2023",
          validity: "10/03/2033",
          status: "valid"
        },
        {
          type: "Électricité",
          date: "10/03/2023",
          validity: "10/03/2028",
          status: "valid"
        }
      ],
      location: {
        neighborhood: "Quartier Lumineux",
        cityPolicy: "Aucune",
        transport: "Métro ligne 7 (5 min), Bus 75"
      },
      heritageAffiliation: "Résidence Horizon",
      financingType: "Libre",
      rentalStatus: "occupied",
      currentTenant: "Élodie Bertrand",
      rentalValue: {
        baseRent: 950,
        recoverableCharges: 80,
        total: 1030
      },
      energyPerformance: {
        class: "A",
        consumption: 50,
        emissions: 5
      },
      parking: {
        type: "Box",
        number: "B4",
        surface: 15,
        status: "Excellent état"
      },
      photos: ["photo6.jpg", "photo7.jpg", "photo8.jpg"]
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleEditProperty = (id: string) => {
    // Logique de modification à implémenter
    console.log("Modification du logement", id);
    setSelectedProperty(null);
  };

  const handlePlanWorks = (id: string) => {
    // Logique de planification de travaux à implémenter
    console.log("Planification travaux pour", id);
    setSelectedProperty(null);
  };

  const filteredProperties = properties.filter(property => {
    // Filtre par statut
    if (filter !== 'all' && property.rentalStatus !== filter) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        property.address.toLowerCase().includes(term) ||
        property.id.toLowerCase().includes(term) ||
        (property.currentTenant && property.currentTenant.toLowerCase().includes(term)) ||
        property.type.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'occupied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'vacant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'soon_available': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'occupied': return 'Occupé';
      case 'vacant': return 'Vacant';
      case 'soon_available': return 'Bientôt dispo';
      default: return status;
    }
  };

  const getEnergyClassColor = (energyClass: string) => {
    switch(energyClass) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'B': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'C': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'D': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'E': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'G': return 'bg-red-800 text-white dark:bg-red-900 dark:text-red-100';
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
            <Building className="h-8 w-8 mr-3" />
            Parc Immobilier
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
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
            >
              {viewMode === 'list' ? (
                <Layers className="h-5 w-5" />
              ) : (
                <ClipboardList className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Total logements</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {properties.length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {properties.length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Dans le patrimoine
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Occupés</h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {properties.filter(p => p.rentalStatus === 'occupied').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {properties.filter(p => p.rentalStatus === 'occupied').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Actuellement loués
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Vacants</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {properties.filter(p => p.rentalStatus === 'vacant').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {properties.filter(p => p.rentalStatus === 'vacant').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Disponibles
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">Bientôt libres</h3>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
                {properties.filter(p => p.rentalStatus === 'soon_available').length}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {properties.filter(p => p.rentalStatus === 'soon_available').length}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              En cours de libération
            </p>
          </div>
        </div>

        <div className="pt-8 mb-6 border-b border-gray-200 dark:border-neutral-700">
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
              <span className="ml-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-200">
                {properties.length}
              </span>
            </button>
            <button
              onClick={() => setFilter('occupied')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'occupied'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Occupés
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
                {properties.filter(p => p.rentalStatus === 'occupied').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('vacant')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'vacant'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              Vacants
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {properties.filter(p => p.rentalStatus === 'vacant').length}
              </span>
            </button>
            <button
              onClick={() => setFilter('soon_available')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center ${
                filter === 'soon_available'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              <Clock className="h-4 w-4 mr-1" />
              Bientôt libres
              <span className="ml-1 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-200">
                {properties.filter(p => p.rentalStatus === 'soon_available').length}
              </span>
            </button>
          </nav>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">DPE</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Loyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <tr 
                      key={property.id} 
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                    >
                      <td className="px-4 py-3 font-medium">{property.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{property.address}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          {property.building} • {property.floor} • {property.doorNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{property.type}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          {property.surface}m² • {property.rooms}p • {property.bedrooms}ch
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEnergyClassColor(property.energyPerformance.class)}`}>
                          {property.energyPerformance.class}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                          {property.energyPerformance.consumption} kWh/m².an
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.rentalStatus)}`}>
                          {getStatusLabel(property.rentalStatus)}
                        </span>
                        {property.currentTenant && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                            {property.currentTenant}
                          </div>
                        )}
                        {property.plannedVacancyDate && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                            Libération: {property.plannedVacancyDate}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{property.rentalValue.total} €</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          {property.rentalValue.baseRent} € + {property.rentalValue.recoverableCharges} €
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => setSelectedProperty(property)}
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
                      Aucun logement trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <div 
                  key={property.id} 
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                    <Building className="h-16 w-16 text-gray-400 dark:text-neutral-500" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{property.id}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.rentalStatus)}`}>
                        {getStatusLabel(property.rentalStatus)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{property.address}</p>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">Type</p>
                        <p className="font-medium">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">Surface</p>
                        <p className="font-medium">{property.surface}m²</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">DPE</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEnergyClassColor(property.energyPerformance.class)}`}>
                          {property.energyPerformance.class}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">Loyer</p>
                        <p className="font-medium">{property.rentalValue.total} €</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedProperty(property)}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                      <FileSearch className="h-4 w-4 mr-1" />
                      Voir détails
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center text-gray-500 dark:text-neutral-400">
                Aucun logement trouvé
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de détail */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onEdit={() => handleEditProperty(selectedProperty.id)}
          onPlanWorks={() => handlePlanWorks(selectedProperty.id)}
        />
      )}
    </div>
  );
}