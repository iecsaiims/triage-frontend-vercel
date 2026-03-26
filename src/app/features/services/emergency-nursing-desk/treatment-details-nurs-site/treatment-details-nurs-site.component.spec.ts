import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDetailsNursSiteComponent } from './treatment-details-nurs-site.component';

describe('TreatmentDetailsNursSiteComponent', () => {
  let component: TreatmentDetailsNursSiteComponent;
  let fixture: ComponentFixture<TreatmentDetailsNursSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentDetailsNursSiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentDetailsNursSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
