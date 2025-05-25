/* import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { from, Observable } from 'rxjs';
// Make sure the file exists at the specified path, or update the import path if the service is located elsewhere.
import { ContactService } from './contact.service';
// If the file does not exist, create it with a basic Angular service structure:
import { AdUser, contact } from './contact.model'; // Ensure this path is correct
import { CommonOptions } from 'child_process';
import { CommonModule } from '@angular/common';
// Ensure this path is correct
import { HttpClient } from '@angular/common/http';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { stringify } from 'querystring';
import { CalendarComponent } from '../calendar/calendar.component';
@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css'],
  standalone: true,
  imports: [
    CameraFunctionsComponent,
    CropperFunctionsComponent,CalendarComponent
  ]
})
export class AdminContactComponent implements OnInit {
  @ViewChild('imageInput', { static: false }) imageInput!: ElementRef<HTMLInputElement>;
  contacts: contact[] = [];
  chosenContact?: contact;
  searchResult$!: Observable<AdUser[]>;
  searchName = '';
  searchSurname = '';
  searchEmail = '';
  searchPhone = '';
  searchValide = false;
  searchDirty = false;
  internationalsearch = false;
  search = '';
  roles: string[] = [];
  keineRolle = false;
  abteilung = '';
  imageToEdit: string | null = null;
  croppedImage: string | null = null;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    // Kontakte laden
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe(contacts => this.contacts = contacts);
  }
  addContact(adUser: import('./contact.model').AdUser): void {
    interface AddContactResponse {
      // Define properties based on the expected response structure
      // For example:
      success: boolean;
      message?: string;
      contact?: contact;
      [key: string]: any;
    }

    interface AddContactError {
      // Define properties based on the expected error structure
      // For example:
      error: any;
      message?: string;
      [key: string]: any;
    }

    this.contactService.addContact(adUser).subscribe({
      next: (response: AddContactResponse) => {
        console.log('Contact added successfully:', response);
        this.loadContacts();
      },
      error: (err: AddContactError) => {
        console.error('Error adding contact:', err);
      }
    });
  }

  async updateContactPhoto(contact: contact): Promise<void> {
    const file = this.imageInput.nativeElement.files?.[0];
    if (!file) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    const photoBase64 = await toBase64(file);
    const updatedContact = { ...contact, photo: photoBase64 };
    this.contactService.updateContact(updatedContact).subscribe((response: any) => {
      console.log('Contact updated successfully:', response);
      this.loadContacts();
    });
  }

  onPhotoCaptured(photoFile: File, contact: contact) {
    // Convert File to base64 string
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    toBase64(photoFile).then(photoBase64 => {
      const updatedContact = { ...contact, photo: photoBase64 };
      this.contactService.updateContact(updatedContact).subscribe(() => this.loadContacts());
    });
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // handle file
    }
  }

  onCameraImage(imageData: string) {
    this.imageToEdit = imageData;
  }

  onCropped(cropped: string) {
    this.croppedImage = cropped;
    if (this.chosenContact) {
      this.chosenContact.photo = cropped;
      // Optional: this.updateContactPhoto(this.chosenContact);
    }
    this.imageToEdit = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, contact: any) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      // handle the file (e.g., call onPhotoSelected or similar logic)
      const reader = new FileReader();
      reader.onload = (e) => {
        contact.photo = e.target?.result as string; // nicht splitten!
        this.contactService.updateContact(contact).subscribe(() => this.loadContacts());
      }
      reader.readAsDataURL(file);
    }
  }
 }
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css'],
  imports: [
    CommonModule,
    CalendarComponent,
    CropperFunctionsComponent,
    CameraFunctionsComponent
  ]
})
export class AdminContactComponent {
  // Steuert, ob die Kamera angezeigt wird
  showCamera = false;
  // Steuert, ob der Bild-Zuschneider angezeigt wird
  showCropper = false;
  // Steuert, ob der Kalender angezeigt wird
  showCalendar = false;

  // Bild, das bearbeitet werden soll (Base64 oder URL)
  imageToEdit: string = '';
  // Ergebnis des zugeschnittenen Bildes
  croppedImage: string = '';
  // Form des Zuschnitts: Kreis, Oval oder Quadrat
  cropShape: 'circle' | 'oval' | 'square' = 'square';

  // Aufgabenliste mit Titel, Fälligkeitsdatum und Status
  tasks = [
    { title: 'Todo-App erweitern', dueDate: '2025-06-01', status: 'Offen' },
    // ... dynamisch per Service
  ];

  // Kontaktliste mit Name und E-Mail
  contacts = [
    { name: 'Max Mustermann', email: 'max@example.com' },
    { name: 'Lisa Musterfrau', email: 'lisa@example.com' }
  ];

  // Schaltet die Anzeige von Kalender, Cropper oder Kamera um
  toggle(section: 'calendar' | 'cropper' | 'camera') {
    this.showCalendar = section === 'calendar' ? !this.showCalendar : false;
    this.showCropper = section === 'cropper' ? !this.showCropper : false;
    this.showCamera = section === 'camera' ? !this.showCamera : false;
  }

  // Wird aufgerufen, wenn ein Bild von der Kamera aufgenommen wurde
  onCameraImage(image: string) {
    this.imageToEdit = image;
    this.showCropper = true;
    this.showCamera = false;
  }

  // Wird aufgerufen, wenn das Bild zugeschnitten wurde
  onCropped(image: string) {
    this.croppedImage = image;
    this.imageToEdit = '';
    this.showCropper = false;
  }
}
