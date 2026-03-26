import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeOutputComponent } from './intake-output.component';

describe('IntakeOutputComponent', () => {
  let component: IntakeOutputComponent;
  let fixture: ComponentFixture<IntakeOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntakeOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
