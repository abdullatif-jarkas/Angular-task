import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPosts } from './recent-posts';

describe('RecentPosts', () => {
  let component: RecentPosts;
  let fixture: ComponentFixture<RecentPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
