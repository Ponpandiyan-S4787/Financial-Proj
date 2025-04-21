import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      { 
        path: 'investment-form',
        // component: InvestmentFormComponent
        loadComponent: () => import('./features/investment-form/investment-form.component').then(m => m.InvestmentFormComponent)
      },
      {
        path:'welcome',component:WelcomeComponent
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];
