import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Cropper from 'cropperjs';
import type { CropperOptions } from 'cropperjs';

@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <img #image [src]="imageSrc" alt="Image to crop" />
      <button (click)="cropImage()">Crop</button>
    </div>
  `,
  styles: [
    `
      img {
        max-width: 100%;
        display: block;
      }
    `,
  ],
})
export class CropperComponent {
  @ViewChild('image', { static: true }) imageElement!: ElementRef<HTMLImageElement>;
  @Output() cropped = new EventEmitter<string>();

  imageSrc: string = 'path/to/your/image.jpg'; // Ersetze durch deinen Bildpfad
  private cropper!: Cropper;
  ngAfterViewInit() {
    const options: CropperOptions = {
      aspectRatio: 1,
      viewMode: 1,
    };
    this.cropper = new Cropper(this.imageElement.nativeElement, options);
  }
  }

  cropImage() {
    const canvas = this.cropper.getCropperCanvas();
    if (canvas) {
      const croppedImage = canvas.toDataURL('image/png');
      this.cropped.emit(croppedImage);
    }
  }
}
function cropImage() {
  throw new Error('Function not implemented.');
}

