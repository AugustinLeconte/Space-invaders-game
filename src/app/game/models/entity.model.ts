import { Enemy } from './enemy.model';

export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export interface SpaceShip extends Entity {
  hp: number;
  maxHp: number;
  speed: number;
  experience: number;
  shield: number;
}

export interface Player extends SpaceShip {
  level: number;
  xp: number;
  xpToNextLevel: number;
  missiles: number;
  maxMissiles: number;
  maxShield: number;
}

export interface Bullet extends Entity {
  damage: number;
  velocity: number;
}

export interface Missile extends Bullet {
  id: string;
  speed: number;
  target: Enemy;
  radius: number;
  angle: number;
}
