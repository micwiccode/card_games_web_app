import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { HeaderComponent } from "./components/header/header.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsComponent } from "./friends/friends.component";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    RegisterPageComponent,
    LogInPageComponent,
    MyProfilePageComponent,
    FriendsComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
