'use client';

import React, { useState, useRef, useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ClipboardList, Home, User, FileText, Camera, 
  Check, AlertTriangle, Plus, X, ChevronDown,
  Hammer, Droplet, Zap, Paintbrush, DoorOpen
} from 'lucide-react';

// Types
interface Photo {
  id: string;
  url: string;
  name: string;
}

interface Element {
  id: string;
  name: string;
  type: string;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  notes?: string;
  photos: Photo[];
}

interface Room {
  id: string;
  name: string;
  elements: Element[];
}

interface MeterReading {
  type: 'electricity' | 'water' | 'gas';
  value: string;
  photo?: Photo;
}

export default function PreEDLPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [property] = useState({
    address: '12 Rue de la Paix, 75002 Paris',
    building: 'Résidence Lumière',
    floor: '3',
    doorNumber: '305',
    type: 'T2'
  });
  const [tenant, setTenant] = useState({
    name: 'Jean Dupont',
    present: false
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([
    { type: 'electricity', value: '' },
    { type: 'water', value: '' },
    { type: 'gas', value: '' }
  ]);
  const [generalComments, setGeneralComments] = useState('');
  const [selectedElement, setSelectedElement] = useState<{roomId: string, elementId: string} | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
  const [newElementName, setNewElementName] = useState('');
  const [isAddingElement, setIsAddingElement] = useState<{roomId: string | null, isAdding: boolean}>({roomId: null, isAdding: false});
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Steps configuration
  const steps = [
    { title: 'Propriété', icon: Home },
    { title: 'Pièces', icon: FileText },
    { title: 'Compteurs', icon: Zap },
    { title: 'Résumé', icon: ClipboardList },
    { title: 'Validation', icon: Check }
  ];

  // Initialize with sample data
  useEffect(() => {
    setRooms([
      { 
        id: '1', 
        name: 'Séjour', 
        elements: [
          { id: '1-1', name: 'Mur principal', type: 'wall', condition: 'good', photos: [] },
          { id: '1-2', name: 'Sol', type: 'floor', condition: 'good', photos: [] }
        ] 
      },
      { 
        id: '2', 
        name: 'Cuisine', 
        elements: [
          { id: '2-1', name: 'Évier', type: 'sink', condition: 'good', photos: [] }
        ] 
      }
    ]);
  }, []);

  // Handlers
  const handleAddRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `Nouvelle pièce ${rooms.length + 1}`,
      elements: []
    };
    setRooms([...rooms, newRoom]);
  };

  const startAddingElement = (roomId: string) => {
    setIsAddingElement({roomId, isAdding: true});
    setNewElementName('');
  };

  const cancelAddingElement = () => {
    setIsAddingElement({roomId: null, isAdding: false});
    setNewElementName('');
  };

  const confirmAddElement = (roomId: string) => {
    if (!newElementName.trim()) return;
    
    const newElement: Element = {
      id: `${roomId}-${Date.now()}`,
      name: newElementName.trim(),
      type: 'other',
      condition: 'good',
      photos: []
    };

    const updatedRooms = rooms.map(room => 
      room.id === roomId 
        ? { ...room, elements: [...room.elements, newElement]} 
        : room
    );
    
    setRooms(updatedRooms);
    setIsAddingElement({roomId: null, isAdding: false});
    setNewElementName('');
  };

  const handleUpdateElement = (roomId: string, elementId: string, updates: Partial<Element>) => {
    const updatedRooms = rooms.map(room => {
      if (room.id !== roomId) return room;
      
      const updatedElements = room.elements.map(element => {
        if (element.id !== elementId) return element;
        return { ...element, ...updates };
      });
      
      return { ...room, elements: updatedElements };
    });
    
    setRooms(updatedRooms);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, roomId: string, elementId: string) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: Photo[] = Array.from(files).map((file, i) => ({
      id: `photo-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    handleUpdateElement(roomId, elementId, {
      photos: [...getElement(roomId, elementId)?.photos || [], ...newPhotos]
    });

    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const getElement = (roomId: string, elementId: string): Element | undefined => {
    const room = rooms.find(r => r.id === roomId);
    return room?.elements.find(e => e.id === elementId);
  };

  const renderConditionBadge = (condition: string) => {
    const config = {
      good: { color: 'bg-emerald-100 text-emerald-800', icon: <Check size={14} />, text: 'Bon' },
      fair: { color: 'bg-amber-100 text-amber-800', icon: <AlertTriangle size={14} />, text: 'Moyen' },
      poor: { color: 'bg-orange-100 text-orange-800', icon: <AlertTriangle size={14} />, text: 'Mauvais' },
      damaged: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle size={14} />, text: 'Endommagé' }
    };

    const current = config[condition as keyof typeof config] || config.good;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${current.color}`}>
        {current.icon}
        <span className="ml-1">{current.text}</span>
      </span>
    );
  };

  const renderElementIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      wall: <Paintbrush size={16} className="text-indigo-500" />,
      floor: <DoorOpen size={16} className="text-amber-500" />,
      sink: <Droplet size={16} className="text-blue-500" />,
      default: <Hammer size={16} className="text-gray-500" />
    };

    return icons[type] || icons.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
          <h1 className="text-xl font-semibold text-white flex items-center">
            <ClipboardList className="mr-2" size={20} />
            Pré-État des Lieux
          </h1>
        </div>

        {/* Stepper */}
        <div className="flex justify-between p-4 border-b bg-gray-50">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center ${currentStep === index ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep === index ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-white border border-gray-300'}`}>
                <step.icon size={18} />
              </div>
              <span className="text-xs">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Property Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{property.address}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{property.building}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{property.floor}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{property.doorNumber}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Locataire</label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{tenant.name}</div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tenant.present}
                    onChange={(e) => setTenant({...tenant, present: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Présent lors de la visite</label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* Rooms */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div key={room.id} className="border rounded-lg overflow-hidden border-gray-200">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">{room.name}</h3>
                      <button
                        onClick={() => startAddingElement(room.id)}
                        className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
                      >
                        <Plus size={14} className="mr-1" />
                        Élément
                      </button>
                    </div>

                    {/* Add Element Form */}
                    {isAddingElement.roomId === room.id && (
                      <div className="p-3 border-b border-gray-200 bg-indigo-50">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newElementName}
                            onChange={(e) => setNewElementName(e.target.value)}
                            placeholder="Nom de l'élément"
                            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoFocus
                          />
                          <button
                            onClick={() => confirmAddElement(room.id)}
                            disabled={!newElementName.trim()}
                            className={`p-2 rounded-md ${newElementName.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelAddingElement}
                            className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="divide-y divide-gray-200">
                      {room.elements.map((element) => (
                        <div key={element.id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              {renderElementIcon(element.type)}
                              <span className="text-gray-800">{element.name}</span>
                            </div>
                            <button
                              onClick={() => setSelectedElement(
                                selectedElement?.elementId === element.id ? null : { roomId: room.id, elementId: element.id }
                              )}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <ChevronDown size={16} className={`transition-transform ${selectedElement?.elementId === element.id ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {selectedElement?.elementId === element.id && (
                            <div className="mt-3 pl-6 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                                <select
                                  value={element.condition}
                                  onChange={(e) => handleUpdateElement(
                                    room.id, 
                                    element.id, 
                                    { condition: e.target.value as any }
                                  )}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  <option value="good">Bon</option>
                                  <option value="fair">Moyen</option>
                                  <option value="poor">Mauvais</option>
                                  <option value="damaged">Endommagé</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                  value={element.notes || ''}
                                  onChange={(e) => handleUpdateElement(room.id, element.id, { notes: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  rows={2}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {element.photos.map((photo) => (
                                    <div key={photo.id} className="relative group">
                                      <Image
                                        src={photo.url}
                                        alt=""
                                        className="w-16 h-16 object-cover rounded-md border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                                        onClick={() => setViewingPhoto(photo)}
                                      />
                                      <button
                                        onClick={() => handleUpdateElement(
                                          room.id, 
                                          element.id, 
                                          { photos: element.photos.filter(p => p.id !== photo.id) }
                                        )}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <input
                                  type="file"
                                  ref={photoInputRef}
                                  onChange={(e) => handlePhotoUpload(e, room.id, element.id)}
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                />
                                <button
                                  onClick={() => photoInputRef.current?.click()}
                                  className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
                                >
                                  <Camera size={14} className="mr-1" />
                                  Ajouter des photos
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddRoom}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une pièce
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* Meters */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                {meterReadings.map((reading, index) => (
                  <div key={index} className="border rounded-lg p-4 border-gray-200 bg-white">
                    <h3 className="font-medium capitalize text-sm mb-3 text-gray-800">
                      {reading.type === 'electricity' ? 'Électricité' : 
                       reading.type === 'water' ? 'Eau' : 'Gaz'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
                        <input
                          type="text"
                          value={reading.value}
                          onChange={(e) => {
                            const updated = [...meterReadings];
                            updated[index].value = e.target.value;
                            setMeterReadings(updated);
                          }}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Entrez la valeur"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        {reading.photo ? (
                          <div className="flex items-center space-x-3">
                            <Image
                              src={reading.photo.url}
                              alt=""
                              className="w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors"
                              onClick={() => setViewingPhoto(reading.photo!)}
                            />
                            <button
                              onClick={() => {
                                const updated = [...meterReadings];
                                updated[index].photo = undefined;
                                setMeterReadings(updated);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              const updated = [...meterReadings];
                              updated[index].photo = {
                                id: `meter-${Date.now()}`,
                                url: 'https://via.placeholder.com/150',
                                name: `meter-${reading.type}.jpg`
                              };
                              setMeterReadings(updated);
                            }}
                            className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors"
                          >
                            <Camera size={14} className="mr-1" />
                            Prendre une photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800">Informations générales</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center">
                      <Home size={14} className="mr-2 text-gray-400" />
                      {property.address}
                    </p>
                    <p className="flex items-center">
                      <User size={14} className="mr-2 text-gray-400" />
                      {tenant.name} {tenant.present && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">présent</span>}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Pièces</h3>
                  {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4 border-gray-200 bg-white">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <FileText size={14} className="mr-2 text-indigo-500" />
                        {room.name}
                      </h4>
                      <div className="mt-3 space-y-3">
                        {room.elements.map((element) => (
                          <div key={element.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              {renderElementIcon(element.type)}
                              <span className="ml-2 text-gray-700">{element.name}</span>
                            </div>
                            {renderConditionBadge(element.condition)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Commentaires généraux</h3>
                  <textarea
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Ajoutez des commentaires généraux sur l&apos;état du bien..."
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Valider
                </button>
              </div>
            </div>
          )}

          {/* Validation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="text-emerald-600" size={24} />
                </div>
                <h3 className="font-medium text-emerald-800 text-lg mb-1">Pré-EDL complet</h3>
                <p className="text-sm text-emerald-600">
                  Les données seront analysées pour déterminer les diagnostics nécessaires.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => router.push('/diagnostics')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium shadow-sm flex items-center transition-colors"
                >
                  <Check className="mr-1" size={16} />
                  Finaliser le pré-EDL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Viewer */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setViewingPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 rounded-full p-2 z-10 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center justify-center h-full">
              <Image
                src={viewingPhoto.url}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-md"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-75">
              {viewingPhoto.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}