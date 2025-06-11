import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WaveComponent } from './components/wave/wave.component';
import { XpComponent } from './components/xp/xp.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, WaveComponent, XpComponent],
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
