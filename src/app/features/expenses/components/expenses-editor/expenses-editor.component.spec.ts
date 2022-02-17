import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesEditorComponent } from './expenses-editor.component';

describe('ExpensesEditorComponent', () => {
  let component: ExpensesEditorComponent;
  let fixture: ComponentFixture<ExpensesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
