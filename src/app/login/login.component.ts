import { WordpressService } from "./../services/wordpress.service";
import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(private data: DataService, private wp: WordpressService) {}

  ngOnInit() {}

  onClickSignIn() {
    this.wp.login().subscribe(user => console.log(user));
    this.data.nameChange("HomeComponent");
  }
}
