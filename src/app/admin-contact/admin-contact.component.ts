import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';

interface Contact {
    id: number;
    title?: string;
    description?: string;
    image?: string;
    photo?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string; // <--- HIER ergänzen!
    link?: string;
    contactId?: number;
}

interface Card {
    id: number;
    title: string;
    description: string;
    image?: string;
    name?: string;
    address?: string;
    phone?: string;
    link?: string;
    contactId?: number;
}

@Component({
    selector: 'app-admin-contact',
    standalone: true,
    templateUrl: './admin-contact.component.html',
    styleUrls: ['./admin-contact.component.css'],
    imports: [
        CommonModule,
        FormsModule, CameraFunctionsComponent, CropperFunctionsComponent

    ]
})
export class AdminContactComponent {
    [x: string]: any;
    contacts: Contact[] = [];
    cards: Card[] = [];

    newContact: Contact = this.createEmptyContact();
    newCard: Card = this.createEmptyCard();

    selectedContact?: Contact;
    selectedCard?: Card;
    isEditingCard = false;

    showCamera = false;
    showCropper = false;
    showNewCard = false;

    imageToEdit = '';
    croppedImage = '';
    cropShape: 'circle' | 'oval' | 'square' = 'square';

    constructor() {
        this.loadContactsFromLocalStorage();
        this.loadCardsFromLocalStorage();
    }

    trackCardById(index: number, card: Card): number {
        return card.id;
    }

    copyLink(link: string): void {
        navigator.clipboard.writeText(link);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onCardImageDropped(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.newCard.image = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onContactImageDropped(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.newContact.photo = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    // ========== Kontakte ==========
    saveNewContact(): void {
        const contact: Contact = {
            ...this.newContact,
            id: Date.now(),
            link: `https://example.com/contact/${Date.now()}`
        };
        this.contacts.push(contact);
        this.saveContactsToLocalStorage();

        // Automatisch eine Karte für den Kontakt anlegen
        const card: Card = {
            id: Date.now(),
            title: contact.title || contact.name || 'Kontakt',
            description: contact.description || '',
            image: contact.image || contact.photo || '',
            name: contact.name,
            address: contact.address,
            phone: contact.phone,
            link: contact.link,
            contactId: contact.id
        };
        this.cards.push(card);
        this.saveCardsToLocalStorage();

        this.resetNewContact();
    }

    deleteContact(contact: Contact): void {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.cards = this.cards.filter(card => card.contactId !== contact.id);
        this.saveContactsToLocalStorage();
        this.saveCardsToLocalStorage();
    }

    selectContact(contact: Contact): void {
        this.selectedContact = contact;
    }

    private saveContactsToLocalStorage(): void {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    private loadContactsFromLocalStorage(): void {
        const data = localStorage.getItem('contacts');
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }

    public resetNewContact() {
        this.newContact = this.createEmptyContact();
    }

    private createEmptyContact(): Contact {
        return {
            id: 0,
            name: '',
            email: '',
            phone: '',
            address: '',
            photo: '',
            link: ''
        };
    }

    // ========== Karten ==========
    editCard(card: Card): void {
        this.selectedCard = { ...card };
        this.isEditingCard = true;
    }

    cancelEditCard(): void {
        this.selectedCard = undefined;
        this.isEditingCard = false;
        this.showCardCamera = false;
        this.showCardCropper = false;
    }

    saveEditedCard(): void {
        if (!this.selectedCard) return;
        const idx = this.cards.findIndex(c => c.id === this.selectedCard!.id);
        if (idx !== -1) {
            this.cards[idx] = { ...this.selectedCard! };
            this.saveCardsToLocalStorage();
        }
        this.cancelEditCard();
    }

    saveNewCard(): void {
        if (!this.selectedContact) {
            alert('Bitte zuerst einen Kontakt auswählen!');
            return;
        }

        const card: Card = {
            ...this.newCard,
            id: Date.now(),
            contactId: this.selectedContact.id
        };

        this.cards.push(card);
        this.saveCardsToLocalStorage();
        this.newCard = this.createEmptyCard();
        this.showNewCard = false;
    }

    deleteCard(card: Card): void {
        this.cards = this.cards.filter(c => c.id !== card.id);
        this.saveCardsToLocalStorage();
    }

    private saveCardsToLocalStorage(): void {
        localStorage.setItem('cards', JSON.stringify(this.cards));
    }

    private loadCardsFromLocalStorage(): void {
        const data = localStorage.getItem('cards');
        if (data) {
            this.cards = JSON.parse(data);
        }
    }

    private createEmptyCard(): Card {
        return {
            id: 0,
            title: '',
            description: '',
            image: '',
            contactId: 0
        };
    }

    // ========== Bildfunktionen ==========
    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.newContact.photo = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onCardImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.newCard.image = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onCameraImage(image: string): void {
        this.imageToEdit = image;
    }

    onCropped(image: string): void {
        this.croppedImage = image;
        this.newContact.photo = image;
        this.showCropper = false;
        this.imageToEdit = '';
    }

    toggle(section: 'camera' | 'cropper'): void {
        this.showCamera = section === 'camera' ? !this.showCamera : false;
        this.showCropper = section === 'cropper' ? !this.showCropper : false;
    }

    confirmDeleteContact(contact: Contact): void {
        if (confirm('Möchtest du diesen Kontakt wirklich löschen?')) {
            this.deleteContact(contact);
        }
    }

    confirmDeleteCard(card: Card): void {
        if (confirm('Möchtest du diese Karte wirklich löschen?')) {
            this.deleteCard(card);
        }
    }

    // Neue Variablen
    imageToEditCard = '';
    croppedCardImage = '';
    showCardCamera = false;
    showCardCropper = false;
    editingCardImageId: number | null = null;

    // Kamera-Bild für neue Karte
    onCardCameraImage(image: string): void {
        this.imageToEditCard = image;
        this.showCardCropper = true;
    }

    // Bild nach Zuschneiden übernehmen
    onCardCropped(image: string): void {
        if (this.editingCardImageId !== null) {
            const card = this.cards.find(c => c.id === this.editingCardImageId);
            if (card) {
                card.image = image;
                this.saveCardsToLocalStorage();
            }
            this.editingCardImageId = null;
        } else {
            this.newCard.image = image;
        }

        this.imageToEditCard = '';
        this.showCardCropper = false;
        this.showCardCamera = false;
    }

    // Bild einer bestehenden Karte bearbeiten
    editCardImage(card: Card): void {
        this.imageToEditCard = card.image || '';
        this.editingCardImageId = card.id;
        this.showCardCropper = true;
    }

    // Bild per Datei
    onEditCardImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (this.selectedCard) this.selectedCard.image = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    // Bild per Drag & Drop
    onEditCardImageDropped(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (this.selectedCard) this.selectedCard.image = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    // Bild per Kamera
    onEditCardCameraImage(image: string): void {
        if (this.selectedCard) this.selectedCard.image = image;
        this.showCardCamera = false;
    }

    // Bild zuschneiden
    onEditCardCropped(image: string): void {
        if (this.selectedCard) this.selectedCard.image = image;
        this.showCardCropper = false;
    }

    resetNewCard(): void {
        this.newCard = this.createEmptyCard();
    }

    ngOnInit() {
        const stored = localStorage.getItem('cards');
        if (stored) {
            this.cards = JSON.parse(stored);
        }
    }
}
