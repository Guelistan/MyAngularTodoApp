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
  // Referenz auf das Video-Element im Template
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  // EventEmitter für das aufgenommene Bild
  @Output() captured = new EventEmitter<string>();

  // Stream-Objekt für die Kamera
  stream: MediaStream | null = null;
  // Das aktuell aufgenommene Bild
  capturedImage: string | null = null;
  // Bild, das zum Bearbeiten (z.B. Croppen) ausgewählt wurde
  imageToEdit: string | null = null;
  // Das Ergebnis nach dem Croppen
  croppedImage: string | null = null;

  // Signal, ob die Kamera angezeigt werden soll
  showCamera = signal(false);
  // Status, ob das Kamera-Panel geöffnet ist
  cameraPanelOpen = false;
  // Signal für die gewählte Crop-Form
  cropShape = signal<'circle' | 'oval' | 'square'>('square');

  constructor(private sanitizer: DomSanitizer) { }

  // Öffnet die Kamera und zeigt den Stream im Video-Element an
  async openCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.stream) {
        const video = this.videoElement.nativeElement;
        video.srcObject = this.stream;
        video.play();
      }
    } catch (err) {
      console.error('Kamera konnte nicht gestartet werden:', err);
    }
  }

  // Nimmt ein Bild vom aktuellen Videoframe auf
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
    }
  }

  // Stoppt die Kamera und gibt die Ressourcen frei
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Lädt das aktuell aufgenommene Bild herunter
  downloadImage(): void {
    if (!this.capturedImage) return;
    const link = document.createElement('a');
    link.href = this.capturedImage;
    link.download = 'photo.png';
    link.click();
  }

  // Wird aufgerufen, wenn ein Bild vom Nutzer ausgewählt wird (z.B. zum Croppen)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageToEdit = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Wird aufgerufen, wenn das Bild erfolgreich gecroppt wurde
  onCropped(result: string): void {
    this.croppedImage = result;
    this.capturedImage = result; // Optional: Das gecroppte Bild als aktuelles Bild setzen
  }

  // Setzt die gewünschte Crop-Form (z.B. Kreis, Oval, Quadrat)
  setCropShape(shape: 'oval' | 'circle' | 'square') {
    this.cropShape.set(shape);
    console.log('Gewählte Bildform:', shape);
  }
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
