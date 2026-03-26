import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationOrderComponent } from './investigation-order.component';

describe('InvestigationOrderComponent', () => {
  let component: InvestigationOrderComponent;
  let fixture: ComponentFixture<InvestigationOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigationOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigationOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
