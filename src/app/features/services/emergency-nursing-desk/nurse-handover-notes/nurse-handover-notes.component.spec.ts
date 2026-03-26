import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseHandoverNotesComponent } from './nurse-handover-notes.component';

describe('NurseHandoverNotesComponent', () => {
  let component: NurseHandoverNotesComponent;
  let fixture: ComponentFixture<NurseHandoverNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseHandoverNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseHandoverNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
