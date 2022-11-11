import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommunityComponent } from './community.component';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should button have routerLink', () => {
    const button = fixture.nativeElement.querySelector('.community-button');
    expect(button.getAttribute('routerLink')).toBeTruthy();
  });

  it('should routerLink redirect to community page', async () => {
    const button = fixture.debugElement.query(By.css('.community-button'));
    expect(button.attributes['routerLink']).toBe('./comunidad');
  });
});
