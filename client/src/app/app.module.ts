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
import { MacaoPlayerPanelComponent } from "./game-page/macao-game/macao-player-panel/macao-player-panel.component";
import { MacaoOpponentPanelComponent } from "./game-page/macao-game/macao-opponent-panel/macao-opponent-panel.component";
import { Page404Component } from "./page404/page404.component";
import { RoomsPageComponent } from "./rooms-page/rooms-page.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { LoadingSpinnerGameComponent } from "./components/loading-spinner-game/loading-spinner-game.component";
import {
  MacaoDemandViewComponent,
} from "./game-page/macao-game/macao-demand-view/macao-demand-view.component";

//Services
import { AuthGuardService } from "./services/auth-guard.service";
import { ValidateService } from "./services/validate.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { RoomsService } from "./services/rooms.service";
import { FriendsService } from "./services/friends.service";
import { ScoreBoardComponent } from "./game-page/score-board/score-board.component";
import { SseService } from "./services/sse-service.service";
import {PanPlayerPanelComponent} from "./game-page/pan-game/pan-player-panel/pan-player-panel.component";
import {PanCardTableComponent} from "./game-page/pan-game/pan-card-table/pan-card-table.component";
import {MacaoGameService} from "./services/macao-game.service";
import {PanGameService} from "./services/pan-game.service";
import {MacaoCardTableComponent} from "./game-page/macao-game/macao-card-table/macao-card-table.component";
import {PanOpponentPanelComponent} from "./game-page/pan-game/pan-opponent-panel/pan-opponent-panel.component";
import {ChatComponent} from "./components/chat/chat.component";
import {ChatService} from "./services/chat.service";

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
    MacaoOpponentPanelComponent,
    ScoreBoardComponent,
    RoomsPageComponent,
    LoadingSpinnerGameComponent,
    LoadingSpinnerComponent,
    MacaoPlayerPanelComponent,
    MacaoCardTableComponent,
    MacaoDemandViewComponent,
    PanPlayerPanelComponent,
    PanCardTableComponent,
    PanOpponentPanelComponent,
    MacaoOpponentPanelComponent,
    ChatComponent
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
    SseService,
    MacaoGameService,
    PanGameService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
