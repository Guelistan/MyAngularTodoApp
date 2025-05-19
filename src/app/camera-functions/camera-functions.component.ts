import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import cropperjs from 'cropperjs';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-camera-functions',
  templateUrl: './camera-functions.component.html',
  styleUrls: ['./camera-functions.component.css'],
  standalone: true,
  animations: [trigger('fadeIn', [transition(':enter', [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))])])

  ],
  imports: [CommonModule, FormsModule],
})
export class CameraFunctionsComponent {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Output() captured = new EventEmitter<string>();
  stream: MediaStream | null = null;

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
      this.captured.emit(image);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
