import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProjectAdminComponent } from './list-project-admin.component';

describe('ListProjectAdminComponent', () => {
  let component: ListProjectAdminComponent;
  let fixture: ComponentFixture<ListProjectAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProjectAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProjectAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
