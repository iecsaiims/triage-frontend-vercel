import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingSummaryComponent } from './nursing-summary.component';

describe('NursingSummaryComponent', () => {
  let component: NursingSummaryComponent;
  let fixture: ComponentFixture<NursingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NursingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NursingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
