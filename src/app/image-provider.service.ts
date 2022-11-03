import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageProviderService {
  private readonly carImagePngUrl = 'assets/images/car.png';
  private readonly carImageSvgUrl = 'assets/images/car.svg';

  constructor() {}

  async getCarImage(): Promise<HTMLImageElement> {
    const svgImage = await this.loadImage(this.carImageSvgUrl);
    if (svgImage.width > 0) {
      return svgImage;
    }
    return this.loadImage(this.carImagePngUrl);
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });
    });
  }
}
