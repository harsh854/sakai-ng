import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchAttendanceComponent } from './punch-attendance.component';

describe('PunchAttendanceComponent', () => {
  let component: PunchAttendanceComponent;
  let fixture: ComponentFixture<PunchAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunchAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
