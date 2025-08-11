'use client';

import React, { useState, JSX } from 'react';
import Image from 'next/image';
import { 
  ClipboardList, Home, User, FileText,
  Check, AlertTriangle, ChevronDown, ChevronUp,
  Zap, Droplet, Flame, Paintbrush, DoorOpen,
  Bath, Bed, Sofa, Refrigerator, Tv, WashingMachine,
  Download, Printer, Share2, Mail, X
} from 'lucide-react';
import Link from 'next/link';

interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
  tags?: string[];
}

/*
interface Room {
  id: string;
  name: string;
  type: string;
  elements: Element[];
}
  */

interface Element {
  id: string;
  name: string;
  type: string;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  notes?: string;
  photos: Photo[];
}

/*
interface MeterReading {
  type: 'electricity' | 'water' | 'gas';
  value: string;
  photo?: Photo;
  notes?: string;
}
*/

export default function PreEDLResult() {
  const [currentPhotoView, setCurrentPhotoView] = useState<Photo | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    property: true,
    tenant: true,
    rooms: true,
    meters: true,
    comments: true
  });

  // Données simulées du Pré-EDL rempli par le gardien
  const preEDLData = {
    id: 'PRE-EDL-2024-001',
    property: {
      id: 'APT305',
      address: '12 Rue de la Paix, 75002 Paris',
      building: 'Résidence Lumière',
      floor: '3',
      doorNumber: '305',
      type: 'T2',
      surface: '45 m²',
      yearBuilt: '2010'
    },
    tenant: {
      id: 'T1001',
      name: 'Jean Dupont',
      contact: 'jean.dupont@email.com | 06 12 34 56 78',
      present: false
    },
    conductedBy: 'Pierre Martin (Gardien)',
    date: '2024-07-15T10:30:00',
    rooms: [
      { 
        id: '1', 
        name: 'Séjour', 
        type: 'living', 
        elements: [
          { 
            id: '1-1', 
            name: 'Mur principal', 
            type: 'wall', 
            condition: 'good', 
            photos: [
              {
                id: 'photo1',
                url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                name: 'Mur principal.jpg',
                size: 2456789,
                uploadedAt: '2024-07-15T10:30:00',
                tags: ['mur', 'séjour']
              }
            ], 
            notes: '' 
          },
          { 
            id: '1-2', 
            name: 'Sol', 
            type: 'floor', 
            condition: 'fair', 
            photos: [], 
            notes: 'Petites rayures visibles' 
          },
          { 
            id: '1-3', 
            name: 'Fenêtre', 
            type: 'window', 
            condition: 'poor', 
            photos: [
              {
                id: 'photo2',
                url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                name: 'Fenêtre séjour.jpg',
                size: 1876543,
                uploadedAt: '2024-07-15T10:32:00',
                tags: ['fenêtre', 'dégât']
              }
            ], 
            notes: 'Joint à remplacer, fermeture difficile' 
          },
        ] 
      },
      { 
        id: '2', 
        name: 'Cuisine', 
        type: 'kitchen', 
        elements: [
          { 
            id: '2-1', 
            name: 'Évier', 
            type: 'sink', 
            condition: 'good', 
            photos: [], 
            notes: '' 
          },
          { 
            id: '2-2', 
            name: 'Plaques de cuisson', 
            type: 'stove', 
            condition: 'damaged', 
            photos: [
              {
                id: 'photo3',
                url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                name: 'Plaques cuisson.jpg',
                size: 3245678,
                uploadedAt: '2024-07-15T10:35:00',
                tags: ['cuisson', 'dégât']
              }
            ], 
            notes: 'Une plaque ne fonctionne plus' 
          },
          { 
            id: '2-3', 
            name: 'Porte de placard', 
            type: 'door', 
            condition: 'damaged', 
            photos: [], 
            notes: 'Charnière cassée' 
          },
        ] 
      },
      { 
        id: '3', 
        name: 'Salle de bain', 
        type: 'bathroom', 
        elements: [
          { 
            id: '3-1', 
            name: 'Lavabo', 
            type: 'sink', 
            condition: 'good', 
            photos: [], 
            notes: '' 
          },
          { 
            id: '3-2', 
            name: 'Douche', 
            type: 'shower', 
            condition: 'fair', 
            photos: [], 
            notes: 'Joint à refaire' 
          },
        ] 
      },
    ],
    meterReadings: [
      { 
        type: 'electricity', 
        value: '45231', 
        photo: {
          id: 'photo4',
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          name: 'Compteur électricité.jpg',
          size: 2987654,
          uploadedAt: '2024-07-15T10:40:00',
          tags: ['compteur', 'électricité']
        }, 
        notes: '' 
      },
      { 
        type: 'water', 
        value: '12345', 
        photo: undefined, 
        notes: 'Compteur difficile d&apos;accès' 
      },
      { 
        type: 'gas', 
        value: '6789', 
        photo: undefined, 
        notes: '' 
      },
    ],
    generalComments: 'Logement globalement en bon état mais avec quelques éléments à réparer. Fenêtre du séjour et plaques de cuisson nécessitent une intervention. Porte de placard en cuisine à réparer.',
    nextSteps: 'Analyse par IA pour déterminer les diagnostics nécessaires'
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderConditionBadge = (condition: string) => {
    const config = {
      good: { color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4 mr-1" />, text: 'Bon état' },
      fair: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4 mr-1" />, text: 'État moyen' },
      poor: { color: 'bg-orange-100 text-orange-800', icon: <AlertTriangle className="h-4 w-4 mr-1" />, text: 'Mauvais état' },
      damaged: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 mr-1" />, text: 'Endommagé' }
    };

    const current = config[condition as keyof typeof config] || config.good;

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${current.color}`}>
        {current.icon}
        {current.text}
      </span>
    );
  };

  const renderElementIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      wall: <Paintbrush className="h-5 w-5" />,
      floor: <DoorOpen className="h-5 w-5" />,
      window: <DoorOpen className="h-5 w-5" />,
      door: <DoorOpen className="h-5 w-5" />,
      sink: <Droplet className="h-5 w-5" />,
      stove: <Flame className="h-5 w-5" />,
      electrical: <Zap className="h-5 w-5" />,
      bathroom: <Bath className="h-5 w-5" />,
      bedroom: <Bed className="h-5 w-5" />,
      living: <Sofa className="h-5 w-5" />,
      fridge: <Refrigerator className="h-5 w-5" />,
      tv: <Tv className="h-5 w-5" />,
      washing: <WashingMachine className="h-5 w-5" />,
      shower: <Bath className="h-5 w-5" />,
      default: <Home className="h-5 w-5" />
    };

    return icons[type] || icons.default;
  };

  const renderMeterIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Zap className="h-5 w-5" />;
      case 'water': return <Droplet className="h-5 w-5" />;
      case 'gas': return <Flame className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <ClipboardList className="h-8 w-8 mr-3" />
                Résultat du Pré-État des Lieux
              </h1>
              <p className="mt-2">Inventaire détaillé du logement rempli par le gardien</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrint}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30"
                title="Imprimer"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30" title="Exporter PDF">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30" title="Partager">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30" title="Envoyer par email">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID Pré-EDL</p>
              <p className="font-medium">{preEDLData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de réalisation</p>
              <p className="font-medium">{formatDate(preEDLData.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Réalisé par</p>
              <p className="font-medium">{preEDLData.conductedBy}</p>
            </div>
          </div>
        </div>

        {/* Property Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('property')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Informations sur le logement
            </h2>
            {expandedSections.property ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.property && (
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{preEDLData.property.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bâtiment/Étage/Porte</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-gray-50 rounded border">
                      {preEDLData.property.building}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {preEDLData.property.floor}
                    </div>
                    <div className="p-2 bg-gray-50 rounded border">
                      {preEDLData.property.doorNumber}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type de logement</p>
                  <p className="font-medium">{preEDLData.property.type} - {preEDLData.property.surface}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Année de construction</p>
                  <p className="font-medium">{preEDLData.property.yearBuilt}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tenant Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('tenant')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations sur le locataire
            </h2>
            {expandedSections.tenant ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.tenant && (
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nom du locataire</p>
                  <p className="font-medium">{preEDLData.tenant.name} (ID: {preEDLData.tenant.id})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coordonnées</p>
                  <p className="font-medium">{preEDLData.tenant.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Présence lors de la visite</p>
                  <p className="font-medium">{preEDLData.tenant.present ? 'Oui' : 'Non'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rooms Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('rooms')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Inventaire des pièces et éléments
            </h2>
            {expandedSections.rooms ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.rooms && (
            <div className="px-6 pb-6 space-y-6">
              {preEDLData.rooms.map((room) => (
                <div key={room.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="font-medium">{room.name}</h3>
                  </div>

                  <div className="divide-y">
                    {room.elements.map((element) => (
                      <div key={element.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              {renderElementIcon(element.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{element.name}</h4>
                              <div className="mt-1">
                                {renderConditionBadge(element.condition)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {element.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">{element.notes}</p>
                        )}

                        {element.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {element.photos.map((photo) => (
                              <div key={photo.id} className="relative">
                                <Image
                                  src={photo.url}
                                  alt={photo.name}
                                  className="w-16 h-16 object-cover rounded border cursor-pointer"
                                  onClick={() => setCurrentPhotoView(photo)}
                                />
                                <div className="text-xs text-gray-500 truncate mt-1">
                                  {photo.name}
                                </div>
                              </div>
                            ))}
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

        {/* Meters Section */}
        <div className="border-b">
          <button 
            onClick={() => toggleSection('meters')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Relevé des compteurs
            </h2>
            {expandedSections.meters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.meters && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {preEDLData.meterReadings.map((reading, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {renderMeterIcon(reading.type)}
                      <h3 className="font-medium capitalize">
                        {reading.type === 'electricity' && 'Électricité'}
                        {reading.type === 'water' && 'Eau'}
                        {reading.type === 'gas' && 'Gaz'}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Index</p>
                        <p className="font-medium">{reading.value || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Photo</p>
                        <p className="font-medium">
                          {reading.photo ? (
                            <button 
                              onClick={() => setCurrentPhotoView(reading.photo)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Voir photo
                            </button>
                          ) : 'Aucune'}
                        </p>
                      </div>
                    </div>
                    
                    {reading.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Remarques</p>
                        <p className="text-sm italic">{reading.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div>
          <button 
            onClick={() => toggleSection('comments')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Commentaires généraux et prochaines étapes
            </h2>
            {expandedSections.comments ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {expandedSections.comments && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Commentaires du gardien</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-800">{preEDLData.generalComments}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Prochaines étapes</h3>
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <p className="text-blue-800">{preEDLData.nextSteps}</p>
                </div>
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
            <Link href="/edl" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Retour à la liste
            </Link>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Printer className="h-5 w-5 mr-2" />
              Imprimer
            </button>
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {currentPhotoView && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setCurrentPhotoView(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="max-w-4xl w-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-medium">
                  {currentPhotoView.name}
                </h3>
                <div className="text-gray-300 text-sm">
                  {currentPhotoView.tags?.join(', ')}
                </div>
              </div>
              
              <div className="bg-black rounded-lg overflow-hidden">
                <Image
                  src={currentPhotoView.url}
                  alt={currentPhotoView.name}
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}