import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enemy, enemyTypes } from '../models/enemy.model';
import { Explosion } from '../models/explosion.model';
import { Bullet, Entity, SpaceShip } from '../models/entity.model';

const backgrounds = {
  stage1: 'assets/space/background/1.png',
  stage2: 'assets/space/background/2.png',
  stage3: 'assets/space/background/3.png',
  stage4: 'assets/space/background/4.png',
};

@Injectable({ providedIn: 'root' })
export class GameService {
  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private bulletImage!: HTMLImageElement;
  private enemyBulletImage!: HTMLImageElement;

  private backgroundImage!: HTMLImageElement;
  private nextBackgroundImage?: HTMLImageElement;
  private backgroundAlpha = 1;
  private transitioning = false;
  private currentBackground: string = 'stage1';

  private explosionSprite!: HTMLImageElement;
  private explosions: Explosion[] = [];
  private lastFrameTime = performance.now();

  private player!: SpaceShip;
  private bullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private enemies: Enemy[] = [];

  private keys: Record<string, boolean> = {};
  private gamePaused = new BehaviorSubject<boolean>(false);
  gamePaused$ = this.gamePaused.asObservable();
  private keyLockP = false;
  private keyLockShoot = false;
  private wave = 0;

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
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const loadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    const playerImage = new Image();
    playerImage.src = 'assets/space/player.png';
    playerImage.onload = () => {
      this.ctx.drawImage(playerImage, 100, 100, 40, 30);
    };

    this.player = {
      x: 700,
      y: 650,
      width: 40,
      height: 30,
      hp: 100,
      maxHp: 100,
      speed: 5,
      image: loadImage('assets/space/player.png'),
    };

    this.bulletImage = new Image();
    this.bulletImage.src = 'assets/space/bullet.png';

    this.explosionSprite = new Image();
    this.explosionSprite.src = 'assets/space/explosion.png';

    this.enemyBulletImage = new Image();
    this.enemyBulletImage.src = 'assets/space/enemyBullet.png';

    window.addEventListener('keydown', (e) => (this.keys[e.key] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.key] = false));

    this.updateScene('1');
    this.gameLoop();
  }

  spawnWave() {
    const enemies: Enemy[] = [];

    const typeCount = Math.min(this.wave, enemyTypes.length);

    for (let i = 0; i < typeCount * 3; i++) {
      const type = enemyTypes[i % typeCount];
      const enemyImage = new Image();
      enemyImage.src = type.image;

      enemies.push({
        x: Math.random() * (this.canvas.width - 40),
        y: Math.random() * 100,
        width: 40,
        height: 30,
        image: enemyImage,
        type: type.type,
        hp: type.hp + (this.wave - 1) * 2,
        maxHp: type.hp + (this.wave - 1) * 2,
        speed: type.speed,
        canShoot: type.canShoot,
        shootCooldown: 1000 + Math.random() * 1000,
        lastShotTime: 0,
      });
    }

    return enemies;
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

  private playerMovements() {
    if (this.keys['ArrowLeft'] && this.player.x - 5 >= 0) this.player.x -= 5;
    if (
      this.keys['ArrowRight'] &&
      this.player.x + 5 < this.canvas.width - this.player.width
    )
      this.player.x += 5;
    if (this.keys['ArrowUp'] && this.player.y - 5 >= 0) this.player.y -= 5;
    if (
      this.keys['ArrowDown'] &&
      this.player.y + 5 < this.canvas.height - this.player.height
    )
      this.player.y += 5;
  }

  private shootGestion() {
    if (this.keys[' ']) {
      if (!this.keyLockShoot) {
        this.bullets.push({
          x: this.player.x + this.player.width / 2 - 2,
          y: this.player.y,
          width: 4,
          height: 10,
          image: this.bulletImage,
          damage: 10,
          velocity: 10,
        });
        this.keyLockShoot = true;
      }
    } else {
      this.keyLockShoot = false;
    }
  }

  private update(deltaTime: number) {
    this.playerMovements();
    this.shootGestion();
    this.bulletMovement();
    //this.enemiesMovement();
    this.checkCollisions();
    this.gestionExplosions(deltaTime);
    if (this.enemies.length == 0) {
      this.wave += 1;
      console.log(this.wave);
      this.enemies = this.spawnWave();
    }
    if (this.wave >= 10 && this.wave < 20) this.updateScene('2');
    if (this.wave >= 20 && this.wave < 30) this.updateScene('3');
    if (this.wave >= 30 && this.wave < 40) this.updateScene('4');
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

  private bulletMovement() {
    this.bullets.forEach((b) => (b.y -= 7));

    // Remove bullets out of screen
    this.bullets = this.bullets.filter((b) => b.y > 0);

    //ENEMIES SHOOTS
    this.enemies.forEach((e) => {
      if (e.canShoot) {
        const now = Date.now();
        if (now - e.lastShotTime > e.shootCooldown) {
          this.enemyBullets.push({
            x: e.x + e.width / 2 - 2,
            y: e.y + e.height,
            width: 4,
            height: 10,
            image: this.enemyBulletImage,
            damage: 10,
            velocity: 10,
          });
          e.lastShotTime = now;
        }
      }
    });

    this.enemyBullets.forEach((b) => (b.y += 4));
  }

  private enemiesMovement() {
    this.enemies.forEach((e, j) => {
      e.y += e.speed;
      if (e.y >= this.canvas.height) {
        this.enemies.splice(j, 1);
        this.player.hp -= 20;
      }
    });
  }

  private checkCollisions() {
    this.bullets.forEach((bullet, i) => {
      this.enemies.forEach((enemy, j) => {
        if (this.isColliding(bullet, enemy)) {
          this.enemies[j].hp -= bullet.damage;
          this.bullets.splice(i, 1);
          if (this.enemies[j].hp <= 0) this.removeEnemy(enemy, j);
        }
      });
    });

    this.enemyBullets.forEach((bullet, i) => {
      if (this.isColliding(bullet, this.player)) {
        this.player.hp -= bullet.damage;
        this.enemyBullets.splice(i, 1);
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
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.transitioning && this.nextBackgroundImage) {
      this.ctx.globalAlpha = 1 - this.backgroundAlpha;
      if (this.backgroundImage) {
        this.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }

      this.ctx.globalAlpha = this.backgroundAlpha;
      this.ctx.drawImage(
        this.nextBackgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.ctx.globalAlpha = 1;

      this.backgroundAlpha += 0.02;

      if (this.backgroundAlpha >= 1) {
        this.backgroundImage = this.nextBackgroundImage!;
        this.nextBackgroundImage = undefined;
        this.transitioning = false;
        this.backgroundAlpha = 1;
      }
    } else {
      if (this.backgroundImage) {
        this.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }
    }

    this.ctx.drawImage(
      this.player.image,
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(this.player.x, this.player.y - 6, this.player.width, 4);

    this.ctx.fillStyle = 'lime';
    this.ctx.fillRect(
      this.player.x,
      this.player.y - 6,
      this.player.width * (this.player.hp / this.player.maxHp),
      4
    );

    this.explosions.forEach((e) => {
      const col = e.frame; // toutes les frames sont en ligne
      this.ctx.drawImage(
        e.sprite,
        col * e.frameWidth, // source X
        0, // source Y
        e.frameWidth, // source largeur
        e.frameHeight, // source hauteur
        e.x, // destination X
        e.y, // destination Y
        e.frameWidth, // destination largeur
        e.frameHeight // destination hauteur
      );
    });

    this.bullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    this.enemyBullets.forEach((b) =>
      this.ctx.drawImage(b.image, b.x, b.y, b.width, b.height)
    );

    this.enemies.forEach((e) => {
      this.ctx.drawImage(e.image, e.x, e.y, e.width, e.height);

      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(e.x, e.y - 6, e.width, 4);

      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(e.x, e.y - 6, e.width * (e.hp / e.maxHp), 4);
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

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
