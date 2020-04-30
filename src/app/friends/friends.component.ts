import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-my-friends",
  templateUrl: "./friends.component.html",
  styleUrls: ["./friends.component.css", "../../css/button.css"]
})
export class FriendsComponent implements OnInit {
  friends = [
    { name: 'ja', id: 1 },
    { name: 'ty', id: 2 },
  ];
  friendRequests = [
    { senderName: 'ja', id: 1 },
    { senderName: 'ty', id: 2 },
  ];
  isSendFriendRequestBoxVisible = false;
  friendName = null;
  isLoading = true;

  constructor() {}

  ngOnInit(): void {}

  showFriendRequestBox() {
    this.isSendFriendRequestBoxVisible = !this.isSendFriendRequestBoxVisible;
  }

  rejectFriendRequest(id: number) {

  }

  acceptFriendRequest(id: number) {

  }

  removeFriend(id: number) {

  }

  sendFriendRequest() {

  }
}
