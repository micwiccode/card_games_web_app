import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerGameComponent } from './loading-spinner-game.component';

describe('LoadingSpinnerGameComponent', () => {
  let component: LoadingSpinnerGameComponent;
  let fixture: ComponentFixture<LoadingSpinnerGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingSpinnerGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
