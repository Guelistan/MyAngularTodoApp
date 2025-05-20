import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  Signal,
  signal,
  effect
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
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() captured = new EventEmitter<string>();

  stream: MediaStream | null = null;
  capturedImage: string | null = null;

  showCamera = signal(false);
  imageToEdit: string | null = null;

  constructor(private sanitizer: DomSanitizer) { }

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

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
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
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCropped(croppedImage: string): void {
    this.capturedImage = croppedImage;
  }
}
