import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from './image.service';
import { Entity } from '../models/entity.model';
import { PlayerService } from './player.service';

export interface PowerUp extends Entity {
  id: string;
  type: 'heal' | 'speed' | 'damage' | 'shield' | 'missile';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PowerUpService {
  private powerUps: PowerUp[] = [];

  private dropChance = 0.25;
  private readonly powerUpImages: Record<PowerUp['type'], string> = {
    heal: 'assets/space/power-ups/HP_Bonus.png',
    speed: 'assets/space/power-ups/Enemy_Speed_Debuff.png',
    damage: 'assets/space/power-ups/Damage_Bonus.png',
    shield: 'assets/space/power-ups/Armor_Bonus.png',
    missile: 'assets/space/power-ups/Rockets_Bonus.png',
  };

  constructor(
    private imageService: ImageService,
    private playerService: PlayerService
  ) {}

  public trySpawnPowerUp(x: number, y: number): void {
    if (Math.random() <= this.dropChance) {
      const type = this.getRandomType();
      const newPowerUp: PowerUp = {
        id: uuidv4(),
        x,
        y,
        type: type,
        width: 32,
        height: 32,
        image: this.imageService.loadImage(this.getImageForType(type)),
      };
      this.powerUps.push(newPowerUp);
    }
  }

  public collectPowerUp(id: string): PowerUp | undefined {
    const index = this.powerUps.findIndex((p) => p.id === id);
    if (index >= 0) {
      switch (this.powerUps[index].type) {
        case 'shield':
          this.playerService.gainShield();
          break;
        case 'heal':
          this.playerService.heal(10);
          break;
        case 'missile':
          this.playerService.gainMissile();
          break;
        default:
          break;
      }

      const [collected] = this.powerUps.splice(index, 1);
      return collected;
    }
    return undefined;
  }

  private getRandomType(): PowerUp['type'] {
    const types: PowerUp['type'][] = [
      'heal',
      'speed',
      'damage',
      'shield',
      'missile',
    ];
    const index = Math.floor(Math.random() * types.length);
    return types[index];
  }

  private getImageForType(type: PowerUp['type']): string {
    return this.powerUpImages[type];
  }

  public getPowerUps(): PowerUp[] {
    return this.powerUps;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.powerUps.forEach((p) => {
      ctx.drawImage(p.image, p.x, p.y, p.width, p.height);
    });
  }
}
