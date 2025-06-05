import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminiPage } from './termini.page';

describe('TerminiPage', () => {
  let component: TerminiPage;
  let fixture: ComponentFixture<TerminiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
