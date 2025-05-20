import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-camera-functions',
  templateUrl: './camera-functions.component.html',
  styleUrls: ['./camera-functions.component.css']
})
export class CameraFunctionsComponent {
  openCamera() {
    throw new Error('Method not implemented.');
  }
  stopCamera() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() captured = new EventEmitter<string>();
  @Output() imageTaken = new EventEmitter<string>();
  stream: MediaStream | null = null;
  capturedImage: string | null = null; // Bild speichern





  // ...
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
      this.imageTaken.emit(image); // <-- Output-Event anpassen
    }
  }


  constructor(private sanitizer: DomSanitizer) { }

  // ... openCamera und stopCamera wie gehabt
  /*
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
        this.capturedImage = image; // Bild speichern
        this.captured.emit(image);
      }
    } */

  downloadImage(): void {
    if (!this.capturedImage) return;
    const link = document.createElement('a');
    link.href = this.capturedImage;
    link.download = 'photo.png';
    link.click();
  }
}

