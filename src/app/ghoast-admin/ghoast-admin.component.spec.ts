import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhoastAdminComponent } from './ghoast-admin.component';

describe('GhoastAdminComponent', () => {
  let component: GhoastAdminComponent;
  let fixture: ComponentFixture<GhoastAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhoastAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhoastAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
