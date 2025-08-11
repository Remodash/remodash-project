'use client';

import React, { useState } from 'react';
import { 
  ClipboardSignature, FileText, AlertTriangle, Check, ChevronDown, 
  ChevronUp, Printer, Download, 
  Send, UserCheck, MessageSquare, QrCode, Zap, CircleAlert, ClipboardList,
  Thermometer, ShieldAlert, Battery, Flame, HardHat
} from 'lucide-react';
import Link from 'next/link';

interface ExpandedSections {
  summary: boolean;
  diagnostics: boolean;
  validation: boolean;
  signature: boolean;
}

interface Diagnostic {
  id: string;
  type: 'DPE' | 'Amiante' | 'Plomb' | 'Électricité' | 'Gaz' | 'ERPS' | 'Humidité' | 'Termites';
  required: boolean;
  reason: string;
  approved: boolean;
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

export default function ApprobationRA() {
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
              { id: 'd1', type: 'Plomb', required: true, reason: 'Peinture écaillée détectée', approved: true }
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
              { id: 'd2', type: 'Électricité', required: true, reason: 'Installation >15 ans avec défauts visibles', approved: true }
            ]
          },
        ] 
      },
    ]
  };

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    summary: true,
    diagnostics: true,
    validation: true,
    signature: true
  });

  const [raApproval, setRaApproval] = useState({
    signed: false,
    comment: '',
    showQRCode: false
  });

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSignature = () => {
    setRaApproval(prev => ({
      ...prev,
      signed: !prev.signed,
      showQRCode: !prev.signed
    }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRaApproval(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };

  const handleSendToGT = () => {
    alert('Document renvoyé au Gestionnaire Technique pour modifications');
  };

  const handleSendToProvider = () => {
    alert('Bon de diagnostic envoyé au Prestataire');
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

  // Calcul des statistiques
  const totalElements = preEDLData.rooms.flatMap(room => room.elements).length;
  const goodConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'good').length;
  const fairConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'fair').length;
  const poorConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'poor').length;
  const damagedConditionElements = preEDLData.rooms.flatMap(room => room.elements).filter(el => el.condition === 'damaged').length;

  const allDiagnostics = preEDLData.rooms.flatMap(room => 
    room.elements.flatMap(element => element.diagnostics)
  );
  const approvedDiagnostics = allDiagnostics.filter(d => d.approved).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <ClipboardSignature className="h-8 w-8 mr-3" />
                Approbation Responsable d&apos;Agence
              </h1>
              <p className="mt-2 text-blue-100">
                Validation et signature du bon de diagnostic
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
                <p className="text-sm text-yellow-600 mt-1">Validés par le GT</p>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-orange-800">Éléments dégradés</h3>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-orange-800">
                  {poorConditionElements}
                </p>
                <p className="text-sm text-orange-600 mt-1">Diagnostics recommandés</p>
              </div>

              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-red-800">Éléments endommagés</h3>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 text-red-800">
                  {damagedConditionElements}
                </p>
                <p className="text-sm text-red-600 mt-1">Diagnostics urgents</p>
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
              Diagnostics proposés
            </h2>
            {expandedSections.diagnostics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.diagnostics && (
            <div className="px-6 pb-6 space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">Diagnostics validés par le GT</h3>
                  <p className="text-sm text-gray-600">
                    {approvedDiagnostics} / {allDiagnostics.length} diagnostics approuvés
                  </p>
                </div>

                <div className="divide-y">
                  {preEDLData.rooms.map(room => (
                    room.elements.filter(el => el.diagnostics.length > 0).length > 0 && (
                      <div key={room.id} className="p-4">
                        <h4 className="font-medium text-gray-800 mb-3">{room.name}</h4>
                        {room.elements.map(element => (
                          element.diagnostics.map(diagnostic => (
                            <div key={diagnostic.id} className="ml-4 mb-3 p-3 bg-blue-50 rounded border border-blue-100">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                  {renderDiagnosticIcon(diagnostic.type)}
                                  <div>
                                    <h5 className="font-medium">Diagnostic {diagnostic.type}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{diagnostic.reason}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  diagnostic.approved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {diagnostic.approved ? 'Approuvé' : 'En attente'}
                                </span>
                              </div>
                            </div>
                          ))
                        ))}
                      </div>
                    )
                  ))}
                </div>
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
              Validation des éléments
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
                        </div>

                        {element.notes && (
                          <div className="mt-2 pl-8">
                            <p className="text-sm text-gray-600">{element.notes}</p>
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

        {/* Signature Section */}
        <div>
          <button 
            onClick={() => toggleSection('signature')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Signature numérique
            </h2>
            {expandedSections.signature ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.signature && (
            <div className="px-6 pb-6 space-y-4">
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Approbation Responsable d&apos;Agence</h3>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={raApproval.signed}
                      onChange={toggleSignature}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium">
                      {raApproval.signed ? 'Signé' : 'Non signé'}
                    </span>
                  </label>
                </div>

                {raApproval.signed && (
                  <>
                    {raApproval.showQRCode && (
                      <div className="flex flex-col items-center mb-4">
                        <div className="p-4 bg-white rounded border flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Signature numérique - {new Date().toLocaleString('fr-FR')}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Commentaires (optionnel)
                      </h4>
                      <textarea
                        value={raApproval.comment}
                        onChange={handleCommentChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Ajoutez un commentaire pour le prestataire ou le GT..."
                      />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleSendToGT}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Renvoyer au GT
                      </button>
                      <button
                        onClick={handleSendToProvider}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <UserCheck className="h-5 w-5 mr-2" />
                        Valider et envoyer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Document généré le {new Date().toLocaleDateString('fr-FR')}
          </div>
          <div className="flex space-x-2">
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Retour au tableau de bord
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Printer className="h-5 w-5 mr-2 inline" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}