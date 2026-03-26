import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ENCDeskComponent } from './enc-desk.component';

describe('ENCDeskComponent', () => {
  let component: ENCDeskComponent;
  let fixture: ComponentFixture<ENCDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ENCDeskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ENCDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
