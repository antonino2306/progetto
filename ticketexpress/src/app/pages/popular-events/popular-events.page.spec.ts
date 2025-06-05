import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularEventsPage } from './popular-events.page';

describe('PopularEventsPage', () => {
  let component: PopularEventsPage;
  let fixture: ComponentFixture<PopularEventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
