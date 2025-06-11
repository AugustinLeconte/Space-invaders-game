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
}

export interface Player extends SpaceShip {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Bullet extends Entity {
  damage: number;
  velocity: number;
}
