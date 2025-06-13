import { Injectable } from '@angular/core';
import { ImageService } from './image.service';
import { PlayerService } from './player.service';
import { BulletsService } from './bullets.service';
import { EnemyService } from './enemy.service';
import { ExplosionService } from './explosions.service';
import { BackgroundService } from './background.service';
import { PowerUpService } from './powerUps.service';
import { MissileService } from './missile.service';

@Injectable({ providedIn: 'root' })
export class CanvasService {
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;

  constructor(
    private imageService: ImageService,
    private playerService: PlayerService,
    private bulletService: BulletsService,
    private enemyService: EnemyService,
    private explosionService: ExplosionService,
    private backgroundService: BackgroundService,
    private powerUpService: PowerUpService,
    private missileService: MissileService
  ) {}

  initCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const playerImage = this.imageService.loadImage('assets/space/player.png');
    playerImage.onload = () => {
      this.ctx.drawImage(playerImage, 100, 100, 40, 30);
    };
  }

  public resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.backgroundService.draw(this.ctx, this.canvas);
    this.playerService.draw(this.ctx);
    this.explosionService.draw(this.ctx);
    this.bulletService.draw(this.ctx);
    this.enemyService.draw(this.ctx);
    this.powerUpService.draw(this.ctx);
    this.missileService.draw(this.ctx);
  }
}
