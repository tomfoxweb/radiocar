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
