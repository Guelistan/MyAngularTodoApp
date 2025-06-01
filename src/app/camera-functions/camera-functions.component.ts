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
applyFilters() {
throw new Error('Method not implemented.');
}
rotateImage(arg0: number) {
throw new Error('Method not implemented.');
}
flipImage(arg0: string) {
throw new Error('Method not implemented.');
}
applyZoom() {
throw new Error('Method not implemented.');
}
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() captured = new EventEmitter<string>();
  @Output() imageTaken = new EventEmitter<string>();
  @Output() imageCaptured = new EventEmitter<string>();

  stream: MediaStream | null = null;
  capturedImage: string | null = null;
  imageToEdit: string | null = null;
  croppedImage: string | null = null;

  showCamera = signal(false);
  showCropper = signal(false);
  cropShape = signal<'circle' | 'oval' | 'square'>('square');
  cameraPanelOpen = false;

  selectedCameraAction: any = null;
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
contrast: any;
brightness: any;
zoom: any;

  constructor(private sanitizer: DomSanitizer) { }

  toggleCameraPanel() {
    this.cameraPanelOpen = !this.cameraPanelOpen;
  }

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
      this.imageTaken.emit(image); // Bildaufnahme-Event auslösen
      this.imageCaptured.emit(image); // Neues Event für die Bildaufnahme
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.showCamera.set(false);
  }

  downloadImage(): void {
    if (!this.capturedImage) return;
    const link = document.createElement('a');
    link.href = this.capturedImage;
    link.download = 'photo.png';
    link.click();
  }

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

  onCropped(result: string): void {
    this.croppedImage = result;
    this.capturedImage = result;
    this.showCropper.set(false);
  }

  setCropShape(shape: 'oval' | 'circle' | 'square') {
    this.cropShape.set(shape);
  }

  clearCapturedImage() {
    this.capturedImage = null;
    this.imageToEdit = null;
    this.croppedImage = null;
    this.showCropper.set(false);
  }

  resetCamera() {
    this.clearCapturedImage();
    this.stopCamera();
    this.openCamera();
  }

  cancelImage() {
    this.clearCapturedImage();
  }

  saveImage() {
    this.downloadImage();
  }

  editImage() {
    if (this.capturedImage) {
      this.imageToEdit = this.capturedImage;
    }
  }

  cropImage() {
    if (this.capturedImage) {
      this.imageToEdit = this.capturedImage;
      this.showCropper.set(true);
    }
  }

  selectImage() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) (fileInput as HTMLInputElement).click();
  }

  uploadImage() {
    // Upload-Logik hier einfügen
    console.log('Upload-Funktion noch nicht implementiert.');
  }


  onCameraImage(event: Event): void {
    const image = (event as CustomEvent<string>).detail;
    if (image) {
      this.imageToEdit = image;
    }
  }
  onImageSelected(event: Event): void {
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
        this.cropImage();
        break;
      case 'selectImage':
        this.selectImage();
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
        this.uploadImage();
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
}
