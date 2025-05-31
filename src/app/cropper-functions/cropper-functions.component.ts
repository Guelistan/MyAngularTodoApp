import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cropper-functions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cropper-functions.component.html',
  styleUrls: ['./cropper-functions.component.css']
})
export class CropperFunctionsComponent implements OnInit {
  @Input() imageSrc!: string;
  @Input() shape: string = 'square';
  @Output() cropped = new EventEmitter<string>();

  ngOnInit() { }

  private loadImage(callback: (img: HTMLImageElement) => void) {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = this.imageSrc;
  }

  cropImage() {
    this.loadImage((img) => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          img,
          (img.naturalWidth - size) / 2,
          (img.naturalHeight - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        this.emitCroppedImage(canvas);
      }
    });
  }

  applyGrayscale() {
    this.loadImage((img) => {
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
        this.emitCroppedImage(canvas);
      }
    });
  }

  applyBrightness(factor: number) {
    this.loadImage((img) => {
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
        this.emitCroppedImage(canvas);
      }
    });
  }

  private applyMask(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return canvas;

    maskCtx.fillStyle = '#000';
    maskCtx.beginPath();
    if (this.shape === 'circle') {
      const r = canvas.width / 2;
      maskCtx.arc(r, r, r, 0, Math.PI * 2);
    } else if (this.shape === 'oval') {
      maskCtx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        canvas.height / 2.2,
        0,
        0,
        Math.PI * 2
      );
    } else {
      maskCtx.rect(0, 0, canvas.width, canvas.height);
    }
    maskCtx.closePath();
    maskCtx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 3] = maskData.data[i + 3];
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }
  previewImage: string | null = null;

  emitFinalImage() {
    if (this.previewImage) {
      this.cropped.emit(this.previewImage);
    }
  }

  private emitCroppedImage(canvas: HTMLCanvasElement) {
    const finalCanvas = this.applyMask(canvas);
    this.previewImage = finalCanvas.toDataURL('image/png');
  }

}
