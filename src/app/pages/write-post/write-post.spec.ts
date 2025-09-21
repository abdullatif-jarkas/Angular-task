import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritePost } from './write-post';

describe('WritePost', () => {
  let component: WritePost;
  let fixture: ComponentFixture<WritePost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritePost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
