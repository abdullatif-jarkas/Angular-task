import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAuthors } from './top-authors';

describe('TopAuthors', () => {
  let component: TopAuthors;
  let fixture: ComponentFixture<TopAuthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAuthors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopAuthors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
