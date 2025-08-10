'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { 
  Home, Building, Users, ClipboardList, FileText,
  Mail, CalendarDays, CreditCard, Settings, 
  ChevronLeft, ChevronRight, CheckCircle2,
  AlertCircle, Clock, FileUp, Send, Save, X,
  Camera, Home as HomeIcon, Hammer, Check, AlertTriangle,
  FileSearch, FileSignature, FileInput, FileOutput,
  DollarSign, Banknote, Wallet, TrendingUp, TrendingDown
} from 'lucide-react';
import { 
  EyeIcon, PencilIcon, TrashIcon, 
  PlusIcon, DocumentIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import Sidebar  from '@/components/layouts/sidebar'; // Import du composant Sidebar


interface Transaction {
  id: number;
  transactionId: string;
  type: 'rent' | 'charge' | 'deposit' | 'expense' | 'refund';
  propertyId: string;
  propertyAddress: string;
  tenantId: string;
  tenantName: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: 'bank' | 'cash' | 'check' | 'card' | 'transfer';
  reference: string;
  description?: string;
  relatedDocument?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  pendingPayments: number;
  overduePayments: number;
  rentCollected: number;
  chargesCollected: number;
  depositsHeld: number;
}

export default function FinanceDashboard() {
  // State declarations
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [isViewTransactionModalOpen, setIsViewTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    transactionId: '',
    type: 'rent',
    propertyId: '',
    propertyAddress: '',
    tenantId: '',
    tenantName: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'paid',
    paymentMethod: 'bank',
    reference: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      transactionId: 'TR-2024-001',
      type: 'rent',
      propertyId: 'APT305',
      propertyAddress: 'Apt 305, Résidence Lumière, 75001 Paris',
      tenantId: 'T1001',
      tenantName: 'Jean Dupont',
      date: '2024-07-01',
      amount: 850,
      status: 'paid',
      paymentMethod: 'bank',
      reference: 'VIR JUL24',
      description: 'Loyer juillet 2024'
    },
    {
      id: 2,
      transactionId: 'TR-2024-002',
      type: 'charge',
      propertyId: 'APT305',
      propertyAddress: 'Apt 305, Résidence Lumière, 75001 Paris',
      tenantId: 'T1001',
      tenantName: 'Jean Dupont',
      date: '2024-07-05',
      amount: 120,
      status: 'paid',
      paymentMethod: 'bank',
      reference: 'CHG JUL24',
      description: 'Charges juillet 2024'
    },
    {
      id: 3,
      transactionId: 'TR-2024-003',
      type: 'rent',
      propertyId: 'APT102',
      propertyAddress: 'Apt 102, Résidence Soleil, 75008 Paris',
      tenantId: 'T1002',
      tenantName: 'Marie Dubois',
      date: '2024-07-01',
      amount: 920,
      status: 'pending',
      paymentMethod: 'check',
      reference: 'CHK789012',
      description: 'Loyer juillet 2024'
    },
    {
      id: 4,
      transactionId: 'TR-2024-004',
      type: 'deposit',
      propertyId: 'STUDIO5',
      propertyAddress: 'Studio 5, Résidence Universitaire, 33000 Bordeaux',
      tenantId: 'T1007',
      tenantName: 'Lucas Dubois',
      date: '2024-06-15',
      amount: 650,
      status: 'paid',
      paymentMethod: 'transfer',
      reference: 'DEP JUN24',
      description: 'Dépôt de garantie'
    },
    {
      id: 5,
      transactionId: 'TR-2024-005',
      type: 'expense',
      propertyId: 'APT102',
      propertyAddress: 'Apt 102, Résidence Soleil, 75008 Paris',
      tenantId: '',
      tenantName: '',
      date: '2024-07-10',
      amount: 320,
      status: 'paid',
      paymentMethod: 'card',
      reference: 'INV789456',
      description: 'Réparation plomberie'
    },
    {
      id: 6,
      transactionId: 'TR-2024-006',
      type: 'rent',
      propertyId: 'APT56',
      propertyAddress: 'Apt 56, Résidence Étoile, 75018 Paris',
      tenantId: 'T1003',
      tenantName: 'Ahmed Khan',
      date: '2024-06-01',
      amount: 780,
      status: 'overdue',
      paymentMethod: 'bank',
      reference: '',
      description: 'Loyer juin 2024'
    }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Compute financial summary
  const financialSummary: FinancialSummary = {
    totalRevenue: transactions
      .filter(t => ['rent', 'charge', 'deposit'].includes(t.type) && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0),
    balance: transactions
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => (['rent', 'charge', 'deposit'].includes(t.type) ? sum + t.amount : sum - t.amount), 0),
    pendingPayments: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0),
    overduePayments: transactions
      .filter(t => t.status === 'overdue')
      .reduce((sum, t) => sum + t.amount, 0),
    rentCollected: transactions
      .filter(t => t.type === 'rent' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0),
    chargesCollected: transactions
      .filter(t => t.type === 'charge' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0),
    depositsHeld: transactions
      .filter(t => t.type === 'deposit' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === 'all' || 
      transaction.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      transaction.status === statusFilter;
    
    const matchesDateRange = 
      new Date(transaction.date) >= new Date(dateRange.start) && 
      new Date(transaction.date) <= new Date(dateRange.end);
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  const renderStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      'paid': { color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4 mr-1" /> },
      'pending': { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4 mr-1" /> },
      'overdue': { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
      'cancelled': { color: 'bg-gray-100 text-gray-800', icon: <X className="h-4 w-4 mr-1" /> }
    };

    const text = {
      'paid': 'Payé',
      'pending': 'En attente',
      'overdue': 'En retard',
      'cancelled': 'Annulé'
    };

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${statusConfig[status].color}`}>
        {statusConfig[status].icon}
        {text[status]}
      </span>
    );
  };

  const renderTypeBadge = (type: Transaction['type']) => {
    const typeConfig = {
      'rent': { color: 'bg-purple-100 text-purple-800', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
      'charge': { color: 'bg-yellow-100 text-yellow-800', icon: <FileText className="h-4 w-4 mr-1" /> },
      'deposit': { color: 'bg-blue-100 text-blue-800', icon: <Banknote className="h-4 w-4 mr-1" /> },
      'expense': { color: 'bg-red-100 text-red-800', icon: <TrendingDown className="h-4 w-4 mr-1" /> },
      'refund': { color: 'bg-green-100 text-green-800', icon: <TrendingUp className="h-4 w-4 mr-1" /> }
    };

    const text = {
      'rent': 'Loyer',
      'charge': 'Charges',
      'deposit': 'Dépôt',
      'expense': 'Dépense',
      'refund': 'Remboursement'
    };

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${typeConfig[type].color}`}>
        {typeConfig[type].icon}
        {text[type]}
      </span>
    );
  };

  const renderPaymentMethodBadge = (method: Transaction['paymentMethod']) => {
    const methodConfig = {
      'bank': { color: 'bg-gray-100 text-gray-800', icon: <Banknote className="h-4 w-4 mr-1" /> },
      'cash': { color: 'bg-green-100 text-green-800', icon: <DollarSign className="h-4 w-4 mr-1" /> },
      'check': { color: 'bg-blue-100 text-blue-800', icon: <FileText className="h-4 w-4 mr-1" /> },
      'card': { color: 'bg-purple-100 text-purple-800', icon: <CreditCard className="h-4 w-4 mr-1" /> },
      'transfer': { color: 'bg-orange-100 text-orange-800', icon: <Send className="h-4 w-4 mr-1" /> }
    };

    const text = {
      'bank': 'Virement',
      'cash': 'Espèces',
      'check': 'Chèque',
      'card': 'Carte',
      'transfer': 'Virement'
    };

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs ${methodConfig[method].color}`}>
        {methodConfig[method].icon}
        {text[method]}
      </span>
    );
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditTransactionModalOpen && selectedTransaction) {
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === selectedTransaction.id ? { ...formData, id: selectedTransaction.id } : transaction
      );
      setTransactions(updatedTransactions);
      setIsEditTransactionModalOpen(false);
    } else {
      const newTransaction: Transaction = {
        ...formData,
        id: transactions.length + 1,
        transactionId: `TR-${new Date().getFullYear()}-${(transactions.length + 1).toString().padStart(3, '0')}`
      };
      setTransactions([...transactions, newTransaction]);
      setIsAddTransactionModalOpen(false);
    }
    
    // Reset form
    setFormData({
      transactionId: '',
      type: 'rent',
      propertyId: '',
      propertyAddress: '',
      tenantId: '',
      tenantName: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: 'paid',
      paymentMethod: 'bank',
      reference: '',
      description: ''
    });
  };

  // CRUD operations
  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      transactionId: transaction.transactionId,
      type: transaction.type,
      propertyId: transaction.propertyId,
      propertyAddress: transaction.propertyAddress,
      tenantId: transaction.tenantId,
      tenantName: transaction.tenantName,
      date: transaction.date,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      reference: transaction.reference,
      description: transaction.description || ''
    });
    setIsEditTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
  };

  // File import
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          alert('Erreur de lecture du fichier');
          setIsLoading(false);
          return;
        }

        let importedData: any[];
        
        if (file.name.endsWith('.json')) {
          try {
            importedData = JSON.parse(result.toString());
            if (!Array.isArray(importedData)) {
              throw new Error('Le fichier JSON doit contenir un tableau');
            }
          } catch (error) {
            throw new Error('Format JSON invalide');
          }
        } 
        else if (file.name.endsWith('.csv')) {
          const csvData = result.toString();
          const lines = csvData.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length < 1) {
            throw new Error('Fichier CSV vide');
          }

          const headers = lines[0].split(',').map(h => h.trim());
          importedData = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, i) => {
              obj[header] = values[i]?.trim();
            });
            return obj;
          });
        }
        else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          try {
            const workbook = XLSX.read(result, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            importedData = XLSX.utils.sheet_to_json(firstSheet);
          } catch (error) {
            throw new Error('Erreur de lecture du fichier Excel');
          }
        } else {
          throw new Error('Format de fichier non supporté');
        }

        const importedTransactions = importedData
          .filter(item => item['Type'] && item['Montant'])
          .map((item, index) => ({
            id: transactions.length + index + 1,
            transactionId: item['ID Transaction']?.toString() || `TR-IMP-${new Date().getFullYear()}-${(transactions.length + index + 1).toString().padStart(3, '0')}`,
            type: ['rent', 'loyer'].includes(item['Type']?.toString().toLowerCase()) ? 'rent' : 
                  ['charge', 'charges'].includes(item['Type']?.toString().toLowerCase()) ? 'charge' :
                  ['deposit', 'dépôt'].includes(item['Type']?.toString().toLowerCase()) ? 'deposit' :
                  ['expense', 'dépense'].includes(item['Type']?.toString().toLowerCase()) ? 'expense' : 'refund',
            propertyId: item['ID Propriété']?.toString() || '',
            propertyAddress: item['Adresse Propriété']?.toString() || '',
            tenantId: item['ID Locataire']?.toString() || '',
            tenantName: item['Nom Locataire']?.toString() || '',
            date: item['Date']?.toString() || new Date().toISOString().split('T')[0],
            amount: parseFloat(item['Montant']?.toString() || '0'),
            status: ['paid', 'payé'].includes(item['Statut']?.toString().toLowerCase()) ? 'paid' :
                    ['pending', 'en attente'].includes(item['Statut']?.toString().toLowerCase()) ? 'pending' :
                    ['overdue', 'en retard'].includes(item['Statut']?.toString().toLowerCase()) ? 'overdue' : 'cancelled',
            paymentMethod: ['bank', 'virement'].includes(item['Méthode']?.toString().toLowerCase()) ? 'bank' :
                          ['cash', 'espèces'].includes(item['Méthode']?.toString().toLowerCase()) ? 'cash' :
                          ['check', 'chèque'].includes(item['Méthode']?.toString().toLowerCase()) ? 'check' :
                          ['card', 'carte'].includes(item['Méthode']?.toString().toLowerCase()) ? 'card' : 'transfer',
            reference: item['Référence']?.toString() || '',
            description: item['Description']?.toString() || ''
          }));

        if (importedTransactions.length === 0) {
          throw new Error('Aucune donnée valide trouvée dans le fichier');
        }

        setTransactions([...transactions, ...importedTransactions]);
        alert(`${importedTransactions.length} transactions importées avec succès`);

      } catch (error) {
        console.error('Erreur d\'import:', error);
        alert(`Erreur lors de l'import: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      alert('Seuls les fichiers CSV, JSON et Excel sont supportés');
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-6 overflow-y-auto`}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-neutral-200">
          Tableau de Bord Financier
        </h1>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Revenus Totaux</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.totalRevenue)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Dépenses Totales</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.totalExpenses)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Solde</p>
                <h3 className={`text-2xl font-bold ${
                  financialSummary.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(financialSummary.balance)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Encaissements en attente</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.pendingPayments + financialSummary.overduePayments)}
                </h3>
                <div className="flex space-x-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {formatCurrency(financialSummary.pendingPayments)} en attente
                  </span>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {formatCurrency(financialSummary.overduePayments)} en retard
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Loyers perçus</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.rentCollected)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400">
                <HomeIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Charges perçues</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.chargesCollected)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Dépôts de garantie</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                  {formatCurrency(financialSummary.depositsHeld)}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
                <Banknote className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-4 md:mb-0">Historique des Transactions</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-md pl-10 pr-4 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                />
                <div className="absolute left-3 top-2.5 text-gray-400 dark:text-neutral-500">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded-md px-4 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              >
                <option value="all">Tous types</option>
                <option value="rent">Loyer</option>
                <option value="charge">Charges</option>
                <option value="deposit">Dépôt</option>
                <option value="expense">Dépense</option>
                <option value="refund">Remboursement</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-4 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              >
                <option value="all">Tous statuts</option>
                <option value="paid">Payé</option>
                <option value="pending">En attente</option>
                <option value="overdue">En retard</option>
                <option value="cancelled">Annulé</option>
              </select>
              
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="border rounded-md px-4 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                />
                <span className="flex items-center">à</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="border rounded-md px-4 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                />
              </div>
              
              <button 
                onClick={triggerFileInput}
                disabled={isLoading}
                className="flex items-center justify-center bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Import...
                  </>
                ) : (
                  <>
                    <FileUp className="h-5 w-5 mr-2" />
                    Importer
                  </>
                )}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".xlsx,.xls,.csv,.json"
                className="hidden"
                disabled={isLoading}
              />
              
              <button 
                onClick={() => setIsAddTransactionModalOpen(true)}
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle transaction
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-neutral-800">
                <tr>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">ID Transaction</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Type</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Locataire</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Logement</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Date</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Montant</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Statut</th>
                  <th className="p-3 text-left text-gray-600 dark:text-neutral-300">Méthode</th>
                  <th className="p-3 text-center text-gray-600 dark:text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr 
                    key={transaction.id} 
                    className={`border-t border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                      transaction.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : 
                      transaction.status === 'pending' ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <td className="p-3 text-gray-800 dark:text-neutral-200">
                      <div className="font-mono text-sm">{transaction.transactionId}</div>
                      {transaction.reference && (
                        <div className="text-xs text-gray-500 dark:text-neutral-400">Ref: {transaction.reference}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {renderTypeBadge(transaction.type)}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-neutral-200">
                      {transaction.tenantName ? (
                        <>
                          <div className="font-medium">{transaction.tenantName}</div>
                          <div className="text-sm text-gray-500 dark:text-neutral-400">ID: {transaction.tenantId}</div>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-neutral-400">
                      <div>{transaction.propertyAddress.split(',')[0]}</div>
                      <div className="text-sm text-gray-500 dark:text-neutral-400">ID: {transaction.propertyId}</div>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-neutral-400">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className={`p-3 font-medium ${
                      ['rent', 'charge', 'deposit'].includes(transaction.type) ? 
                        'text-green-600 dark:text-green-400' : 
                        'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="p-3">
                      {renderStatusBadge(transaction.status)}
                    </td>
                    <td className="p-3">
                      {renderPaymentMethodBadge(transaction.paymentMethod)}
                    </td>
                    <td className="p-3 flex justify-center space-x-2">
                      <button 
                        onClick={() => handleViewTransactionDetails(transaction)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir détails"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Adding/Editing Transaction */}
        {(isAddTransactionModalOpen || isEditTransactionModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-neutral-200">
                {isEditTransactionModalOpen ? 'Modifier la Transaction' : 'Créer une Nouvelle Transaction'}
              </h2>
              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Section 1: Transaction Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                      <CreditCard className="h-5 w-5 inline mr-2" />
                      Détails de la Transaction
                    </h3>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        required
                      >
                        <option value="rent">Loyer</option>
                        <option value="charge">Charges</option>
                        <option value="deposit">Dépôt de garantie</option>
                        <option value="expense">Dépense</option>
                        <option value="refund">Remboursement</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Statut*</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        required
                      >
                        <option value="paid">Payé</option>
                        <option value="pending">En attente</option>
                        <option value="overdue">En retard</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Date*</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Montant (€)*</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Méthode de paiement*</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        required
                      >
                        <option value="bank">Virement bancaire</option>
                        <option value="cash">Espèces</option>
                        <option value="check">Chèque</option>
                        <option value="card">Carte bancaire</option>
                        <option value="transfer">Virement</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Section 2: Property and Tenant */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                      <HomeIcon className="h-5 w-5 inline mr-2" />
                      Logement et Locataire
                    </h3>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">ID Propriété</label>
                      <input
                        type="text"
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Adresse du logement</label>
                      <input
                        type="text"
                        name="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">ID Locataire</label>
                      <input
                        type="text"
                        name="tenantId"
                        value={formData.tenantId}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Nom du locataire</label>
                      <input
                        type="text"
                        name="tenantName"
                        value={formData.tenantName}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                      />
                    </div>
                  </div>
                  
                  {/* Section 3: Additional Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                      <FileText className="h-5 w-5 inline mr-2" />
                      Informations Complémentaires
                    </h3>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Référence</label>
                      <input
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        placeholder="Numéro de chèque, référence de virement, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-neutral-300">Description</label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border rounded-md p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        placeholder="Détails supplémentaires sur cette transaction..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => isEditTransactionModalOpen ? setIsEditTransactionModalOpen(false) : setIsAddTransactionModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <DocumentIcon className="h-5 w-5 mr-2" />
                    {isEditTransactionModalOpen ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Viewing Transaction Details */}
        {isViewTransactionModalOpen && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-neutral-200">
                Détails de la Transaction - {selectedTransaction.transactionId}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Transaction Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                    <CreditCard className="h-5 w-5 inline mr-2" />
                    Détails de la Transaction
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Type</p>
                      <p className="text-gray-800 dark:text-neutral-200">
                        {renderTypeBadge(selectedTransaction.type)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Statut</p>
                      <p className="text-gray-800 dark:text-neutral-200">
                        {renderStatusBadge(selectedTransaction.status)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Date</p>
                    <p className="text-gray-800 dark:text-neutral-200">
                      {new Date(selectedTransaction.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Montant</p>
                    <p className={`text-lg font-medium ${
                      ['rent', 'charge', 'deposit'].includes(selectedTransaction.type) ? 
                        'text-green-600 dark:text-green-400' : 
                        'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Méthode de paiement</p>
                    <p className="text-gray-800 dark:text-neutral-200">
                      {renderPaymentMethodBadge(selectedTransaction.paymentMethod)}
                    </p>
                  </div>
                </div>
                
                {/* Property and Tenant */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                    <HomeIcon className="h-5 w-5 inline mr-2" />
                    {selectedTransaction.tenantName ? 'Logement et Locataire' : 'Logement'}
                  </h3>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">ID Propriété</p>
                    <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.propertyId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Adresse du logement</p>
                    <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.propertyAddress}</p>
                  </div>
                  
                  {selectedTransaction.tenantName && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">ID Locataire</p>
                        <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.tenantId}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Nom du locataire</p>
                        <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.tenantName}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Additional Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 border-b pb-2">
                    <FileText className="h-5 w-5 inline mr-2" />
                    Informations Complémentaires
                  </h3>
                  
                  {selectedTransaction.reference && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Référence</p>
                      <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.reference}</p>
                    </div>
                  )}
                  
                  {selectedTransaction.description && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">Description</p>
                      <div className="border rounded-lg p-4 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                        <p className="text-gray-800 dark:text-neutral-200">{selectedTransaction.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setIsViewTransactionModalOpen(false);
                    handleEditTransaction(selectedTransaction);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Modifier
                </button>
                <button 
                  onClick={() => setIsViewTransactionModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}