import { WordpressService } from "./services/wordpress.service";
import { DataService } from "./services/data.service";
import { LessonComponent } from "./lesson/lesson.component";
import { LoginComponent } from "./login/login.component";
import { OptionsComponent } from "./options/options.component";
import { Component, OnInit } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { ResourceComponent } from "./resource/resource.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  myComponent: any;
  dataPosts: any;

  constructor(private data: DataService, private wp: WordpressService) {}

  loadComponent() {
    this.wp.login().subscribe((user: any) => {
      if (user.mvuser_id !== undefined && user.mvuser_id !== "") {
        const value = JSON.parse(user.user_learn_data);
        localStorage.setItem("Index", JSON.stringify(value.indexArray));
        localStorage.setItem("Lesson", JSON.stringify(value.lessonArray));
      }
      this.myComponent = HomeComponent;
    });
    this.data.$componentName.subscribe((name: any) => {
      if (name === "HomeComponent") {
        this.myComponent = HomeComponent;
      } else if (name === "LessonComponent") {
        this.myComponent = LessonComponent;
      } else if (name === "ResourceComponent") {
        this.myComponent = ResourceComponent;
      } else if (name === "LoginComponent") {
        this.myComponent = LoginComponent;
      } else if (name === "OptionsComponent") {
        this.myComponent = OptionsComponent;
      }
    });
  }

  ngOnInit() {
    this.loadComponent();
  }
}
