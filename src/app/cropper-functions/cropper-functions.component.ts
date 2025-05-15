import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper-functions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cropper-functions.component.html',
  styleUrls: ['./cropper-functions.component.css']
})
export class CropperFunctionsComponent {
  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
  @Output() imageCropped = new EventEmitter<string>();

  cropper: Cropper | null = null;
  croppedImage: string | null = null;

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = this.imageElement.nativeElement;
        image.src = reader.result as string;

        if (this.cropper) {
          this.cropper.destroy();
        }

        this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1
        });
      };
      reader.readAsDataURL(file);
    }
  }

  cropImage(): void {
    if (this.cropper) {
      const canvas = this.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingQuality: 'high'
      });
      this.croppedImage = canvas.toDataURL('image/png');
      this.imageCropped.emit(this.croppedImage);
    }
  }

  resetImage(): void {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.croppedImage = null;
  }
}
