import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopartComponent } from './autopart.component';

describe('AutopartComponent', () => {
  let component: AutopartComponent;
  let fixture: ComponentFixture<AutopartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutopartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutopartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
