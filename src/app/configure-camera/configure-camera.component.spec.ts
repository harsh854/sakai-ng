import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureCameraComponent } from './configure-camera.component';

describe('ConfigureCameraComponent', () => {
  let component: ConfigureCameraComponent;
  let fixture: ComponentFixture<ConfigureCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureCameraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
