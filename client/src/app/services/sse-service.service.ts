import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SseService{
  private eventSourceList: EventSource[] = [];

  getEventSource(url): EventSource {
    const eventSource = new EventSource(url);
    this.eventSourceList.push(eventSource);
    return eventSource;
  }

  closeEventSources(): void {
    this.eventSourceList.forEach(es =>{
      es.close()
    })
  }
}
