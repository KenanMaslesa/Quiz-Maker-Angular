import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditQuizPageComponent } from './create-edit-quiz-page.component';

describe('CreateEditQuizPageComponent', () => {
  let component: CreateEditQuizPageComponent;
  let fixture: ComponentFixture<CreateEditQuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditQuizPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditQuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
