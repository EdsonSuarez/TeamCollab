import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoardAdminComponent } from './list-board-admin.component';

describe('ListBoardAdminComponent', () => {
  let component: ListBoardAdminComponent;
  let fixture: ComponentFixture<ListBoardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBoardAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBoardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
