import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectAdminComponent } from './update-project-admin.component';

describe('UpdateProjectAdminComponent', () => {
  let component: UpdateProjectAdminComponent;
  let fixture: ComponentFixture<UpdateProjectAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProjectAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProjectAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
