import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddedComponent } from './patient-added.component';

describe('PatientAddedComponent', () => {
  let component: PatientAddedComponent;
  let fixture: ComponentFixture<PatientAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAddedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
