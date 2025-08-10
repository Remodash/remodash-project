// Comprehensive type declarations for Heroicons v2.x
declare module '@heroicons/react/24/outline' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    title?: string;
    titleId?: string;
  }

  export const EyeIcon: ComponentType<IconProps>;
  export const PencilIcon: ComponentType<IconProps>;
  export const TrashIcon: ComponentType<IconProps>;
  export const PlusIcon: ComponentType<IconProps>;
  
  // Dynamically export all icons from the module
  export * from '@heroicons/react/24/outline';
}

// Compatibility layer for older import paths
declare module '@heroicons/react/solid' {
  export { 
    EyeIcon, 
    PencilIcon, 
    TrashIcon, 
    PlusIcon 
  } from '@heroicons/react/24/outline';
}