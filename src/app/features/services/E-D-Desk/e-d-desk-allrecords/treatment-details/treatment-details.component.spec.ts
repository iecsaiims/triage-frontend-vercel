import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDetailsComponent } from './treatment-details.component';

describe('TreatmentDetailsComponent', () => {
  let component: TreatmentDetailsComponent;
  let fixture: ComponentFixture<TreatmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
