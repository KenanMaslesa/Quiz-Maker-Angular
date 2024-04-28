import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quiz, QuizQuestion } from '../../models/models';
import { QuizService } from '../../services/quiz.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [MatIconModule, MatCardModule],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss',
})
export class QuizPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);

  public quizDetails: Quiz | undefined;
  public currentQuestionIndex: number = 0;
  public showAnswer: boolean = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('quizId');

    if (quizId) {
      this.quizService
        .getQuizById(quizId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (quiz: Quiz) => {
            this.quizDetails = quiz;
          },
          (error) => {
            console.error('Error fetching quiz:', error);
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleNext(): void {
    if (
      this.quizDetails &&
      this.currentQuestionIndex < this.quizDetails.questions.length - 1
    ) {
      this.currentQuestionIndex++;
      this.showAnswer = false;
    }
  }

  handlePrevious(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false;
    }
  }

  handleShowAnswer(): void {
    this.showAnswer = true;
  }

  get currentQuestion(): QuizQuestion {
    return this.quizDetails!.questions[this.currentQuestionIndex];
  }
}
