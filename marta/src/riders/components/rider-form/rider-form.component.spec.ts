import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderFormComponent } from './rider-form.component';

describe('RiderFormComponent', () => {
  let component: RiderFormComponent;
  let fixture: ComponentFixture<RiderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
