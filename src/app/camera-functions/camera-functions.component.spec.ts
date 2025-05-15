import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraFunctionsComponent } from './camera-functions.component';

describe('CameraFunctionsComponent', () => {
  let component: CameraFunctionsComponent;
  let fixture: ComponentFixture<CameraFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraFunctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
