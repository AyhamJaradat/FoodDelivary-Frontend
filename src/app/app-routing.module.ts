import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // default landing route 
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./auth/signup/signup.module").then((m) => m.SignupPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./auth/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "people",
    loadChildren: () =>
      import("./pages/people/people.module").then((m) => m.PeoplePageModule),
    canActivate: [AuthGuard],
  },


  {
    path: "request-password-reset",
    loadChildren: () =>
      import(
        "./auth/request-password-reset/request-password-reset.module"
      ).then((m) => m.RequestPasswordResetPageModule),
  },
  {
    path: "reset-password",
    loadChildren: () =>
      import("./auth/reset-password/reset-password.module").then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'restaurant',
    loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'meals-list',
    loadChildren: () => import('./pages/meals-list/meals-list.module').then( m => m.MealsListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: "meals-list/:id",
    loadChildren: () =>
      import("./pages/meals-list/meals-list.module").then((m) => m.MealsListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'order-details/:id',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders-list',
    loadChildren: () => import('./pages/orders-list/orders-list.module').then( m => m.OrdersListPageModule),
    canActivate: [AuthGuard],
  },


  // {
  //   path: 'create-meal-modal',
  //   loadChildren: () => import('./modals/create-meal-modal/create-meal-modal.module').then( m => m.CreateMealModalPageModule)
  // },

  // {
  //   path: 'create-restaurant-modal',
  //   loadChildren: () => import('./modals/create-restaurant-modal/create-restaurant-modal.module').then( m => m.CreateRestaurantModalPageModule)
  // },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
