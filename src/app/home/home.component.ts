import { DataService } from "./../services/data.service";
import { Component, OnInit } from "@angular/core";
import { WordpressService } from "../services/wordpress.service";
import { ActivatedRoute } from '@angular/router';

let CompletedTools = [];
let prerequisites = [];

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  posts: any;
  indexPost: any;
  indexSlide: any;
  completePercent: any;
  userLoggedIn = false;
  nextStartLesson = {lesson_id: ''};
  lastEndedPostIndex: any;
  isComplete = 0;
  redirectUrl: any;
  completedLesson: any[] = [];
  completedIndex: any[] = [];


  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    centerMode: true,
    centerPadding: '60px',
    infinite: false,
    slickGoTo: 0
  };

  constructor(private data: DataService, private wp: WordpressService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadSignInStatus();
    this.data.currentData.subscribe((data: any) => {
      this.posts = data;
      let allLength = data.length;
      let totalLesson = 0;
      let lastEndedPostLessons = [];
      while (allLength > 0) {
        totalLesson = totalLesson + data[--allLength].lesson.length;
      }
      const tempIndex = JSON.parse(localStorage.getItem("LastLesson"));
      let mainIndex: number;

      if (tempIndex === null) {
        this.indexPost = this.posts[0].learnID;
        lastEndedPostLessons = this.posts[0].lesson;
        this.lastEndedPostIndex = this.posts[0];
        this.indexSlide = 0;
      } else {
        for (mainIndex = 0; mainIndex < this.posts.length; mainIndex++) {
          if (this.posts[mainIndex].learnID === tempIndex) {
            this.indexPost = tempIndex;
            lastEndedPostLessons = this.posts[mainIndex].lesson;
            this.lastEndedPostIndex = this.posts[mainIndex];
            this.indexSlide = mainIndex;
          }
        }
      }

      this.updateNextStartLesson(lastEndedPostLessons);
      this.completedLesson = JSON.parse(localStorage.getItem("Lesson"));
      this.completedIndex = JSON.parse(localStorage.getItem("Index"));
      if (this.completedLesson !== null) {
        this.completePercent = ((100 * this.completedLesson.length) / totalLesson).toFixed();
      }

      this.allComplete();
      this.route.queryParamMap.subscribe(params => {
        const lessonID = params.get("lesson");
        if (lessonID != null) {
          this.data.nameChange("LessonComponent");
        }
      });
    });
  }

  updateNextStartLesson(lastEndedPostLessons) {

    let LessonArray = JSON.parse(localStorage.getItem("Lesson"));
    if (LessonArray === null) {
      LessonArray = [];
    }

    for (const lesson of lastEndedPostLessons) {
      if ( !LessonArray.includes(lesson.lesson_id)) {
        this.nextStartLesson = lesson;
        break;
      }
    }
  }

  loadSignInStatus() {
    this.wp.login().subscribe((user: any) => {
      if (user.mvuser_id !== undefined && user.mvuser_id !== "") {
        localStorage.setItem("UserID", user.mvuser_id);
        const value = JSON.parse(user.user_learn_data);
        localStorage.setItem("Index", JSON.stringify(value.indexArray));
        localStorage.setItem("Lesson", JSON.stringify(value.lessonArray));
        this.userLoggedIn = true;
        localStorage.setItem("signInStatus", JSON.stringify(true));
      } else {
        localStorage.removeItem("UserID");
      }
    });
    this.wp.setUserLogin().subscribe((res: any) => {
      const url = JSON.parse(res);
      this.redirectUrl = url.url;
    });
  }

  completedLessonNo(learnList: any) {
    let CompletedLesson = JSON.parse(localStorage.getItem("Lesson"));
    let lessonNo = 0;
    if (CompletedLesson === null) {
      CompletedLesson = [];
    }
    for (const lesson of learnList.lesson) {
      if ( CompletedLesson.includes(lesson.lesson_id)) {
        lessonNo++;
      }
    }
    return lessonNo;
  }

  prereqText(prereq: any) {
    let i: number;
    if (this.posts !== undefined) {
      for (i = 0; i < this.posts.length; i++) {
        if (this.posts[i].learnID === +prereq) {
          return this.posts[i].learnTitle;
        }
      }
    }
  }

  onClickIcon() {
    this.data.nameChange("OptionsComponent");
  }

  onClickLesson(index: any, lesson: any) {
    this.data.lessonChange(index, lesson);
    this.data.nameChange("LessonComponent");
  }

  prerequisiteComplete(post: any) {
    let k: number;
    if (this.posts !== undefined) {
      for (k = 0; k < this.posts.length; k++) {
        if (this.posts[k].learnID === post.learnID) {
          prerequisites = this.posts[k].prerequisites;
          const result = [];
          for (let i = 0, l = prerequisites.length; i < l; i++) {
            result.push(+prerequisites[i]);
          }
          const arr1 = result.concat().sort();
          const arr2 = CompletedTools.concat().sort();
          if (arr1.length !== 0) {
            if (arr1.every((val: any) => arr2.includes(val))) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
      }
    }
  }

  completedTask(i: any, l: any) {
    if (this.completedIndex !== null && this.completedLesson !== null) {
      const indexes = [];
      let indexOfArray: number;
      for (
        indexOfArray = 0;
        indexOfArray < this.completedIndex.length;
        indexOfArray++
      ) {
        if (this.completedIndex[indexOfArray] === i) {
          indexes.push(indexOfArray);
        }
      }
      let newIndex: number;
      for (newIndex = 0; newIndex < indexes.length; newIndex++) {
        if (this.completedLesson[indexes[newIndex]] === l) {
          return true;
        }
      }
      return false;
    }
  }

  onClickSignIn(postID: any) {
    localStorage.setItem("LastLesson", JSON.stringify(postID));
  }

  allComplete() {
    CompletedTools = JSON.parse(localStorage.getItem("CompletedTools"));
    if (CompletedTools === null) {
      CompletedTools = [];
    }
    let n: number;
    let trueCount = 0;
    if (this.posts !== undefined) {
      for (n = 0; n < this.posts.length; n++) {
        const lessons = this.posts[n].lesson;
        lessons.forEach((element: any) => {
          if (this.completedLesson !== null) {
            if (this.completedLesson.includes(element.lesson_id)) {
              trueCount++;
            }
          }
        });
        if (this.posts[n].lesson.length === trueCount) {
          if (CompletedTools.indexOf(this.posts[n].learnID) === -1) {
            CompletedTools.push(this.posts[n].learnID);
          }
        } else {
          const index = CompletedTools.indexOf(this.posts[n].learnID);
          if (index > -1) {
            CompletedTools.splice(index, 1);
          }
        }
        trueCount = 0;
      }
    }
    localStorage.setItem("CompletedTools", JSON.stringify(CompletedTools));
  }


  slickInit(e) {
    e.slick.slickGoTo(this.indexSlide);
  }

  breakpoint(e) {}

  afterChange(e) {
    const dataValue = document.querySelector('.slick-center').getAttribute('data-learn-id');
    this.indexPost = dataValue;
  }

  beforeChange(e) {}


}
