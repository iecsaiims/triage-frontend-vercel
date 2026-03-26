import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincontenarComponent } from './maincontenar.component';

describe('MaincontenarComponent', () => {
  let component: MaincontenarComponent;
  let fixture: ComponentFixture<MaincontenarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaincontenarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaincontenarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
