import { Component, OnInit } from "@angular/core";
import { ValidateService } from "../services/validate.service";
import { FriendsService } from "../services/friends.service";

@Component({
  selector: "app-my-friends",
  templateUrl: "./friends-page.component.html",
  styleUrls: [
    "./friends-page.component.css",
    "../../css/button.css",
    "../../css/menu-error.css"
  ]
})
export class FriendsPageComponent implements OnInit {
  friends = [
    { name: "ja", id: 1 },
    { name: "ty", id: 2 }
  ];
  friendRequests = [
    { senderName: "ja", id: 1 },
    { senderName: "ty", id: 2 }
  ];
  isSendFriendRequestBoxVisible = false;
  friendName = null;
  constructor(
    private friendsService: FriendsService,
    private validateService: ValidateService
  ) {}

  ngOnInit(): void {
    this.getLists();
  }

  getLists() {
    this.friendsService.getFriends().subscribe(data => {
      // @ts-ignore
      this.friends = data.data;
    });
    this.friendsService.getFriendRequest().subscribe(data => {
      // @ts-ignore
      this.friendRequests = data.data;
    });
  }

  removeFriend(id) {
    this.friendsService.deleteFriend({ friendId: id }).subscribe(data => {});
    this.getLists();
  }

  acceptFriendRequest(id) {
    this.friendsService
      .acceptFriendRequest({ friendRequestId: id })
      .subscribe(data => {});
    this.getLists();
  }

  rejectFriendRequest(id) {
    this.friendsService
      .rejectFriendRequest({ friendRequestId: id })
      .subscribe(data => {});
    this.getLists();
  }

  sendFriendRequest() {
    const errorLabel: HTMLElement = document.querySelector(
      ".menu__error"
    ) as HTMLElement;
    const validator = this.validateService.validateFriendName(
      this.friendName,
      this.friends
    );
    if (validator.isValid) {
      errorLabel.style.display = "none";
      this.friendsService
        .sendFriendRequest({ friendName: this.friendName })
        .subscribe(data => {
          // @ts-ignore
          if (data.data === true) {
            errorLabel.style.display = "block";
            // @ts-ignore
            errorLabel.style.backgroundColor = "#1fbf27";
            errorLabel.textContent = "Wysłano zaproszenie";
          } else {
            errorLabel.style.backgroundColor = "red";
            // @ts-ignore
            errorLabel.textContent = data.error;
          }
        });
    } else {
      errorLabel.style.display = "block";
      errorLabel.style.backgroundColor = "red";
      errorLabel.textContent = validator.msg;
    }
  }

  showFriendRequestBox() {
    this.isSendFriendRequestBoxVisible = !this.isSendFriendRequestBoxVisible;
  }
}
