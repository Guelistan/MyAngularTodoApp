import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cropper-functions',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div>
      <img #image [src]="imageSrc" alt="Image to crop" />
      <button (click)="cropImage()">Crop (zentraler Ausschnitt)</button>
    </div>
  `,
  styles: [`
    img { max-width: 100%; display: block; }
  `]
})
export class CropperFunctionsComponent {
  @Input() imageSrc!: string;
  @Output() cropped = new EventEmitter<string>();
  @ViewChild('image', { static: true }) imageElement!: ElementRef<HTMLImageElement>;

  cropImage() {
    const img = this.imageElement.nativeElement;
    const canvas = document.createElement('canvas');
    // Beispiel: quadratischer Ausschnitt aus der Mitte
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
      const croppedImage = canvas.toDataURL('image/png');
      this.cropped.emit(croppedImage);
    }
  }

  onInput(value: string) {
    console.log('Input event:', value);
  }
}

