import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxPreviewComponent } from './mapbox-preview.component';

describe('MapboxPreviewComponent', () => {
  let component: MapboxPreviewComponent;
  let fixture: ComponentFixture<MapboxPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapboxPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
