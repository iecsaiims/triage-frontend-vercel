import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfCareTestComponent } from './point-of-care-test.component';

describe('PointOfCareTestComponent', () => {
  let component: PointOfCareTestComponent;
  let fixture: ComponentFixture<PointOfCareTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointOfCareTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointOfCareTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
