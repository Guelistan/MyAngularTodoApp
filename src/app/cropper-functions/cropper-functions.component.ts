import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Cropper from 'cropperjs';

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
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      aspectRatio: 1,
      viewMode: 1,
    });
  }

  cropImage() {
    const canvas = this.cropper.getCroppedCanvas();
    if (canvas) {
      const croppedImage = canvas.toDataURL('image/png');
      this.cropped.emit(croppedImage);
    }
  }
}
