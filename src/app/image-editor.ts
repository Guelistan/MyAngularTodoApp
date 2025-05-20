
import { Component } from '@angular/core'; 
import { ImageConfig } from '@angular/common';

export class ImageEditor {
  imageToEdit: string | null = null;
  croppedImage: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target as FileReader;
        this.imageToEdit = target.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCameraImage(image: string) {
    this.imageToEdit = image;
  }

  onCropped(image: string) {
    this.croppedImage = image;
    this.saveImage();
  }

  saveImage() {
    if (this.croppedImage) {
      const images: string[] = JSON.parse(localStorage.getItem('myImages') || '[]');
      images.push(this.croppedImage);
      localStorage.setItem('myImages', JSON.stringify(images));
      alert('Bild gespeichert!');
    }
  }
}
