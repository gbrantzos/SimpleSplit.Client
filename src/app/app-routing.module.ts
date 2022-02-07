import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@core/components/login/login.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Lazy loading
  {
    path: '', component: MainLayoutComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        data: {
          description: 'Αρχική'
        }
      },
      {
        path: 'expenses',
        loadChildren: () => import('./features/expenses/expenses.module').then(m => m.ExpensesModule),
        data: {
          description: 'Εξοδα'
        }
      }
    ]
  },


  // otherwise redirect to home
  { path: '**', redirectTo: '/home' } // TODO Add page 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
