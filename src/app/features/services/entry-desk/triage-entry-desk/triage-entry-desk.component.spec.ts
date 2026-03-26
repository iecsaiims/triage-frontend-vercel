import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageEntryDeskComponent } from './triage-entry-desk.component';

describe('TriageEntryDeskComponent', () => {
  let component: TriageEntryDeskComponent;
  let fixture: ComponentFixture<TriageEntryDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriageEntryDeskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriageEntryDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
