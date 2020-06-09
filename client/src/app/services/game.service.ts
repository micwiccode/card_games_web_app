import { Injectable } from "@angular/core";
import { SseService } from "./sse-service.service";

@Injectable({
  providedIn: "root"
})
export class GameService {

  constructor(private sseService: SseService) {}

  closeServerSendEvents() {
    this.sseService.closeEventSources();
  }
}
