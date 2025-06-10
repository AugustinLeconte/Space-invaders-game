import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private gamePausedSubscription!: Subscription;
  isPaused!: boolean;

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gamePausedSubscription = this.gameService.gamePaused$.subscribe(
      (paused) => {
        this.isPaused = paused;
      }
    );
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.gameService.init(canvas);
  }

  ngOnDestroy(): void {
    this.gamePausedSubscription.unsubscribe();
  }
}
