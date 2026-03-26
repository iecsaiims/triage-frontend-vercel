import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryAssessmenComponent } from './primary-assessmen.component';

describe('PrimaryAssessmenComponent', () => {
  let component: PrimaryAssessmenComponent;
  let fixture: ComponentFixture<PrimaryAssessmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryAssessmenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryAssessmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
