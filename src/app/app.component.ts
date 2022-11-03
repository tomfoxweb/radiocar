import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Car } from './car';
import { ImageProviderService } from './image-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'radiocar';
  private car!: Car;
  private initializationComplete = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  private touchEndY = 0;
  private mapWidth = 0;
  private mapHeight = 0;
  private carHasHitWall = false;

  @ViewChild('canvasGame') canvasGame!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:keydown.ArrowUp', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    if (this.initializationComplete && this.car) {
      this.car.forward();
    }
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  handleArrowRight(event: KeyboardEvent) {
    if (this.initializationComplete && this.car) {
      this.car.right();
    }
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    if (this.initializationComplete && this.car) {
      this.car.back();
    }
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  handleArrowLeft(event: KeyboardEvent) {
    if (this.initializationComplete && this.car) {
      this.car.left();
    }
  }

  @HostListener('window:pointerdown', ['$event'])
  handlePointerDown(event: PointerEvent) {
    this.setStartTouchPosition(event.clientX, event.clientY);
  }

  @HostListener('window:pointerup', ['$event'])
  handlePointerUp(event: PointerEvent) {
    this.setEndTouchPosition(event.clientX, event.clientY);
    this.processPointerMove();
  }

  @HostListener('window:touchstart', ['$event'])
  handleTouchDown(event: TouchEvent) {
    if (event.changedTouches.length > 0) {
      const x = event.changedTouches[0].clientX;
      const y = event.changedTouches[0].clientY;
      this.setStartTouchPosition(x, y);
    }
  }

  @HostListener('window:touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    if (event.changedTouches.length > 0) {
      const x = event.changedTouches[0].clientX;
      const y = event.changedTouches[0].clientY;
      this.setEndTouchPosition(x, y);
      this.processPointerMove();
    }
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event: UIEvent) {
    const canvas = this.canvasGame.nativeElement;
    const css = window.getComputedStyle(canvas);
    const canvasWidth = Number.parseInt(css.width);
    const canvasHeight = Number.parseInt(css.height);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    this.car.setMapSize(canvasWidth, canvasHeight);
    this.mapWidth = canvasWidth;
    this.mapHeight = canvasHeight;
  }

  constructor(private imageProvider: ImageProviderService) {}

  private setStartTouchPosition(x: number, y: number): void {
    this.touchStartX = x;
    this.touchStartY = y;
  }

  private setEndTouchPosition(x: number, y: number): void {
    this.touchEndX = x;
    this.touchEndY = y;
  }

  private processPointerMove(): void {
    const sx = Math.abs(this.touchEndX - this.touchStartX);
    const sy = Math.abs(this.touchEndY - this.touchStartY);
    if (sx + sy < 30) {
      return;
    }
    if (sx > sy) {
      if (this.touchEndX > this.touchStartX) {
        this.car.right();
      } else {
        this.car.left();
      }
    } else {
      if (this.touchEndY > this.touchStartY) {
        this.car.back();
      } else {
        this.car.forward();
      }
    }
  }

  async ngAfterViewInit() {
    const canvas = this.canvasGame.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Couldn't create rendering context");
    }
    const css = window.getComputedStyle(canvas);
    this.mapWidth = Number.parseInt(css.width);
    this.mapHeight = Number.parseInt(css.height);
    canvas.width = this.mapWidth;
    canvas.height = this.mapHeight;
    const carImage = await this.imageProvider.getCarImage();
    this.car = new Car(this.mapWidth, this.mapHeight, carImage);
    window.setInterval(() => {
      ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
      this.car.move();
      this.car.draw(ctx);
      if (this.car.hitWall()) {
        if (!this.carHasHitWall) {
          this.carHasHitWall = true;
          this.car.stop();
          this.car.draw(ctx);
          window.setTimeout(() => {
            alert('Game Over');
            this.car.restart();
            this.carHasHitWall = false;
          }, 100);
        }
      }
    }, 16);
    this.initializationComplete = true;
  }
}
