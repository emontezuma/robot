import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FijarequiComponent } from './fijarequi.component';

describe('FijarequiComponent', () => {
  let component: FijarequiComponent;
  let fixture: ComponentFixture<FijarequiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FijarequiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FijarequiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
