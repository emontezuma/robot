import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoswipComponent } from './catalogoswip.component';

describe('CatalogoswipComponent', () => {
  let component: CatalogoswipComponent;
  let fixture: ComponentFixture<CatalogoswipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoswipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoswipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
