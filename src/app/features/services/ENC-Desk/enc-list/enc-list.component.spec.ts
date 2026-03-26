import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncListComponent } from './enc-list.component';

describe('EncListComponent', () => {
  let component: EncListComponent;
  let fixture: ComponentFixture<EncListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
