'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  Hammer,
  ClipboardCheck,
  FileText,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Lock,
  Bell,
  Calendar,
  FileDigit,
  Banknote,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  LogOut
} from 'lucide-react';

// Types définis pour une meilleure sécurité TypeScript
interface Contractor {
  companyName: string;
  siret: string;
  address: string;
  postalCode: string;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  specialities: string[];
  insurance: {
    policyNumber: string;
    expirationDate: string;
  };
  paymentDetails: {
    bankName: string;
    iban: string;
    bic: string;
  };
}

interface NotificationSettings {
  newWorkOrder: boolean;
  deadlineWarning: boolean;
  paymentReceived: boolean;
  workOrderValidated: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordChangeRequired: boolean;
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
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${
      isExpanded ? 'w-64' : 'w-20'
    } flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-neutral-200 transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}>
          Remodash
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          aria-label={isExpanded ? "Réduire la sidebar" : "Étendre la sidebar"}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href} 
            className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition-all duration-300 ${
              item.label === 'Paramètres' ? 'bg-blue-50 dark:bg-blue-900/30 border-r-4 border-blue-500' : ''
            }`}
          >
            <item.icon className="mr-4" aria-hidden="true" />
            <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const ContractorSettings: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Données du prestataire
  const [contractor, setContractor] = useState<Contractor>({
    companyName: 'BTP Renovation',
    siret: '123 456 789 00010',
    address: '15 Rue des Artisans',
    postalCode: '75000',
    city: 'Paris',
    contactPerson: 'Jean Dupont',
    email: 'contact@btp-renovation.fr',
    phone: '06 12 34 56 78',
    specialities: ['Plomberie', 'Électricité', 'Peinture'],
    insurance: {
      policyNumber: 'POL12345678',
      expirationDate: '2025-12-31'
    },
    paymentDetails: {
      bankName: 'Banque Populaire',
      iban: 'FR76 1234 5678 9123 4567 8910 123',
      bic: 'BPPBFRPPXXX'
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newWorkOrder: true,
    deadlineWarning: true,
    paymentReceived: true,
    workOrderValidated: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordChangeRequired: true
  });

  const [tempContractor, setTempContractor] = useState<Contractor>({...contractor});
  const [tempSpeciality, setTempSpeciality] = useState('');

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleEditClick = () => {
    setTempContractor({...contractor});
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setContractor({...tempContractor});
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempContractor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (e: React.ChangeEvent<HTMLInputElement>, parent: 'insurance' | 'paymentDetails') => {
    const { name, value } = e.target;
    setTempContractor(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  const addSpeciality = () => {
    if (tempSpeciality.trim() && !tempContractor.specialities.includes(tempSpeciality.trim())) {
      setTempContractor(prev => ({
        ...prev,
        specialities: [...prev.specialities, tempSpeciality.trim()]
      }));
      setTempSpeciality('');
    }
  };

  const removeSpeciality = (index: number) => {
    const newSpecialities = [...tempContractor.specialities];
    newSpecialities.splice(index, 1);
    setTempContractor(prev => ({
      ...prev,
      specialities: newSpecialities
    }));
  };

  const toggleNotificationSetting = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleSecuritySetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionTimeout: parseInt(e.target.value)
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarExpanded ? 'ml-64' : 'ml-20'
      } p-6 overflow-y-auto`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Gérez les paramètres de votre compte prestataire
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200 dark:border-neutral-700">
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-neutral-400'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="inline mr-2 h-4 w-4" />
              Profil
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'notifications' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-neutral-400'}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="inline mr-2 h-4 w-4" />
              Notifications
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'security' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-neutral-400'}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock className="inline mr-2 h-4 w-4" />
              Sécurité
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Informations du prestataire</h2>
                  {isEditing ? (
                    <div className="space-x-2">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        onClick={handleSaveClick}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </button>
                      <button 
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={handleCancelClick}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      onClick={handleEditClick}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="companyName"
                          value={tempContractor.companyName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">SIRET</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="siret"
                          value={tempContractor.siret}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.siret}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={tempContractor.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Code postal</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="postalCode"
                            value={tempContractor.postalCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.postalCode}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ville</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={tempContractor.city}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.city}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Personne à contacter</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="contactPerson"
                          value={tempContractor.contactPerson}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.contactPerson}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={tempContractor.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={tempContractor.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Spécialités</label>
                      {isEditing ? (
                        <div>
                          <div className="flex mb-2">
                            <input
                              type="text"
                              value={tempSpeciality}
                              onChange={(e) => setTempSpeciality(e.target.value)}
                              className="flex-1 p-2 border rounded-l-lg dark:bg-neutral-700"
                              placeholder="Ajouter une spécialité"
                            />
                            <button 
                              className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                              onClick={addSpeciality}
                            >
                              Ajouter
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tempContractor.specialities.map((spec, index) => (
                              <span key={index} className="bg-gray-100 dark:bg-neutral-700 px-3 py-1 rounded-full text-sm flex items-center">
                                {spec}
                                <button 
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => removeSpeciality(index)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                          {contractor.specialities.length > 0 ? (
                            contractor.specialities.map((spec, index) => (
                              <span key={index} className="bg-gray-200 dark:bg-neutral-600 px-3 py-1 rounded-full text-sm">
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-neutral-400">Aucune spécialité définie</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Assurance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Numéro de police</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="policyNumber"
                          value={tempContractor.insurance.policyNumber}
                          onChange={(e) => handleNestedInputChange(e, 'insurance')}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.insurance.policyNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="expirationDate"
                          value={tempContractor.insurance.expirationDate}
                          onChange={(e) => handleNestedInputChange(e, 'insurance')}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                          {new Date(contractor.insurance.expirationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Informations bancaires
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom de la banque</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="bankName"
                          value={tempContractor.paymentDetails.bankName}
                          onChange={(e) => handleNestedInputChange(e, 'paymentDetails')}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.paymentDetails.bankName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">IBAN</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="iban"
                          value={tempContractor.paymentDetails.iban}
                          onChange={(e) => handleNestedInputChange(e, 'paymentDetails')}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.paymentDetails.iban}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">BIC</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="bic"
                          value={tempContractor.paymentDetails.bic}
                          onChange={(e) => handleNestedInputChange(e, 'paymentDetails')}
                          className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">{contractor.paymentDetails.bic}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Préférences de notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Nouveaux bons de travail</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir une notification lorsqu'un nouveau bon de travail vous est attribué</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.newWorkOrder}
                        onChange={() => toggleNotificationSetting('newWorkOrder')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Avertissement échéance</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir un rappel avant l'échéance d'un bon de travail</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.deadlineWarning}
                        onChange={() => toggleNotificationSetting('deadlineWarning')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Paiement reçu</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir une notification lorsqu'un paiement est effectué</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.paymentReceived}
                        onChange={() => toggleNotificationSetting('paymentReceived')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Validation de travaux</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Recevoir une notification lorsque vos travaux sont validés</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.workOrderValidated}
                        onChange={() => toggleNotificationSetting('workOrderValidated')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Paramètres de sécurité</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Authentification à deux facteurs</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securitySettings.twoFactorAuth}
                        onChange={() => toggleSecuritySetting('twoFactorAuth')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Délai d'expiration de session</h3>
                      <span className="text-sm font-medium">{securitySettings.sessionTimeout} minutes</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">Définissez après combien de temps d'inactivité vous serez déconnecté automatiquement</p>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={handleSessionTimeoutChange}
                      className="w-full p-2 border rounded-lg dark:bg-neutral-800"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="120">2 heures</option>
                      <option value="240">4 heures</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">Changement de mot de passe requis</h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Le système vous demandera de changer votre mot de passe périodiquement</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securitySettings.passwordChangeRequired}
                        onChange={() => toggleSecuritySetting('passwordChangeRequired')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Zone dangereuse</h3>
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4">Ces actions sont irréversibles. Soyez certain de ce que vous faites.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Supprimer le compte
                      </button>
                      <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Réinitialiser le mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractorSettings;