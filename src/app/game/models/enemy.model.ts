import { SpaceShip } from './entity.model';

export interface Enemy extends SpaceShip {
  type: string;
  canShoot: boolean;
  shootCooldown: number;
  lastShotTime: number;
}

export const enemyTypes = [
  {
    type: 'basic',
    image: 'assets/space/enemy1-1.png',
    hp: 10,
    speed: 2,
    canShoot: false,
  },
  {
    type: 'shooter',
    image: 'assets/space/enemy1-2.png',
    hp: 20,
    speed: 0.8,
    canShoot: true,
  },
  {
    type: 'fast',
    image: 'assets/space/enemy1-3.png',
    hp: 5,
    speed: 7,
    canShoot: true,
  },
  {
    type: 'fast',
    image: 'assets/space/enemy1-4.png',
    hp: 40,
    speed: 2,
    canShoot: false,
  },
  {
    type: 'fast',
    image: 'assets/space/enemy1-5.png',
    hp: 10,
    speed: 5,
    canShoot: false,
  },
];
