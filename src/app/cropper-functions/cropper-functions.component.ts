import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cropper-functions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cropper-functions.component.html',
  styleUrls: ['./cropper-functions.component.css']
})
export class CropperFunctionsComponent {
  @Input() imageSrc!: string;
  @Output() cropped = new EventEmitter<string>();
  @ViewChild('image', { static: true }) imageElement!: ElementRef<HTMLImageElement>;
  // Implement this method or remove it if not needed
  onImageCropped(image: string, index: number): void {
    // TODO: handle cropped image if needed
  }

  emitCroppedImage(canvas: HTMLCanvasElement) {
    const editedImage = canvas.toDataURL('image/png');
    this.cropped.emit(editedImage);
  }

  cropImage() {
    const img = this.imageElement.nativeElement;
    const canvas = document.createElement('canvas');
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, (img.naturalWidth - size) / 2, (img.naturalHeight - size) / 2, size, size, 0, 0, size, size);
    }
    this.emitCroppedImage(canvas);
  }

  applyGrayscale() {
    const img = this.imageElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    this.emitCroppedImage(canvas);
  }

  applyBrightness(factor: number) {
    const img = this.imageElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(data[i] * factor, 255);
        data[i + 1] = Math.min(data[i + 1] * factor, 255);
        data[i + 2] = Math.min(data[i + 2] * factor, 255);
      }
      ctx.putImageData(imageData, 0, 0);
    }
    this.emitCroppedImage(canvas);
  }

  onCropped(event: any) {
    // your code here
  }
}
