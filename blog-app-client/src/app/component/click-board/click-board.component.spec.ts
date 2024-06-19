import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickBoardComponent } from './click-board.component';

describe('ClickBoardComponent', () => {
  let component: ClickBoardComponent;
  let fixture: ComponentFixture<ClickBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
