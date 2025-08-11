'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck,  FileText, AlertTriangle, 
  Check, ChevronDown, ChevronUp, Zap,  
  Flame,  Hammer, ClipboardList, Printer,
  Download,  CircleAlert, 
  HardHat, Thermometer, ShieldAlert, Battery
} from 'lucide-react';
import Link from 'next/link';

interface ExpandedSections {
  summary: boolean;
  diagnostics: boolean;
  validation: boolean;
  actions: boolean;
}

interface Diagnostic {
  id: string;
  type: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites';
  required: boolean;
  reason: string;
  approved?: boolean;
}

interface Room {
  id: string;
  name: string;
  elements: {
    id: string;
    name: string;
    condition: 'good' | 'fair' | 'poor' | 'damaged';
    notes?: string;
    diagnostics: Diagnostic[];
  }[];
}

interface PreEDLData {
  id: string;
  property: {
    address: string;
    building: string;
    floor: string;
    doorNumber: string;
    constructionYear: number;
  };
  tenant: {
    name: string;
    present: boolean;
  };
  rooms: Room[];
}

export default function AnalyseDiagnosticIA() {
  // Données simulées alignées avec le cahier des charges
  const preEDLData: PreEDLData = {
    id: 'PRE-EDL-2024-001',
    property: {
      address: '12 Rue de la Paix, 75002 Paris',
      building: 'Résidence Lumière',
      floor: '3',
      doorNumber: '305',
      constructionYear: 1985
    },
    tenant: {
      name: 'Jean Dupont',
      present: false
    },
    rooms: [
      { 
        id: '1', 
        name: 'Séjour', 
        elements: [
          { 
            id: '1-1', 
            name: 'Mur principal', 
            condition: 'good',
            diagnostics: [] 
          },
          { 
            id: '1-2', 
            name: 'Sol', 
            condition: 'fair', 
            notes: 'Petites rayures visibles',
            diagnostics: [] 
          },
          { 
            id: '1-3', 
            name: 'Fenêtre', 
            condition: 'poor', 
            notes: 'Joint à remplacer, peinture écaillée',
            diagnostics: [
              { id: 'd1', type: 'Plomb', required: true, reason: 'Peinture écaillée détectée' }
            ]
          },
        ] 
      },
      { 
        id: '2', 
        name: 'Cuisine', 
        elements: [
          { 
            id: '2-1', 
            name: 'Évier', 
            condition: 'good',
            diagnostics: [] 
          },
          { 
            id: '2-2', 
            name: 'Plaques de cuisson', 
            condition: 'damaged', 
            notes: 'Une plaque ne fonctionne plus, installation électrique visiblement ancienne',
            diagnostics: [
              { id: 'd2', type: 'Électricité', required: true, reason: 'Installation >15 ans avec défauts visibles' }
            ]
          },
        ] 
      },
      { 
        id: '3', 
        name: 'Salle de bain', 
        elements: [
          { 
            id: '3-1', 
            name: 'Robinetterie', 
            condition: 'fair', 
            notes: 'Fuite légère au niveau du mitigeur',
            diagnostics: [] 
          },
        ] 
      },
    ]
  };

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    summary: true,
    diagnostics: true,
    validation: true,
    actions: true
  });

  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([
    { id: 'd3', type: 'DPE', required: true, reason: 'Logement vide + DPE absent' },
    { id: 'd4', type: 'Amiante', required: true, reason: 'Immeuble construit avant 1997' },
    { id: 'd5', type: 'Gaz', required: false, reason: 'Installation récente détectée' }
  ]);

  const [gtComments, setGtComments] = useState<Record<string, string>>({});
  const [globalComment, setGlobalComment] = useState('');

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleDiagnosticApproval = (id: string) => {
    setDiagnostics(prev => 
      prev.map(d => 
        d.id === id ? { ...d, approved: !d.approved } : d
      )
    );
  };

  const BatteryAlert = ({ className = "" }) => (
    <div className={`relative ${className}`}>
      <Battery />
      <AlertTriangle className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
    </div>
  );
  
  const renderDiagnosticIcon = (type: Diagnostic['type']) => {
    switch (type) {
      case 'DPE': return <Thermometer className="h-4 w-4 text-orange-500" />;
      case 'Amiante': return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'Plomb': return <BatteryAlert className="h-4 w-4 text-purple-500" />;
      case 'Électricité': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'Gaz': return <Flame className="h-4 w-4 text-blue-500" />;
      default: return <HardHat className="h-4 w-4" />;
    }
  };

  const handleSubmitValidation = () => {
    // Logique de soumission au Responsable d'Agence
    alert('Validation soumise au Responsable d\'Agence');
  };

  // Calcul des statistiques
  const totalElements = preEDLData.rooms.flatMap(room => room.elements).length;
  const goodConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'good').length;
  const fairConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'fair').length;
  const poorConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'poor').length;
  const damagedConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'damaged').length;

  
  const approvedDiagnostics = diagnostics.filter(d => d.approved).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <ClipboardCheck className="h-8 w-8 mr-3" />
                Analyse Diagnostique IA - Résultats
              </h1>
              <p className="mt-2 text-blue-100">
                Recommandations de diagnostics basées sur le Pré-EDL et les critères du cahier des charges
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30" title="Imprimer">
                <Printer className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30" title="Exporter PDF">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="p-6 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID Pré-EDL</p>
            <p className="font-medium">{preEDLData.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Adresse du logement</p>
            <p className="font-medium">
              {preEDLData.property.address} - Bât {preEDLData.property.building}, 
              Étage {preEDLData.property.floor}, Porte {preEDLData.property.doorNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Année de construction</p>
            <p className="font-medium">{preEDLData.property.constructionYear}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('summary')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Synthèse de l&apos;analyse
            </h2>
            {expandedSections.summary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.summary && (
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-800">Éléments en bon état</h3>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-green-800">
                  {goodConditionElements} / {totalElements}
                </p>
                <p className="text-sm text-green-600 mt-1">Aucun diagnostic nécessaire</p>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-yellow-800">Éléments à valider</h3>
                  <CircleAlert className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-yellow-800">
                  {fairConditionElements}
                </p>
                <p className="text-sm text-yellow-600 mt-1">Validation GT nécessaire</p>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-orange-800">Éléments dégradés</h3>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-orange-800">
                  {poorConditionElements}
                </p>
                <p className="text-sm text-orange-600 mt-1">Diagnostic recommandé</p>
              </div>

              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-red-800">Éléments endommagés</h3>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-red-800">
                  {damagedConditionElements}
                </p>
                <p className="text-sm text-red-600 mt-1">Diagnostic urgent</p>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostics Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('diagnostics')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <HardHat className="h-5 w-5 mr-2" />
              Diagnostics proposés par l&apos;IA
            </h2>
            {expandedSections.diagnostics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.diagnostics && (
            <div className="px-6 pb-6 space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">Diagnostics automatiques</h3>
                  <p className="text-sm text-gray-600">
                    Basés sur les critères du cahier des charges et l&apos;analyse du Pré-EDL
                  </p>
                </div>

                <div className="divide-y">
                  {diagnostics.map(diagnostic => (
                    <div key={diagnostic.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {renderDiagnosticIcon(diagnostic.type)}
                          <div>
                            <h4 className="font-medium">Diagnostic {diagnostic.type}</h4>
                            <p className="text-sm text-gray-600 mt-1">{diagnostic.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            diagnostic.required 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {diagnostic.required ? 'Obligatoire' : 'Recommandé'}
                          </span>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={!!diagnostic.approved}
                              onChange={() => toggleDiagnosticApproval(diagnostic.id)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Valider</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Commentaires du Gestionnaire Technique</h3>
                <textarea
                  value={globalComment}
                  onChange={(e) => setGlobalComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Ajoutez vos commentaires ou justifications pour les modifications..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('validation')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Validation des éléments par pièce
            </h2>
            {expandedSections.validation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.validation && (
            <div className="px-6 pb-6 space-y-6">
              {preEDLData.rooms.map(room => (
                <div key={room.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="font-medium">{room.name}</h3>
                  </div>

                  <div className="divide-y">
                    {room.elements.map(element => (
                      <div key={element.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 flex-shrink-0 h-5 w-5 ${
                              element.condition === 'good' ? 'text-green-500' :
                              element.condition === 'fair' ? 'text-yellow-500' :
                              element.condition === 'poor' ? 'text-orange-500' : 'text-red-500'
                            }`}>
                              {element.condition === 'good' ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{element.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                État: {{
                                  good: 'Bon',
                                  fair: 'Moyen',
                                  poor: 'Mauvais',
                                  damaged: 'Endommagé'
                                }[element.condition]}
                              </p>
                            </div>
                          </div>
                          {element.condition !== 'good' && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              element.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                              element.condition === 'poor' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {element.condition === 'fair' ? 'Validation requise' : 'Diagnostic requis'}
                            </span>
                          )}
                        </div>

                        {element.notes && (
                          <div className="mt-2 pl-8">
                            <p className="text-sm text-gray-600">{element.notes}</p>
                          </div>
                        )}

                        {element.diagnostics.length > 0 && (
                          <div className="mt-3 pl-8 space-y-2">
                            {element.diagnostics.map(diagnostic => (
                              <div key={diagnostic.id} className="flex items-center text-sm text-gray-700">
                                {renderDiagnosticIcon(diagnostic.type)}
                                <span className="ml-2">
                                  <span className="font-medium">Diagnostic {diagnostic.type}:</span> {diagnostic.reason}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {element.condition === 'fair' && (
                          <div className="mt-3 pl-8">
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                              <div className="flex justify-between">
                                <h5 className="font-medium text-yellow-800 flex items-center">
                                  <Hammer className="h-4 w-4 mr-2" />
                                  Recommandation IA
                                </h5>
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={!!gtComments[element.id]}
                                    onChange={() => setGtComments(prev => ({
                                      ...prev,
                                      [element.id]: prev[element.id] ? '' : 'Validé par le GT'
                                    }))}
                                    className="form-checkbox h-4 w-4 text-yellow-600"
                                  />
                                  <span className="ml-2 text-sm text-yellow-700">Valider</span>
                                </label>
                              </div>
                              <p className="text-sm text-yellow-700 mt-1">
                                Aucun diagnostic systématique requis, mais une validation visuelle est recommandée.
                              </p>
                              {gtComments[element.id] && (
                                <div className="mt-2">
                                  <textarea
                                    value={gtComments[element.id]}
                                    onChange={(e) => setGtComments(prev => ({
                                      ...prev,
                                      [element.id]: e.target.value
                                    }))}
                                    className="w-full border border-yellow-200 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    rows={2}
                                    placeholder="Commentaires du GT..."
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div>
          <button 
            onClick={() => toggleSection('actions')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Plan d&apos;action et transmission
            </h2>
            {expandedSections.actions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.actions && (
            <div className="px-6 pb-6 space-y-4">
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Étapes suivantes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">1. Finaliser la validation des diagnostics</span> - Vérifier et ajuster les diagnostics proposés par l&apos;IA.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">2. Générer le bon de diagnostic</span> - Le système créera automatiquement le bon de travail avec les diagnostics validés.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">3. Transmission au Responsable d&apos;Agence</span> - Pour validation finale et signature numérique avant envoi au prestataire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h3 className="text-lg font-medium text-green-800 mb-2">Résumé des actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Diagnostics proposés</p>
                    <p className="font-medium text-green-800">
                      {diagnostics.length} diagnostics
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diagnostics validés</p>
                    <p className="font-medium text-green-800">
                      {approvedDiagnostics} / {diagnostics.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Éléments à valider</p>
                    <p className="font-medium text-green-800">
                      {fairConditionElements} éléments
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button 
                  onClick={handleSubmitValidation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Soumettre au Responsable d&apos;Agence
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Analyse générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </div>
          <div className="flex space-x-2">
            <Link href="/pre-edl" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Retour au Pré-EDL
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}