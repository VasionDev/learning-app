import { WordpressService } from "./services/wordpress.service";
import { DataService } from "./services/data.service";
import { LessonComponent } from "./lesson/lesson.component";
import { LoginComponent } from "./login/login.component";
import { OptionsComponent } from "./options/options.component";
import { Component, OnInit } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { ResourceComponent } from "./resource/resource.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  myComponent: any;
  allLessonID = [];
  spinner = true;

  constructor(private data: DataService, private wp: WordpressService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.wp.getPosts().subscribe(
      (data: any) => {
        const postData = JSON.parse(data);
        for (const post of postData) {
          for (const lesson of post.lesson) {
            this.allLessonID.push(lesson.lesson_id);
          }
        }
        this.data.dataChange(postData);
      },
      (err) => {},
      () => {
        this.loadComponent();
      }
    );
  }

  loadComponent() {
    this.wp.login().subscribe(
      (user: any) => {
        if (user.mvuser_id !== undefined && user.mvuser_id !== "") {
          const value = JSON.parse(user.user_learn_data);
          localStorage.setItem("Index", JSON.stringify(value.indexArray));
          localStorage.setItem("Lesson", JSON.stringify(value.lessonArray));
        }
        this.myComponent = HomeComponent;
      },
      (err) => {},
      () => {
        this.spinner = false;
        this.route.queryParamMap.subscribe(params => {
          const lessonID = params.get("lesson");
          if (lessonID != null) {
            this.data.nameChange("LessonComponent");
          }
        });

        let CompletedLesson = JSON.parse(localStorage.getItem("Lesson"));
        let CompletedPost = JSON.parse(localStorage.getItem("Index"));
        if (CompletedLesson === null && CompletedPost === null) {
          CompletedLesson = [];
          CompletedPost = [];
        }

        CompletedLesson.forEach(lessonID => {
          if ( !this.allLessonID.includes(lessonID)) {
            const removeIndex = CompletedLesson.indexOf(lessonID);
            CompletedLesson.splice(removeIndex, 1);
            CompletedPost.splice(removeIndex, 1);
          }
        });

        // console.log(CompletedLesson, CompletedPost);
        localStorage.setItem("Lesson", JSON.stringify(CompletedLesson));
        localStorage.setItem("Index", JSON.stringify(CompletedPost));
      }
    );

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

}
