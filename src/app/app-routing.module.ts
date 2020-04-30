import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterPageComponent} from "./register-page/register-page.component";
import {LogInPageComponent} from "./log-in-page/log-in-page.component";


const appRoutes: Routes = [
  // { path: 'game', component: GameComponent },
  { path: 'login', component: LogInPageComponent },
  { path: 'register', component: RegisterPageComponent },
  // { path: 'profile', component: MyProfilePageComponent, canActivate:[AuthGuardService]},
  // { path: 'friends', component: MyFriendsComponent, canActivate:[AuthGuardService] },
  // { path: 'statistics', component: MyProfileStatisticsComponent, canActivate:[AuthGuardService] },
  // { path: 'createGame', component: CreateGamePageComponent},
  // { path: 'playWithFriends', component: PlayFriendsPageComponent, canActivate:[AuthGuardService]},
  { path: '', component: MainPageComponent },
  // { path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

