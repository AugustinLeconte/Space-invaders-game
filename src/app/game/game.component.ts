import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WaveComponent } from './components/wave/wave.component';
import { XpComponent } from './components/xp/xp.component';
import { GameStateService } from './services/gameState.service';
import { GameService } from './services/game.service';
import { PowerUpsComponent } from './components/power-ups/power-ups.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, WaveComponent, XpComponent, PowerUpsComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private gamePausedSubscription!: Subscription;
  isPaused!: boolean;

  constructor(
    public gameStateService: GameStateService,
    public gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gamePausedSubscription = this.gameStateService.gamePaused$.subscribe(
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
