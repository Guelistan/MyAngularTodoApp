import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageEditorService {
  imageToEdit?: string;
  croppedImage?: string;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          this.imageToEdit = result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCameraImage(image: string): void {
    this.imageToEdit = image;
  }

  onCropped(image: string): void {
    this.croppedImage = image;
    this.saveImage();
  }

  saveImage(): void {
    if (this.croppedImage) {
      const images: string[] = JSON.parse(localStorage.getItem('myImages') ?? '[]');
      images.push(this.croppedImage);
      localStorage.setItem('myImages', JSON.stringify(images));
      alert('Bild gespeichert!');
    }
  }

  editImage(image: string): void {
    this.imageToEdit = image;
  }

  cropImage(source: 'camera' | 'file' | 'cropped'): void {
    let image: string | undefined;

    switch (source) {
      case 'camera':
      case 'file':
        image = this.imageToEdit;
        break;
      case 'cropped':
        image = this.croppedImage;
        break;
      default:
        console.error('Invalid image type');
        return;
    }

    if (image) {
      console.log('cropImage called with', image);
    } else {
      console.warn('No image available to crop');
    }
  }
}
