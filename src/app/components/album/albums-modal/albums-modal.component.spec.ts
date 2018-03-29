import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsModalComponent } from './albums-modal.component';

describe('AlbumsModalComponent', () => {
  let component: AlbumsModalComponent;
  let fixture: ComponentFixture<AlbumsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
