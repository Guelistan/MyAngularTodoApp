declare module 'cropperjs' {
  export default class Cropper {
    constructor(image: HTMLImageElement, options?: any);
    getCroppedCanvas(options?: any): HTMLCanvasElement;
    destroy(): void;
  }
}
