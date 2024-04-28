import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { QuizQuestion } from '../models/models';
import { API_BASE_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(`${API_BASE_URL}/questions`).pipe(
      map((response) => {
        if (!Array.isArray(response)) {
          throw new Error('Unexpected response format');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Network error:', error);
    return throwError(() => new Error(`Error fetching questions: ${error.message}`));
  }
}
