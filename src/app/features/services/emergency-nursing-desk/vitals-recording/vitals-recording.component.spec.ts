import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsRecordingComponent } from './vitals-recording.component';

describe('VitalsRecordingComponent', () => {
  let component: VitalsRecordingComponent;
  let fixture: ComponentFixture<VitalsRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsRecordingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
