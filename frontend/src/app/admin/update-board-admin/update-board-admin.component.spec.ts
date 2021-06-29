import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBoardAdminComponent } from './update-board-admin.component';

describe('UpdateBoardAdminComponent', () => {
  let component: UpdateBoardAdminComponent;
  let fixture: ComponentFixture<UpdateBoardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBoardAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBoardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
