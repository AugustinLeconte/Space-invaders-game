import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUpsComponent } from './power-ups.component';

describe('PowerUpsComponent', () => {
  let component: PowerUpsComponent;
  let fixture: ComponentFixture<PowerUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerUpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
