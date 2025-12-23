import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAvisoOneComponent } from './data-aviso-one.component';

describe('DataAvisoOneComponent', () => {
  let component: DataAvisoOneComponent;
  let fixture: ComponentFixture<DataAvisoOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAvisoOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataAvisoOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
