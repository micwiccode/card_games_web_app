import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
//Components
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { HeaderComponent } from "./components/header/header.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsPageComponent } from "./friends-page/friends-page.component";
import { CreateGamePageComponent } from "./create-game-page/create-game-page.component";
import { Page404Component } from "./page404/page404.component";
//Services
import {AuthGuardService} from "./services/auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    RegisterPageComponent,
    LogInPageComponent,
    MyProfilePageComponent,
    FriendsPageComponent,
    CreateGamePageComponent,
    Page404Component
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}