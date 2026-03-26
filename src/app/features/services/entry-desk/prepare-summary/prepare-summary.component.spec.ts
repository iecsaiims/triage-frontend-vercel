import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareSummaryComponent } from './prepare-summary.component';

describe('PrepareSummaryComponent', () => {
  let component: PrepareSummaryComponent;
  let fixture: ComponentFixture<PrepareSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepareSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
