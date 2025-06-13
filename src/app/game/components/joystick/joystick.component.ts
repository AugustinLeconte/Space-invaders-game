import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import nipplejs from 'nipplejs';
import { KeysService } from '../../services/keys.service';

@Component({
  selector: 'app-joystick',
  imports: [CommonModule],
  templateUrl: './joystick.component.html',
  styleUrl: './joystick.component.scss',
})
export class JoystickComponent {
  @ViewChild('joystickContainer', { static: false })
  joystickContainer!: ElementRef;
  isMobile = false;
  private joystickInterval: any = null;
  private joystickDirection: string | null = null;

  constructor(private keysService: KeysService) {}

  ngOnInit() {
    const ua = navigator.userAgent;
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  }

  ngAfterViewInit() {
    if (this.isMobile) {
      const joystick = nipplejs.create({
        zone: this.joystickContainer.nativeElement,
        mode: 'static',
        position: { left: '60px', bottom: '60px' },
        color: 'blue',
      });

      joystick.on('start', () => {
        this.joystickInterval = setInterval(() => {
          if (this.joystickDirection) {
            this.keysService.movePlayerByJoystick(this.joystickDirection);
          }
        }, 40);
      });

      joystick.on('move', (evt, data) => {
        const angle = data.angle?.degree;
        if (!angle) return;

        if (angle >= 45 && angle < 135) this.joystickDirection = 'up';
        else if (angle >= 135 && angle < 225) this.joystickDirection = 'left';
        else if (angle >= 225 && angle < 315) this.joystickDirection = 'down';
        else this.joystickDirection = 'right';
      });

      joystick.on('end', () => {
        clearInterval(this.joystickInterval);
        this.joystickInterval = null;
        this.joystickDirection = null;
      });
    }
  }
}
