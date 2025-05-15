
declare module 'cropper' {
  export default class Cropper {
    constructor(image: HTMLImageElement, options?: unknown);
    getCroppedCanvas(options?: unknown): HTMLCanvasElement;
    destroy(): void;
  }
}
