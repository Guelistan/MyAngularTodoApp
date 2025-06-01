

export interface Card {
  id?: number;
  title: string;
  description: string;
  image?: string;       // Base64 oder URL
  createdAt?: string;
  [key: string]: any;   // Für dynamische UI-Zustände wie isSelected, isDeleted etc.
  isSelected?: boolean;
  isDeleted?: boolean;
  isArchived?:
  boolean;
  isVisible?: boolean;
  showCardDetails?: boolean;
  isEditing?: boolean;
  isNew?: boolean;

  contactId?: number;   // Verknüpfung zu einem Kontakt
  contact?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    link?: string;
  };
  

}
