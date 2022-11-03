type MovementDelta = -1 | 0 | 1;

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
  private readonly rotation = 45;

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
    this.angle += this.rotation;
  }

  right() {
    this.angle -= this.rotation;
  }

  move() {
    const [movementX, movementY] = this.calcMovementXY();
    this.x += this.speed * movementX;
    this.y -= this.speed * movementY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'green';
    const x = this.x - this.carWidth / 2;
    const y = this.y - this.carHeight / 2;
    const w = this.carWidth;
    const h = this.carHeight;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
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
