import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignModelsComponent } from './assign-models.component';

describe('AssignModelsComponent', () => {
  let component: AssignModelsComponent;
  let fixture: ComponentFixture<AssignModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
