import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeComponent } from './discharge.component';

describe('DischargeComponent', () => {
  let component: DischargeComponent;
  let fixture: ComponentFixture<DischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DischargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
