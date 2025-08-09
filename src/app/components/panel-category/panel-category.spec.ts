import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelCategory } from './panel-category';

describe('PanelCategory', () => {
  let component: PanelCategory;
  let fixture: ComponentFixture<PanelCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
