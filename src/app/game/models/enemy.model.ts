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
    speed: 0.9,
    canShoot: false,
    experience: 10,
  },
  {
    type: 'shooter',
    image: 'assets/space/enemy1-2.png',
    hp: 20,
    speed: 0.8,
    canShoot: true,
    experience: 10,
  },
  {
    type: 'fast',
    image: 'assets/space/enemy1-3.png',
    hp: 5,
    speed: 2,
    canShoot: false,
    experience: 15,
  },
  {
    type: 'tank',
    image: 'assets/space/enemy1-4.png',
    hp: 80,
    speed: 0.5,
    canShoot: false,
    experience: 20,
  },
  {
    type: 'hybrid',
    image: 'assets/space/enemy1-5.png',
    hp: 40,
    speed: 0.7,
    experience: 20,
    canShoot: true,
  },
];
