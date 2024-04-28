import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { QuizPageComponent } from './pages/quiz-page/quiz-page.component';
import { CreateEditQuizPageComponent } from './pages/create-edit-quiz-page/create-edit-quiz-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'quiz/:quizId', component: QuizPageComponent },
  { path: 'create-quiz', component: CreateEditQuizPageComponent },
  { path: 'edit-quiz/:quizId', component: CreateEditQuizPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect unknown paths to home
];
