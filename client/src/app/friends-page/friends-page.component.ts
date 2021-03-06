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
  isLoading = true;
  friends = [];
  friendRequests = [];
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
      this.friendsService.getFriendRequest().subscribe(data => {
        // @ts-ignore
        this.friendRequests = data.data;
        this.isLoading = false;
      });
    });
  }

  removeFriend(id) {
    this.isLoading = true;
    this.friendsService.deleteFriend({ friendId: id }).subscribe(data => {});
    this.getLists();
  }

  acceptFriendRequest(id) {
    this.isLoading = true;
    this.friendsService
      .acceptFriendRequest({ friendRequestId: id })
      .subscribe(data => {});
    this.getLists();
  }

  rejectFriendRequest(id) {
    this.isLoading = true;
    this.friendsService
      .rejectFriendRequest({ friendRequestId: id })
      .subscribe(data => {});
    this.getLists();
  }

  sendFriendRequest() {
    this.isLoading = true;
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
          this.isLoading = false;
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
