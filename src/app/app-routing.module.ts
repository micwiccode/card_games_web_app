import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainPageComponent } from "./main-page/main-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsComponent } from "./friends/friends.component";

const appRoutes: Routes = [
  // { path: 'game', component: GameComponent },
  { path: "login", component: LogInPageComponent },
  { path: "register", component: RegisterPageComponent },
  { path: "profile", component: MyProfilePageComponent },
  { path: "friends", component: FriendsComponent },
  // { path: 'createGame', component: CreateGamePageComponent},
  // { path: 'playWithFriends', component: PlayFriendsPageComponent, canActivate:[AuthGuardService]},
  { path: "", component: MainPageComponent }
  // { path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
