'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings,
  ChevronDown,
  ChevronUp,
  Building,
  FileText,
  Shield,
  Bell,
  Users,
  ClipboardCheck,
  CreditCard
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    notifications: true,
    security: false,
    integrations: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const settingsTabs = [
    { id: 'general', icon: Settings, label: 'Général' },
    { id: 'users', icon: Users, label: 'Utilisateurs' },
    { id: 'properties', icon: Building, label: 'Logements' },
    { id: 'workflows', icon: ClipboardCheck, label: 'Workflows' },
    { id: 'billing', icon: CreditCard, label: 'Facturation' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'integrations', icon: FileText, label: 'Intégrations' }
  ];

  const notificationSettings = [
    {
      id: 'new-work-order',
      label: 'Nouveau bon de travail',
      description: 'Recevoir une notification lorsqu&apos;un nouveau bon de travail est créé',
      channels: ['email', 'inApp']
    },
    {
      id: 'work-order-status',
      label: 'Changement de statut',
      description: 'Recevoir une notification lorsque le statut d&apos;un bon de travail change',
      channels: ['email', 'inApp']
    },
    {
      id: 'diagnostic-completed',
      label: 'Diagnostic complété',
      description: 'Recevoir une notification lorsqu\'un diagnostic est terminé',
      channels: ['email', 'inApp']
    },
    {
      id: 'payment-reminder',
      label: 'Rappel de paiement',
      description: 'Recevoir un rappel pour les paiements à effectuer',
      channels: ['email']
    },
    {
      id: 'late-payment',
      label: 'Retard de paiement',
      description: 'Recevoir une alerte pour les paiements en retard',
      channels: ['email', 'inApp', 'sms']
    }
  ];

  const securitySettings = [
    {
      id: 'two-factor',
      label: 'Authentification à deux facteurs',
      description: 'Protégez votre compte avec une vérification supplémentaire'
    },
    {
      id: 'password-policy',
      label: 'Politique de mot de passe',
      description: 'Configurer les exigences de complexité des mots de passe'
    },
    {
      id: 'session-timeout',
      label: 'Délai d&apos;expiration de session',
      description: 'Définir après combien de temps l&apos;inactivité déconnecte l&apos;utilisateur'
    },
    {
      id: 'ip-restrictions',
      label: 'Restrictions d&apos;adresse IP',
      description: 'Limiter l&apos;accès à certaines adresses IP'
    }
  ];

  const integrationSettings = [
    {
      id: 'immoware',
      label: 'ImmoWare',
      description: 'Configuration de l&apos;intégration avec l&apos;ERP ImmoWare'
    },
    {
      id: 'accounting',
      label: 'Logiciel comptable',
      description: 'Connecter Remodash à votre logiciel comptable'
    },
    {
      id: 'diagnostic-tools',
      label: 'Outils de diagnostic',
      description: 'Intégration avec les outils des prestataires de diagnostic'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Informations générales</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom de l&apos;organisation</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                    defaultValue="Remodash"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg dark:bg-neutral-700"
                    placeholder="Entrez l&apos;adresse de votre organisation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Logo</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Changer
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Préférences de l&apos;application</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium">Mode sombre</label>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Activez le mode sombre pour l&apos;interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium">Langue</label>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Définir la langue de l&apos;interface</p>
                  </div>
                  <select className="p-2 border rounded-lg dark:bg-neutral-700">
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium">Fuseau horaire</label>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Définir le fuseau horaire pour les dates</p>
                  </div>
                  <select className="p-2 border rounded-lg dark:bg-neutral-700">
                    <option>Europe/Paris (UTC+1)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection('notifications')}
              >
                <h3 className="text-lg font-medium">Préférences de notification</h3>
                {expandedSections.notifications ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.notifications && (
                <div className="p-6 border-t border-gray-200 dark:border-neutral-700 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Canaux de notification</h4>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Notification dans l&apos;application</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>SMS</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notifications par événement</h4>
                    <div className="space-y-2">
                      {notificationSettings.map(setting => (
                        <div key={setting.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700">
                          <div>
                            <label className="font-medium">{setting.label}</label>
                            <p className="text-sm text-gray-500 dark:text-neutral-400">{setting.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            {['email', 'inApp', 'sms'].map(channel => (
                              <label key={channel} className="flex items-center space-x-1">
                                <input 
                                  type="checkbox" 
                                  className="rounded" 
                                  defaultChecked={setting.channels.includes(channel)}
                                  disabled={!setting.channels.includes(channel)}
                                />
                                <span className="text-sm capitalize">{channel === 'inApp' ? 'In-App' : channel}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection('security')}
              >
                <h3 className="text-lg font-medium">Paramètres de sécurité</h3>
                {expandedSections.security ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.security && (
                <div className="p-6 border-t border-gray-200 dark:border-neutral-700 space-y-6">
                  <div className="space-y-4">
                    {securitySettings.map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700">
                        <div>
                          <label className="font-medium">{setting.label}</label>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">{setting.description}</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Configurer
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Journal d&apos;activité</h4>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Affiche les connexions récentes et les activités suspectes
                      </p>
                      <button className="mt-2 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                        Voir le journal complet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection('integrations')}
              >
                <h3 className="text-lg font-medium">Intégrations</h3>
                {expandedSections.integrations ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedSections.integrations && (
                <div className="p-6 border-t border-gray-200 dark:border-neutral-700 space-y-6">
                  <div className="space-y-4">
                    {integrationSettings.map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700">
                        <div>
                          <label className="font-medium">{setting.label}</label>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">{setting.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Configurer
                          </button>
                          <button className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                            <span className="sr-only">Plus d&apos;options</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">API et développeurs</h4>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Accédez à la documentation API et générez des clés pour les développeurs
                      </p>
                      <button className="mt-2 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                        Accéder à l&apos;API
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Gestion des utilisateurs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Rôles et permissions</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Configurez les rôles et les permissions pour les différents types d&apos;utilisateurs
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Gérer les rôles
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
                <h4 className="font-medium mb-2">Liste des utilisateurs</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Rôle</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Dernière activité</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">Jean Dupont</td>
                        <td className="px-4 py-4 whitespace-nowrap">jean.dupont@example.com</td>
                        <td className="px-4 py-4 whitespace-nowrap">Administrateur</td>
                        <td className="px-4 py-4 whitespace-nowrap">Aujourd&apos;hui, 10:30</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Modifier
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">Marie Martin</td>
                        <td className="px-4 py-4 whitespace-nowrap">marie.martin@example.com</td>
                        <td className="px-4 py-4 whitespace-nowrap">Gestionnaire Technique</td>
                        <td className="px-4 py-4 whitespace-nowrap">Hier, 16:45</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Modifier
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">Pierre Lambert</td>
                        <td className="px-4 py-4 whitespace-nowrap">pierre.lambert@example.com</td>
                        <td className="px-4 py-4 whitespace-nowrap">Gardien</td>
                        <td className="px-4 py-4 whitespace-nowrap">Lundi, 09:15</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Modifier
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                    Précédent
                  </button>
                  <span className="text-sm text-gray-500 dark:text-neutral-400">Page 1 sur 3</span>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'properties':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Gestion des logements</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Configuration des logements</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Gérer les typologies, les équipements et les caractéristiques des logements
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ajouter un logement
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
                <h4 className="font-medium mb-2">Paramètres des logements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Typologies</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Définir les types de logements (T1, T2, etc.)
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Gérer les typologies
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Équipements</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Liste des équipements standards pour les logements
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Gérer les équipements
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Diagnostics</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configuration des critères de diagnostic
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer les diagnostics
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Grille de vétusté</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Paramétrer les durées de vie et abattements
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer la vétusté
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Gestion des workflows</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Processus de départ</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Configurer les étapes du processus de départ des locataires
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Modifier le workflow
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
                <h4 className="font-medium mb-2">Notifications automatiques</h4>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-1">Notification de congé</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer qui reçoit une notification lorsqu&apos;un locataire donne congé
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-1">Notification de diagnostic</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer les notifications liées aux diagnostics
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-1">Notification de travaux</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer les notifications liées aux bons de travaux
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Paramètres de facturation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Configuration financière</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Paramètres liés à la facturation et aux paiements
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Exporter les données
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
                <h4 className="font-medium mb-2">Paramètres</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Bordereau des Prix Unitaires (BPU)</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Gérer les prix de référence pour les travaux
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Importer le BPU
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Pénalités de retard</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer les règles de pénalités pour les retards
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Configurer les pénalités
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">TVA et taxes</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer les taux de TVA applicables
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Gérer les taxes
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Modes de paiement</h5>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Configurer les méthodes de paiement acceptées
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                      Gérer les paiements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Sélectionnez une catégorie de paramètres</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <h1 className="font-bold text-xl text-gray-800 dark:text-neutral-200">Paramètres</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {settingsTabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="md:hidden mb-6">
          <label htmlFor="settings-tabs" className="sr-only">Sélectionner une catégorie de paramètres</label>
          <select
            id="settings-tabs"
            className="w-full p-3 border rounded-lg dark:bg-neutral-800"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {settingsTabs.map(tab => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
};

export default SettingsPage;