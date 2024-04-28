import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../utils/constants';
import { Quiz } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<Quiz[]> {
    return this.http
      .get<Quiz[]>(`${this.baseUrl}/quizzes`)
      .pipe(catchError(this.handleError));
  }

  deleteQuiz(quizId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/quizzes/${quizId}`)
      .pipe(catchError(this.handleError));
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.http
      .get<Quiz>(`${this.baseUrl}/quizzes/${quizId}`)
      .pipe(catchError(this.handleError));
  }

  createQuiz(quiz: Quiz): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/quizzes`, quiz, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }

  updateQuiz(quiz: Quiz, quizId: string): Observable<void> {
    return this.http
      .put<void>(`${this.baseUrl}/quizzes/${quizId}`, quiz, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(() => new Error(`An error occurred: ${error.message}`));
  }
}
