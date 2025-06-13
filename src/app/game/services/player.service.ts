import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bullet, Player } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private player = new BehaviorSubject<Player>({} as Player);
  player$ = this.player.asObservable();

  public initPlayer(player: Player): void {
    this.player.next({ ...player });
  }

  public getPlayer(): Player {
    return this.player.value;
  }

  private updatePlayer(updateFn: (p: Player) => Player): void {
    const updated = updateFn({ ...this.player.value });
    this.player.next(updated);
  }

  public increaseMaxHp(amount: number): void {
    this.updatePlayer((p) => ({ ...p, maxHp: p.maxHp + amount }));
  }

  public increaseXp(xp: number): void {
    this.updatePlayer((p) => ({ ...p, xp: p.xp + xp }));
  }

  public setXp(newXp: number): void {
    this.updatePlayer((p) => ({ ...p, xp: newXp }));
  }

  public increaseLevel(by: number): void {
    this.updatePlayer((p) => ({ ...p, level: p.level + by }));
  }

  public setXpToNextLevel(newXpToNextLevel: number): void {
    this.updatePlayer((p) => ({ ...p, xpToNextLevel: newXpToNextLevel }));
  }

  public setPlayerPositionX(pos: number): void {
    this.updatePlayer((p) => ({ ...p, x: p.x + pos }));
  }

  public setPlayerPositionY(pos: number): void {
    this.updatePlayer((p) => ({ ...p, y: p.y + pos }));
  }

  private loseShield(): void {
    this.updatePlayer((p) => ({ ...p, shield: (p.shield -= 1) }));
    if (this.player.value.shield < 0)
      this.updatePlayer((p) => ({ ...p, shield: 0 }));
  }

  public gainShield(): void {
    if (this.player.value.shield + 1 <= this.player.value.maxShield)
      this.updatePlayer((p) => ({ ...p, shield: (p.shield += 1) }));
  }

  public gainMissile(): void {
    if (this.player.value.missiles + 1 <= this.player.value.maxMissiles)
      this.updatePlayer((p) => ({ ...p, missiles: (p.missiles += 1) }));
  }

  public launchMissile(): void {
    this.updatePlayer((p) => ({ ...p, missiles: (p.missiles -= 1) }));
  }

  public missileNumber(): number {
    return this.player.value.missiles;
  }

  public heal(heal: number): void {
    this.updatePlayer((p) => ({ ...p, hp: p.hp + heal }));
    if (this.player.value.hp > this.player.value.maxHp)
      this.updatePlayer((p) => ({ ...p, hp: p.maxHp }));
  }

  public isHitted(damage: number): void {
    if (this.player.value.shield > 0) this.loseShield();
    else this.updatePlayer((p) => ({ ...p, hp: p.hp - damage }));
    if (this.player.value.hp < 0) this.updatePlayer((p) => ({ ...p, hp: 0 }));
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.player.value.image,
      this.player.value.x,
      this.player.value.y,
      this.player.value.width,
      this.player.value.height
    );

    ctx.fillStyle = 'black';
    ctx.fillRect(
      this.player.value.x,
      this.player.value.y - 6,
      this.player.value.width,
      4
    );

    ctx.fillStyle = 'lime';
    ctx.fillRect(
      this.player.value.x,
      this.player.value.y - 6,
      this.player.value.width *
        (this.player.value.hp / this.player.value.maxHp),
      4
    );
  }
}
