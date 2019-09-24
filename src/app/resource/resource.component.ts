import { DataService } from "./../services/data.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-resource",
  templateUrl: "./resource.component.html",
  styleUrls: ["./resource.component.css"]
})
export class ResourceComponent implements OnInit {
  posts: any;
  indexLesson: any;
  indexPost: any;

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.data.currentData.subscribe((data: any) => {
      this.posts = data;
    });

    this.route.queryParamMap.subscribe(params => {
      this.indexPost = params.get("module");
      this.indexLesson = params.get("lesson");
    });

    /*this.data.currentLesson.subscribe((values: any) => {
      this.indexLesson = values.lesson;
      this.indexPost = values.index;
    });*/
  }

  onClickLeft() {
    this.router.navigate(['/']);
    this.data.nameChange("HomeComponent");
  }

  onClickLesson() {
    this.data.nameChange("LessonComponent");
  }

  onNavigate(link: any) {
    window.open(link, "_blank");
  }

  onClickHome() {
    this.router.navigate(['/']);
    this.data.nameChange("HomeComponent");
  }
}
