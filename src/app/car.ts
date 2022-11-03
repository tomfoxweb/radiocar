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
  private carImage: HTMLImageElement;
  private readonly acceleration = 1;
  private readonly rotationDelta = 45;

  constructor(mapWidth: number, mapHeight: number, carImage: HTMLImageElement) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    const minMapSize = Math.min(this.mapWidth, this.mapHeight);
    this.carWidth = minMapSize / 10;
    this.carHeight = this.carWidth / 2;
    this.x = this.mapWidth / 2 - this.carWidth / 2;
    this.y = this.mapHeight / 2 - this.carHeight / 2;
    this.speed = 0;
    this.angle = 90;
    this.carImage = carImage;
  }

  setMapSize(mapWidth: number, mapHeight: number) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    const minMapSize = Math.min(this.mapWidth, this.mapHeight);
    this.carWidth = minMapSize / 10;
    this.carHeight = this.carWidth / 2;
  }

  private calculateCarHitZone(): [number, number] {
    let width = this.carWidth;
    let height = this.carHeight;
    switch (this.angle) {
      case 45:
      case 135:
      case 225:
      case 315:
        height = width;
        break;
      case 90:
      case 270:
        width = this.carHeight;
        height = this.carWidth;
        break;
    }
    return [width, height];
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
    const a = this.angle;
    let speed = this.speed;
    if (a === 45 || a === 135 || a === 225 || a === 315) {
      speed = this.speed * Math.SQRT1_2;
    }
    this.x += speed * movementX;
    this.y -= speed * movementY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-(this.angle / 180.0) * Math.PI);
    ctx.translate(-this.x, -this.y);
    let w = this.carWidth;
    let h = this.carHeight;
    const x = this.x - w / 2;
    const y = this.y - h / 2;
    ctx.drawImage(this.carImage, x, y, this.carWidth, this.carHeight);
    ctx.restore();
  }

  hitWall(): boolean {
    const [w, h] = this.calculateCarHitZone();
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

  stop() {
    this.speed = 0;
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
