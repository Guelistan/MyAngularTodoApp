export class ImageEditor {
  imageToEdit: string | null = null;
  croppedImage: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageToEdit = e.target.result;
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
      const images = JSON.parse(localStorage.getItem('myImages') || '[]');
      images.push(this.croppedImage);
      localStorage.setItem('myImages', JSON.stringify(images));
      alert('Bild gespeichert!');
    }
  }
}
