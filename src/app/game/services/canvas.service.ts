import { Injectable } from '@angular/core';
import { ImageService } from './image.service';
import { PlayerService } from './player.service';
import { BulletsService } from './bullets.service';
import { EnemyService } from './enemy.service';
import { ExplosionService } from './explosions.service';
import { BackgroundService } from './background.service';

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
    private backgroundService: BackgroundService
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

    const player = this.playerService.getPlayer();
    this.ctx.drawImage(
      player.image,
      player.x,
      player.y,
      player.width,
      player.height
    );

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(player.x, player.y - 6, player.width, 4);

    this.ctx.fillStyle = 'lime';
    this.ctx.fillRect(
      player.x,
      player.y - 6,
      player.width * (player.hp / player.maxHp),
      4
    );

    const explosions = this.explosionService.getExplosions();
    explosions.forEach((e) => {
      const col = e.frame;
      this.ctx.drawImage(
        e.sprite,
        col * e.frameWidth,
        0,
        e.frameWidth,
        e.frameHeight,
        e.x,
        e.y,
        e.frameWidth,
        e.frameHeight
      );
    });

    const bullets = this.bulletService.getBullets();
    bullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    const enemyBullets = this.bulletService.getEnemyBullets();
    enemyBullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    const enemies = this.enemyService.getEnemies();
    enemies.forEach((e) => {
      this.ctx.drawImage(e.image, e.x, e.y, e.width, e.height);

      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(e.x, e.y - 6, e.width, 4);

      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(e.x, e.y - 6, e.width * (e.hp / e.maxHp), 4);
    });
  }
}
