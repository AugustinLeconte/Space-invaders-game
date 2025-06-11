import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Enemy } from '../models/enemy.model';
import { Explosion } from '../models/explosion.model';
import { Bullet, Entity, Player } from '../models/entity.model';
import { backgrounds } from '../constants/backgrounds.const';
import { WaveService } from './wave.service';
import { ImageService } from './image.service';
import { XpService } from './xp.service';
import { PlayerService } from './player.service';
import { BulletsService } from './bullets.service';
import { KeysService } from './keys.service';
import { CanvasService } from './canvas.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private backgroundImage!: HTMLImageElement;
  private nextBackgroundImage?: HTMLImageElement;
  private backgroundAlpha = 1;
  private transitioning = false;
  private currentBackground: string = 'stage1';

  private explosionSprite!: HTMLImageElement;
  private explosions: Explosion[] = [];
  private lastFrameTime = performance.now();

  private playerSubscription!: Subscription;
  private player!: Player;
  private enemies: Enemy[] = [];

  private keys: Record<string, boolean> = {};
  private gamePaused = new BehaviorSubject<boolean>(false);
  gamePaused$ = this.gamePaused.asObservable();
  private keyLockP = false;

  constructor(
    private waveService: WaveService,
    private imageService: ImageService,
    private xpService: XpService,
    private playerService: PlayerService,
    private keyService: KeysService,
    private bulletService: BulletsService,
    private canvasService: CanvasService
  ) {}

  loadBackground(imagePath: string) {
    const img = new Image();
    img.onload = () => {
      this.nextBackgroundImage = img;
      this.backgroundAlpha = 0;
      this.transitioning = true;
    };
    img.src = imagePath;
  }

  updateScene(state: string) {
    const newBg = backgrounds[`stage${state as '1' | '2' | '3' | '4'}`];
    if (newBg && newBg !== this.currentBackground) {
      this.loadBackground(newBg);
      this.currentBackground = newBg;
    }
  }

  init(canvas: HTMLCanvasElement) {
    this.playerService.initPlayer({
      x: 700,
      y: 650,
      width: 40,
      height: 30,
      hp: 100,
      maxHp: 100,
      speed: 5,
      experience: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: this.xpService.calculateXpForLevel(2),
      image: this.imageService.loadImage('assets/space/player.png'),
    });
    this.canvasService.initCanvas(canvas);
    this.keyService.initKeys();
    this.imageService.initImages();

    this.explosionSprite = this.imageService.loadImage(
      'assets/space/explosion.png'
    );

    this.playerSubscription = this.playerService.player$.subscribe((player) => {
      this.player = player;
    });

    this.updateScene('1');
    this.gameLoop();
  }

  private gameLoop = (now: number = performance.now()) => {
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (this.gamePaused.value == false && this.player.hp > 0) {
      this.update(deltaTime);
      this.draw();
    }
    this.pauseGestion();
    requestAnimationFrame(this.gameLoop);
  };

  private pauseGestion() {
    if (this.keys['p']) {
      if (!this.keyLockP) {
        this.gamePaused.next(!this.gamePaused.value);
        this.keyLockP = true;
      }
    } else {
      this.keyLockP = false;
    }
  }

  private update(deltaTime: number) {
    this.keyService.playerMovements();
    this.keyService.shootGestion();
    this.enemies.forEach((e) => {
      if (e.canShoot) {
        const now = Date.now();
        if (now - e.lastShotTime > e.shootCooldown) {
          this.bulletService.addEnemyBullet({
            x: e.x + e.width / 2 - 2,
            y: e.y + e.height,
            width: 4,
            height: 10,
            image: this.imageService.enemyBulletImage,
            damage: 10,
            velocity: 10,
          });
          e.lastShotTime = now;
        }
      }
    });
    this.bulletService.bulletMovement();
    this.enemiesMovement();
    this.checkCollisions();
    this.gestionExplosions(deltaTime);
    if (this.enemies.length == 0) {
      this.waveService.nextWave();
      this.enemies = this.waveService.spawnWave(
        this.canvasService.canvas.width
      );
    }
    if (
      this.waveService.getNumberWave() >= 10 &&
      this.waveService.getNumberWave() < 20
    )
      this.updateScene('2');
    if (
      this.waveService.getNumberWave() >= 20 &&
      this.waveService.getNumberWave() < 30
    )
      this.updateScene('3');
    if (
      this.waveService.getNumberWave() >= 30 &&
      this.waveService.getNumberWave() < 40
    )
      this.updateScene('4');
  }

  private gestionExplosions(deltaTime: number) {
    this.explosions.forEach((e) => {
      e.frameTimer += deltaTime;
      if (e.frameTimer >= e.frameInterval) {
        e.frame++;
        e.frameTimer = 0;
      }
    });

    this.explosions = this.explosions.filter((e) => e.frame < e.totalFrames);
  }

  private enemiesMovement() {
    this.enemies.forEach((e, j) => {
      e.y += e.speed;
      if (e.y >= this.canvasService.canvas.height) {
        this.enemies.splice(j, 1);
        this.player.hp -= 20;
      }
    });
  }

  private checkCollisions() {
    const bullets = this.bulletService.getBullets();
    bullets.forEach((bullet, i) => {
      this.enemies.forEach((enemy, j) => {
        if (this.isColliding(bullet, enemy)) {
          this.enemies[j].hp -= bullet.damage;
          this.bulletService.removeBullet(i);
          if (this.enemies[j].hp <= 0) this.removeEnemy(enemy, j);
        }
      });
    });

    const enemyBullets = this.bulletService.getEnemyBullets();
    enemyBullets.forEach((bullet, i) => {
      if (this.isColliding(bullet, this.player)) {
        this.player.hp -= bullet.damage;
        this.bulletService.removeEnemyBullet(i);
      }
    });

    this.enemies.forEach((enemy, i) => {
      if (this.isColliding(enemy, this.player)) {
        this.player.hp -= 20;
        this.removeEnemy(enemy, i);
      }
    });

    if (this.player.hp < 0) this.player.hp = 0;
  }

  private removeEnemy(enemy: Enemy, index: number) {
    this.enemies.splice(index, 1);

    const frameWidth = 87.5;
    const frameHeight = 128;

    this.explosions.push({
      x: enemy.x + enemy.width / 2 - frameWidth / 2,
      y: enemy.y + enemy.height / 2 - frameHeight / 2,
      frame: 0,
      totalFrames: 7,
      sprite: this.explosionSprite,
      frameWidth,
      frameHeight,
      frameTimer: 0,
      frameInterval: 100,
    });

    this.xpService.gainXp(enemy.experience);
  }

  private draw() {
    this.canvasService.ctx.clearRect(
      0,
      0,
      this.canvasService.canvas.width,
      this.canvasService.canvas.height
    );

    if (this.transitioning && this.nextBackgroundImage) {
      this.canvasService.ctx.globalAlpha = 1 - this.backgroundAlpha;
      if (this.backgroundImage) {
        this.canvasService.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvasService.canvas.width,
          this.canvasService.canvas.height
        );
      }

      this.canvasService.ctx.globalAlpha = this.backgroundAlpha;
      this.canvasService.ctx.drawImage(
        this.nextBackgroundImage,
        0,
        0,
        this.canvasService.canvas.width,
        this.canvasService.canvas.height
      );

      this.canvasService.ctx.globalAlpha = 1;

      this.backgroundAlpha += 0.02;

      if (this.backgroundAlpha >= 1) {
        this.backgroundImage = this.nextBackgroundImage!;
        this.nextBackgroundImage = undefined;
        this.transitioning = false;
        this.backgroundAlpha = 1;
      }
    } else {
      if (this.backgroundImage) {
        this.canvasService.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvasService.canvas.width,
          this.canvasService.canvas.height
        );
      }
    }

    this.canvasService.draw();

    this.explosions.forEach((e) => {
      const col = e.frame;
      this.canvasService.ctx.drawImage(
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

    this.enemies.forEach((e) => {
      this.canvasService.ctx.drawImage(e.image, e.x, e.y, e.width, e.height);

      this.canvasService.ctx.fillStyle = 'black';
      this.canvasService.ctx.fillRect(e.x, e.y - 6, e.width, 4);

      this.canvasService.ctx.fillStyle = 'red';
      this.canvasService.ctx.fillRect(
        e.x,
        e.y - 6,
        e.width * (e.hp / e.maxHp),
        4
      );
    });
  }

  private isColliding(a: Entity, b: Entity): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }
}
