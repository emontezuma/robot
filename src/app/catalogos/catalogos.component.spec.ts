import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogosComponent } from './catalogos.component';

describe('CatalogosComponent', () => {
  let component: CatalogosComponent;
  let fixture: ComponentFixture<CatalogosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
