import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPopup } from './post-popup';

describe('PostPopup', () => {
  let component: PostPopup;
  let fixture: ComponentFixture<PostPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
