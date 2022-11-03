type MovementDelta = -1 | 0 | 1;
type Angle = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

interface MovementSource {
  angle: Angle;
  source: string;
}

interface MovementImage {
  angle: Angle;
  image: HTMLImageElement;
}

export class Car {
  private mapWidth: number;
  private mapHeight: number;
  private carWidth: number;
  private carHeight: number;
  private speed: number;
  private angle: number;
  private x: number;
  private y: number;
  private readonly acceleration = 1;
  private readonly rotationDelta = 45;
  private imageSources: Map<Angle, string>;
  private images: Map<Angle, HTMLImageElement>;

  constructor(
    mapWidth: number,
    mapHeight: number,
    carWidth: number,
    carHeight: number
  ) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.carWidth = carWidth;
    this.carHeight = carHeight;
    this.imageSources = new Map<Angle, string>([
      [0, 'assets/images/car0.png'],
      [45, 'assets/images/car45.png'],
      [90, 'assets/images/car90.png'],
      [135, 'assets/images/car135.png'],
      [180, 'assets/images/car180.png'],
      [225, 'assets/images/car225.png'],
      [270, 'assets/images/car270.png'],
      [315, 'assets/images/car315.png'],
    ]);
    this.images = new Map();
    this.speed = 0;
    this.angle = 90;
    this.x = this.mapWidth / 2 - this.carWidth / 2;
    this.y = this.mapHeight / 2 - this.carHeight / 2;
  }

  async loadImages() {
    this.images.clear();
    const loadingPromises: Promise<MovementImage>[] = [];
    this.imageSources.forEach((source, angle) => {
      loadingPromises.push(this.loadImage({ source, angle }));
    });
    const loadedImages = await Promise.all(loadingPromises);
    loadedImages.forEach((image) => {
      this.images.set(image.angle, image.image);
    });
  }

  private loadImage(source: MovementSource): Promise<MovementImage> {
    return new Promise<MovementImage>((resolve) => {
      const image = new Image();
      image.src = source.source;
      image.addEventListener('load', () => {
        resolve({ angle: source.angle, image: image });
      });
    });
  }

  restart() {
    this.speed = 0;
    this.angle = 90;
    this.x = this.mapWidth / 2 - this.carWidth / 2;
    this.y = this.mapHeight / 2 - this.carHeight / 2;
  }

  forward() {
    this.speed += this.acceleration;
  }

  back() {
    this.speed -= this.acceleration;
  }

  left() {
    this.rotate(this.rotationDelta);
  }

  right() {
    this.rotate(-this.rotationDelta);
  }

  private rotate(rotation: number) {
    if (this.speed < 0) {
      rotation = -rotation;
    }
    let angle = this.angle + rotation;
    if (angle < 0) {
      angle = 315;
    } else if (angle >= 360) {
      angle = 0;
    }
    this.angle = angle;
  }

  move() {
    const [movementX, movementY] = this.calcMovementXY();
    this.x += this.speed * movementX;
    this.y -= this.speed * movementY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const image = this.images.get(this.angle as Angle)!;
    const w = image.width;
    const h = image.height;
    const x = this.x - w / 2;
    const y = this.y - h / 2;
    ctx.drawImage(image, x, y);
    ctx.restore();
  }

  hitWall(): boolean {
    const image = this.images.get(this.angle as Angle)!;
    const w = image.width;
    const h = image.height;
    const x = this.x - w / 2;
    const y = this.y - h / 2;
    if (x < 0 || y < 0) {
      return true;
    }
    if (x + w > this.mapWidth || y + h > this.mapHeight) {
      return true;
    }
    return false;
  }

  private calcMovementXY(): [MovementDelta, MovementDelta] {
    const angle = (this.angle / 180.0) * Math.PI;
    const sx = Math.cos(angle);
    const sy = Math.sin(angle);
    const movementX = this.clampMovement(sx);
    const movementY = this.clampMovement(sy);
    return [movementX, movementY];
  }

  private clampMovement(value: number): MovementDelta {
    if (value < -0.5) {
      return -1;
    }
    if (value > 0.5) {
      return 1;
    }
    return 0;
  }
}
