import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDConsultationRecordComponent } from './ed-consultation-record.component';

describe('EDConsultationRecordComponent', () => {
  let component: EDConsultationRecordComponent;
  let fixture: ComponentFixture<EDConsultationRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDConsultationRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EDConsultationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
