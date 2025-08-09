import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProduct } from './panel-product';

describe('PanelProduct', () => {
  let component: PanelProduct;
  let fixture: ComponentFixture<PanelProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
