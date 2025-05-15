import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropperFunctionsComponent } from './cropper-functions.component';

describe('CropperFunctionsComponent', () => {
  let component: CropperFunctionsComponent;
  let fixture: ComponentFixture<CropperFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropperFunctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropperFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
