import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDeskComponent } from './registration-desk.component';

describe('RegistrationDeskComponent', () => {
  let component: RegistrationDeskComponent;
  let fixture: ComponentFixture<RegistrationDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationDeskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
