import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainPageComponent } from "./main-page/main-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsPageComponent } from "./friends-page/friends-page.component";
import { CreateGamePageComponent } from "./create-game-page/create-game-page.component";
import { GamePageComponent } from './game-page/game-page.component';
import { Page404Component } from "./page404/page404.component";
import {AuthGuardService} from "./services/auth-guard.service";

const appRoutes: Routes = [
  { path: "login", component: LogInPageComponent },
  { path: "register", component: RegisterPageComponent },
  { path: "profile", component: MyProfilePageComponent, /*canActivate:[AuthGuardService]*/ },
  { path: "friends", component: FriendsPageComponent, /*canActivate:[AuthGuardService]*/ },
  { path: "createGame", component: CreateGamePageComponent,/* canActivate:[AuthGuardService]*/ },
  { path: "game", component: GamePageComponent,/* canActivate:[AuthGuardService]*/ },
  { path: "", component: MainPageComponent},
  { path: "**", component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
