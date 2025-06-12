import { Injectable } from '@angular/core';
import { backgrounds } from '../constants/backgrounds.const';

@Injectable({ providedIn: 'root' })
export class BackgroundService {
  private backgroundImage!: HTMLImageElement;
  private nextBackgroundImage?: HTMLImageElement;
  private backgroundAlpha = 1;
  private transitioning = false;
  private currentBackground: string = 'stage1';

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

  changeBackgroundFromWave(waveNumber: number) {
    if (waveNumber >= 10 && waveNumber < 20) this.updateScene('2');
    if (waveNumber >= 20 && waveNumber < 30) this.updateScene('3');
    if (waveNumber >= 30 && waveNumber < 40) this.updateScene('4');
  }

  public draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (this.transitioning && this.nextBackgroundImage) {
      ctx.globalAlpha = 1 - this.backgroundAlpha;
      if (this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
      }

      ctx.globalAlpha = this.backgroundAlpha;
      ctx.drawImage(
        this.nextBackgroundImage,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.globalAlpha = 1;

      this.backgroundAlpha += 0.02;

      if (this.backgroundAlpha >= 1) {
        this.backgroundImage = this.nextBackgroundImage!;
        this.nextBackgroundImage = undefined;
        this.transitioning = false;
        this.backgroundAlpha = 1;
      }
    } else {
      if (this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
      }
    }
  }
}
