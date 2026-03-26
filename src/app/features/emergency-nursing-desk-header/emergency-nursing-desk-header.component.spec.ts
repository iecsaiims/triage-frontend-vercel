import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyNursingDeskHeaderComponent } from './emergency-nursing-desk-header.component';

describe('EmergencyNursingDeskHeaderComponent', () => {
  let component: EmergencyNursingDeskHeaderComponent;
  let fixture: ComponentFixture<EmergencyNursingDeskHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyNursingDeskHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyNursingDeskHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
