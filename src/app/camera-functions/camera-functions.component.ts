import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  signal
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-camera-functions',
  standalone: true,
  imports: [CommonModule, FormsModule, CropperFunctionsComponent],
  templateUrl: './camera-functions.component.html',
  styleUrls: ['./camera-functions.component.css']
})
export class CameraFunctionsComponent {
  // Referenz auf das Video-Element für die Kamera-Vorschau
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  // EventEmitter für das aufgenommene Bild
  @Output() captured = new EventEmitter<string>();

  // Aktueller Kamera-Stream
  stream: MediaStream | null = null;
  // Das aufgenommene Bild (Base64)
  capturedImage: string | null = null;
  // Bild, das bearbeitet werden soll
  imageToEdit: string | null = null;
  // Das zugeschnittene Bild
  croppedImage: string | null = null;

  // Zeigt an, ob die Kamera angezeigt wird
  showCamera = signal(false);
  // Status des Kamera-Panels (offen/geschlossen)
  cameraPanelOpen = false;
  // Form für den Zuschnitt (Crop)
  cropShape = signal<'circle' | 'oval' | 'square'>('square');

  // Ausgewählte Kamera-Aktion
  selectedCameraAction: any = null;
  // Liste der verfügbaren Kamera-Aktionen
  cameraActions = [
    { label: 'Kamera öffnen', value: 'openCamera' },
    { label: 'Bild herunterladen', value: 'downloadImage' },
    { label: 'Bild bearbeiten', value: 'editImage' },
    { label: 'Bild zuschneiden', value: 'cropImage' },
    { label: 'Bild auswählen', value: 'selectImage' },
    { label: 'Bild löschen', value: 'cancelImage' },
    { label: 'Kamera starten', value: 'startCamera' },
    { label: 'Kamera schließen', value: 'closeCamera' },
    { label: 'Bild hochladen', value: 'uploadImage' },
    { label: 'Bild speichern', value: 'saveImage' },
    { label: 'Bild aufnehmen', value: 'takePicture' },
    { label: 'Kamera stoppen', value: 'stopCamera' },
    { label: 'Kamera zurücksetzen', value: 'resetCamera' }
  ];


  constructor(private sanitizer: DomSanitizer) { }

  // Öffnet oder schließt das Kamera-Panel
  toggleCameraPanel() {
    this.cameraPanelOpen = !this.cameraPanelOpen;
  }

  // Startet die Kamera und zeigt den Stream an
  async openCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.stream) {
        const video = this.videoElement.nativeElement;
        video.srcObject = this.stream;
        video.play();
      }
      this.showCamera.set(true);
    } catch (err) {
      console.error('Kamera konnte nicht gestartet werden:', err);
    }
  }

  // Nimmt ein Bild von der Kamera auf
  takePicture(): void {
    if (!this.videoElement) return;
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/png');
      this.capturedImage = image;
      this.captured.emit(image);
      this.imageToEdit = image;
    }
  }

  // Stoppt die Kamera und beendet den Stream
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.showCamera.set(false);
  }

  // Lädt das aufgenommene Bild herunter
  downloadImage(): void {
    if (!this.capturedImage) return;
    const link = document.createElement('a');
    link.href = this.capturedImage;
    link.download = 'photo.png';
    link.click();
  }

  // Wird aufgerufen, wenn ein Bild ausgewählt wird (Dateiupload)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageToEdit = reader.result as string;
        this.capturedImage = this.imageToEdit;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Wird aufgerufen, wenn das Bild zugeschnitten wurde
  onCropped(result: string): void {
    this.croppedImage = result;
    this.capturedImage = result;
  }

  // Setzt die Form für den Zuschnitt
  setCropShape(shape: 'oval' | 'circle' | 'square') {
    this.cropShape.set(shape);
  }

  // Löscht das aufgenommene und bearbeitete Bild
  clearCapturedImage() {
    this.capturedImage = null;
    this.imageToEdit = null;
    this.croppedImage = null;
  }

  // Setzt die Kamera zurück (Bild löschen, Kamera stoppen und neu starten)
  resetCamera() {
    this.clearCapturedImage();
    this.stopCamera();
    this.openCamera();
  }

  // Bricht die Bildauswahl/-aufnahme ab
  cancelImage() {
    this.clearCapturedImage();
  }

  // Speichert das aktuelle Bild (lädt es herunter)
  saveImage() {
    this.downloadImage();
  }

  // Setzt das Bild zum Bearbeiten
  editImage() {
    if (this.capturedImage) {
      this.imageToEdit = this.capturedImage;
    }
  }

  // Führt die ausgewählte Kamera-Aktion aus
  onCameraActionSelect() {
    if (!this.selectedCameraAction) return;
    switch (this.selectedCameraAction.value) {
      case 'openCamera':
        this.openCamera();
        break;
      case 'downloadImage':
        this.downloadImage();
        break;
      case 'editImage':
        this.editImage();
        break;
      case 'cropImage':
        // Hier ggf. Cropper anzeigen/aktivieren
        break;
      case 'selectImage':
        // Öffne Dateiauswahl (simuliere Klick auf verstecktes Input-Element)
        const fileInput = document.getElementById('fileInput');
        if (fileInput) (fileInput as HTMLInputElement).click();
        break;
      case 'cancelImage':
        this.cancelImage();
        break;
      case 'startCamera':
        this.openCamera();
        break;
      case 'closeCamera':
        this.stopCamera();
        break;
      case 'uploadImage':
        // Upload-Logik hier einfügen
        break;
      case 'saveImage':
        this.saveImage();
        break;
      case 'takePicture':
        this.takePicture();
        break;
      case 'stopCamera':
        this.stopCamera();
        break;
      case 'resetCamera':
        this.resetCamera();
        break;
      default:
        break;
    }
  }
  // Optionen für den Cropper (Zuschnitt)
  cropperOptions = {
    aspectRatio: 16 / 9,
    viewMode: 1,
    dragMode: 'crop',
    autoCrop: true,
    background: true,
    scalable: true,
    zoomable: true,
    rotatable: true,
    movable: true,
    cropBoxResizable: true,
    guides: true,
    center: true,
    modal: true,
    highlight: true
  };
}
