import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Car } from './car';

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
    if (sx + sy < 50) {
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

  ngAfterViewInit(): void {
    const canvas = this.canvasGame.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Couldn't create rendering context");
    }
    const css = window.getComputedStyle(canvas);
    canvas.width = Number.parseInt(css.width);
    canvas.height = Number.parseInt(css.height);
    const mapWidth = Number.parseInt(css.width);
    const mapHeight = Number.parseInt(css.height);
    const carWidth = 25;
    const carHeight = 50;
    this.car = new Car(mapWidth, mapHeight, carWidth, carHeight);
    this.car.loadImages().then(() => {
      window.setInterval(() => {
        ctx.clearRect(0, 0, mapWidth, mapHeight);
        this.car.move();
        this.car.draw(ctx);
        if (this.car.hitWall()) {
          window.setTimeout(() => {
            alert('Game Over');
            this.car.restart();
          });
        }
      }, 16);
      this.initializationComplete = true;
    });
  }
}
