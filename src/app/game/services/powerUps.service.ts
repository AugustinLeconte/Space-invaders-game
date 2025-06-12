import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from './image.service';

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  image: HTMLImageElement;
  type: 'heal' | 'speed' | 'damage' | 'shield' | 'missile';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PowerUpService {
  private powerUps: PowerUp[] = [];
  private powerUpsSubject = new BehaviorSubject<PowerUp[]>([]);
  public powerUps$ = this.powerUpsSubject.asObservable();

  private dropChance = 0.2;
  private readonly powerUpImages: Record<PowerUp['type'], string> = {
    heal: 'assets/space/power-ups/HP_Bonus.png',
    speed: 'assets/space/power-ups/Enemy_Speed_Debuff.png',
    damage: 'assets/space/power-ups/Damage_Bonus.png',
    shield: 'assets/space/power-ups/Armor_Bonus.png',
    missile: 'assets/space/power-ups/Rockets_Bonus.png',
  };

  constructor(private imageService: ImageService) {}

  public trySpawnPowerUp(x: number, y: number): void {
    if (Math.random() <= this.dropChance) {
      const type = this.getRandomType();
      const newPowerUp: PowerUp = {
        id: uuidv4(),
        x,
        y,
        type: type,
        image: this.imageService.loadImage(this.getImageForType(type)),
      };
      this.powerUps.push(newPowerUp);
      this.emit();
    }
  }

  public collectPowerUp(id: string): PowerUp | undefined {
    const index = this.powerUps.findIndex((p) => p.id === id);
    if (index >= 0) {
      const [collected] = this.powerUps.splice(index, 1);
      this.emit();
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

  private emit() {
    this.powerUpsSubject.next([...this.powerUps]);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.powerUps.forEach((p) => {
      ctx.drawImage(p.image, p.x, p.y, 64, 64);
    });
  }
}
