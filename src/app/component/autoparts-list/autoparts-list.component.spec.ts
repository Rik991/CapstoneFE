import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopartsListComponent } from './autoparts-list.component';

describe('AutopartsListComponent', () => {
  let component: AutopartsListComponent;
  let fixture: ComponentFixture<AutopartsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutopartsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutopartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
