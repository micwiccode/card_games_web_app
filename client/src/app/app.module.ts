import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
//Components
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { HeaderComponent } from "./components/header/header.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { LogInPageComponent } from "./log-in-page/log-in-page.component";
import { MyProfilePageComponent } from "./my-profile-page/my-profile-page.component";
import { FriendsPageComponent } from "./friends-page/friends-page.component";
import { CreateGamePageComponent } from "./create-game-page/create-game-page.component";
import { GamePageComponent } from "./game-page/game-page.component";
import { PlayerPanelComponent } from "./game-page/player-panel/player-panel.component";
import { CardTableComponent } from "./game-page/card-table/card-table.component";
import { OpponentPanelComponent } from "./game-page/opponent-panel/opponent-panel.component";
import { Page404Component } from "./page404/page404.component";
import { RoomsPageComponent } from "./rooms-page/rooms-page.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingSpinnerGameComponent } from "./components/loading-spinner-game/loading-spinner-game.component";
import { DemandViewComponent } from "./game-page/demand-view/demand-view.component";
//Services
import { AuthGuardService } from "./services/auth-guard.service";
import { ValidateService } from "./services/validate.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { RoomsService } from "./services/rooms.service";
import { FriendsService } from "./services/friends.service";
import { ScoreBoardComponent } from "./game-page/score-board/score-board.component";
import { SseService } from "./services/sse-service.service";

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
    GamePageComponent,
    Page404Component,
    PlayerPanelComponent,
    CardTableComponent,
    OpponentPanelComponent,
    ScoreBoardComponent,
    RoomsPageComponent,
    LoadingSpinnerGameComponent,
    LoadingSpinnerComponent,
    DemandViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthGuardService,
    ValidateService,
    UserService,
    AuthService,
    RoomsService,
    FriendsService,
    SseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
