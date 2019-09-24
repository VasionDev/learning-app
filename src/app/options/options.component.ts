import { WordpressService } from "./../services/wordpress.service";
import { DataService } from "./../services/data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"]
})
export class OptionsComponent implements OnInit {
  userLoggedIn = false;

  constructor(private data: DataService, private wp: WordpressService) {}

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("signInStatus")) !== null) {
      this.userLoggedIn = JSON.parse(localStorage.getItem("signInStatus"));
    }
  }

  onClickDone() {
    this.data.nameChange("HomeComponent");
  }

  onClickSignOut() {
    localStorage.removeItem("signInStatus");
    localStorage.removeItem("Index");
    localStorage.removeItem("Lesson");
    localStorage.removeItem("UserID");
    this.wp.logout().subscribe((data: any) => {
      this.data.nameChange("HomeComponent");
    });
  }
}
