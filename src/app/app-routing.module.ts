import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainPageComponent } from "./main-page/main-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsPageComponent } from "./friends-page/friends-page.component";
import { CreateGamePageComponent } from "./create-game-page/create-game-page.component";
import { Page404Component } from "./page404/page404.component";

const appRoutes: Routes = [
  { path: "login", component: LogInPageComponent },
  { path: "register", component: RegisterPageComponent },
  { path: "profile", component: MyProfilePageComponent },
  { path: "friends", component: FriendsPageComponent },
  { path: "createGame", component: CreateGamePageComponent },
  { path: "", component: MainPageComponent },
  { path: "**", component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
