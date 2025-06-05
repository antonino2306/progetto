import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordModifyPage } from './password-modify.page';

describe('PasswordModifyPage', () => {
  let component: PasswordModifyPage;
  let fixture: ComponentFixture<PasswordModifyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordModifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
