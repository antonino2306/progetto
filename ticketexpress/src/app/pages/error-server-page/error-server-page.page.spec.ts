import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorServerPagePage } from './error-server-page.page';

describe('ErrorServerPagePage', () => {
  let component: ErrorServerPagePage;
  let fixture: ComponentFixture<ErrorServerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorServerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
