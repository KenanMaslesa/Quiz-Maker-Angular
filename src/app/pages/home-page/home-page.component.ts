import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizService } from '../../services/quiz.service';
import { MatCardModule } from '@angular/material/card';
import { Quiz } from '../../models/models';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
  ],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private quizService = inject(QuizService);
  private snackBar = inject(MatSnackBar);
  public router = inject(Router);
  public displayedColumns: string[] = ['name', 'questions', 'actions'];
  public dataSource = new MatTableDataSource<Quiz>([]);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchQuizzes(): void {
    this.quizService
      .getQuizzes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (quizzes) => {
          this.dataSource.data = quizzes;
        },
        (error) => {
          console.error('Error fetching quizzes:', error);
          this.snackBar.open('Error fetching quizzes.', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  handleRowClick(quizId: number): void {
    this.router.navigate(['/edit-quiz', quizId]);
  }

  deleteQuiz(quizId: number, event: MouseEvent): void {
    event.stopPropagation(); // prevent row click navigation
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService
        .deleteQuiz(quizId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.dataSource.data = this.dataSource.data.filter(
              (quiz) => quiz.id !== quizId
            );
            this.snackBar.open('Quiz deleted successfully.', 'Close', {
              duration: 3000,
            });
          },
          (error) => {
            console.error('Error deleting quiz:', error);
            this.snackBar.open('Error deleting quiz.', 'Close', {
              duration: 3000,
            });
          }
        );
    }
  }
}
