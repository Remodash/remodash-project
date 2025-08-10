import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Building, 
  Users, 
  ClipboardList, 
  FileText,
  CreditCard, 
  Settings,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Tableau de Bord', href: '/dashboard/gl' },
        { icon: Building, label: 'Propriétés', href: '/pages/gl/proprietes' },
        { icon: Users, label: 'Locataires', href: '/pages/gl/locataires' },
        { icon: ClipboardList, label: 'Congés', href: '/pages/gl/conges' },
        { icon: FileText, label: 'États des Lieux', href: '/pages/gl/edl' },
        { icon: CreditCard, label: 'Finances', href: '/pages/gl/finances' },
        { icon: Settings, label: 'Paramètres', href: '/pages/gl/parametres' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-50`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className={`font-bold text-xl text-gray-800 dark:text-neutral-200 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Gestion Locative
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200"
          aria-label={isExpanded ? 'Réduire la sidebar' : 'Étendre la sidebar'}
        >
          {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition-colors duration-200 ${
                    isExpanded ? 'px-4' : 'px-3 justify-center'
                  }`}
                  passHref
                >
                  <Icon className={`${isExpanded ? 'mr-4' : 'mr-0'} h-5 w-5 flex-shrink-0`} />
                  <span 
                    className={`whitespace-nowrap transition-opacity duration-300 ${
                      isExpanded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;