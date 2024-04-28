import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizQuestion, Quiz } from '../../models/models';
import { QuestionService } from '../../services/question.service';
import { QuizService } from '../../services/quiz.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';

enum TabValues {
  NewQuestion,
  ExistingQuestions,
}

@Component({
  selector: 'app-create-edit-quiz-page',
  templateUrl: './create-edit-quiz-page.component.html',
  styleUrls: ['./create-edit-quiz-page.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class CreateEditQuizPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private questionService = inject(QuestionService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  public quizId?: string | undefined | null;
  public quizName: string = '';
  public currentQuestion: string = '';
  public currentAnswer: string = '';
  public quizQuestions = signal<QuizQuestion[]>([]);
  public allQuestions = signal<QuizQuestion[]>([]);
  public selectedQuestions = signal<QuizQuestion[]>([]);
  public unselectedQuestions = computed<QuizQuestion[]>(() => this.allQuestions().filter(
    (q) => !this.quizQuestions().some((sq) => sq.id === q.id)
  ));
  public readonly tabs: TabValues[] = [
    TabValues.NewQuestion,
    TabValues.ExistingQuestions,
  ];
  public activeTab = TabValues.NewQuestion;
  public fetchedExistingQuestions = false;

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId');

    if (this.quizId) {
      this.quizService
        .getQuizById(this.quizId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (quiz: Quiz) => {
            this.quizName = quiz.name;
            this.quizQuestions.set(quiz.questions);
          },
          (error) => {
            this.snackBar.open('Error fetching quiz data.', 'Close', {
              duration: 3000,
            });
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

  handleTabChange(tabValue: TabValues): void {
    this.activeTab = tabValue;

    if (
      this.activeTab === TabValues.ExistingQuestions &&
      !this.fetchedExistingQuestions
    ) {
      this.questionService
        .getQuestions()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (questions) => {
            this.allQuestions.set(questions);
            this.fetchedExistingQuestions = true;
          },
          (error) => {
            this.snackBar.open('Error fetching existing questions.', 'Close', {
              duration: 3000,
            });
          }
        );
    }
  }

  addNewQuestion(): void {
    if (this.currentQuestion && this.currentAnswer) {
      const newQuestion: QuizQuestion = {
        id: Date.now(),
        question: this.currentQuestion,
        answer: this.currentAnswer,
      };

      this.quizQuestions.set([...this.quizQuestions(), newQuestion]);
      this.currentQuestion = '';
      this.currentAnswer = '';
    }
  }

  addSelectedQuestions(): void {
    this.quizQuestions.set([...this.quizQuestions(), ...this.selectedQuestions()]);
    this.selectedQuestions.set([]);
  }

  submitQuiz(): void {
    const newQuiz: Quiz = {
      id: Date.now(),
      name: this.quizName,
      questions: this.quizQuestions(),
    };

    if (this.quizId) {
      this.quizService
        .updateQuiz(newQuiz, this.quizId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (error) => {
            this.snackBar.open('Error updating quiz.', 'Close', {
              duration: 3000,
            });
          }
        );
    } else {
      this.quizService
        .createQuiz(newQuiz)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (error) => {
            this.snackBar.open('Error creating quiz.', 'Close', {
              duration: 3000,
            });
          }
        );
    }
  }

  removeQuestion(quizQuestion: QuizQuestion): void {
    this.quizQuestions.set(this.quizQuestions().filter(
      (q) => q.id !== quizQuestion.id
    ));
  }
}
