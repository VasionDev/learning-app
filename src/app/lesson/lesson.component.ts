import { WordpressService } from "./../services/wordpress.service";
import { DataService } from "./../services/data.service";
import { ModalService } from "./../services/modal.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';

let IndexArray = [];
let LessonArray = [];

@Component({
  selector: "app-lesson",
  templateUrl: "./lesson.component.html",
  styleUrls: ["./lesson.component.css"],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      // transition(':leave', [
      //   animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      // ])
    ])
  ]
})
export class LessonComponent implements OnInit {
  indexLesson: any;
  indexPost: any;
  posts: any;
  count = 0;
  completed = false;
  completedToolName: any;
  completedLesson: any[] = [];
  completedIndex: any[] = [];
  incompleteLesson: any[] = [];

  constructor(
    private data: DataService,
    private wp: WordpressService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.data.currentData.subscribe((data: any) => {
      this.posts = data;
    });

    this.route.queryParamMap.subscribe(params => {
      this.indexPost = +params.get("module");
      this.indexLesson = params.get("lesson");
    });

    /*this.data.currentLesson.subscribe((values: any) => {
      this.indexLesson = values.lesson;
      this.indexPost = values.index;
    });*/
    this.completedTask();
  }

  // openModal(id: string) {
  //   this.modalService.open(id);
  // }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  onClickResource() {
    this.data.nameChange("ResourceComponent");
  }

  onClickComplete(value: boolean) {
    if (value) {
      this.completeChange(this.indexPost, this.indexLesson);
    } else {
      this.completeRemove(this.indexPost, this.indexLesson);
    }
  }

  onClickNewComplete(postID: any, lessonID: any) {

    this.completeChange(this.indexPost, this.indexLesson);
    this.router.navigate(['/'], {queryParams: {module: postID, lesson: lessonID}});
    window.scrollTo(0, 0);
  }

  lessonTitleShortener(title: string) {
    let newTitle: string;
    if ( title.length > 15 ) {
      newTitle = title.substr(0, 15) + '...';
    } else {
      newTitle = title;
    }
    return newTitle;
  }

  onClickCompleteAll(postIndex: any, postID: any) {
    let lessonLists = this.posts[postIndex].lesson;
    let completeLesson = JSON.parse(localStorage.getItem("Lesson"));
    if (completeLesson != null) {
      for(let i = 0; i < lessonLists.length - 1; i++) {
        if (!completeLesson.includes(lessonLists[i].lesson_id)) {
          this.incompleteLesson.push(lessonLists[i]);
        }
      }
    } else {
      this.incompleteLesson = lessonLists.slice(0, lessonLists.length - 1 );
    }
    // console.log(this.incompleteLesson);
    if(!this.incompleteLesson.length) {
      this.completeChange(this.indexPost, this.indexLesson);
      this.completedToolName = this.posts[postIndex].learnTitle;
      this.modalService.open('lesson-modal');

      if( postIndex < this.posts.length - 1 ) {
        localStorage.setItem("LastLesson", JSON.stringify(this.posts[postIndex + 1].learnID));
      }
    }
  }

  getTheLesson(learnID: any, lessonID: any) {
    this.incompleteLesson = [];
    this.router.navigate(['/'], {queryParams: {module: learnID, lesson: lessonID}});
  }

  onClickLeft() {
    this.router.navigate(['/']);
    this.data.nameChange("HomeComponent");
  }

  completedTask() {
    this.completedLesson = JSON.parse(localStorage.getItem("Lesson"));
    this.completedIndex = JSON.parse(localStorage.getItem("Index"));

    if (this.completedIndex !== null && this.completedLesson !== null) {
      const indexes = [];
      let indexOfArray: number;
      for (
        indexOfArray = 0;
        indexOfArray < this.completedIndex.length;
        indexOfArray++
      ) {
        if (this.completedIndex[indexOfArray] === this.indexPost) {
          indexes.push(indexOfArray);
        }
      }
      let newIndex: number;
      for (newIndex = 0; newIndex < indexes.length; newIndex++) {
        if (this.completedLesson[indexes[newIndex]] === this.indexLesson) {
          this.completed = true;
        }
      }
    }
  }

  completeChange(completedIndex: any, completedLesson: any) {
    // console.log("complete api triggered");
    LessonArray = JSON.parse(localStorage.getItem("Lesson"));
    IndexArray = JSON.parse(localStorage.getItem("Index"));
    if (LessonArray === null && IndexArray === null) {
      IndexArray = [];
      LessonArray = [];
    }
    IndexArray.push(completedIndex);
    LessonArray.push(completedLesson);
    localStorage.setItem("Lesson", JSON.stringify(LessonArray));
    localStorage.setItem("Index", JSON.stringify(IndexArray));
    const UserId = localStorage.getItem("UserID");
    if (UserId !== null) {
      this.wp
        .saveData({
          userId: UserId,
          indexArray: IndexArray,
          lessonArray: LessonArray
        })
        .subscribe(
          (res: any) => {
            const value = JSON.parse(res);
            // console.log(value);
            if (value.success === true) {
              // console.log(value.success);
              this.completed = true;
            } else {
              // console.log(value.success);
              this.completed = false;
            }
          },
          (err: any) => {
            console.log("add", err);
            this.completed = false;
          },
          // () => this.data.nameChange("HomeComponent")
        );
      // console.log('checked');
    } else {
      console.log("userID not found");
      this.completed = true;
      // setTimeout(() => this.data.nameChange("HomeComponent"), 1000);
    }
  }

  completeRemove(removedIndex: any, removedLesson: any) {
    // console.log("remove api triggered");
    LessonArray = JSON.parse(localStorage.getItem("Lesson"));
    IndexArray = JSON.parse(localStorage.getItem("Index"));
    if (LessonArray === null && IndexArray === null) {
      IndexArray = [];
      LessonArray = [];
    }
    const indexRemoved = IndexArray.indexOf(removedIndex);
    if (indexRemoved > -1) {
      IndexArray.splice(indexRemoved, 1);
    }
    const lessonRemoved = LessonArray.indexOf(removedLesson);
    if (lessonRemoved > -1) {
      LessonArray.splice(lessonRemoved, 1);
    }
    localStorage.setItem("Lesson", JSON.stringify(LessonArray));
    localStorage.setItem("Index", JSON.stringify(IndexArray));
    const UserId = localStorage.getItem("UserID");
    if (UserId !== null) {
      this.wp
        .saveData({
          userId: UserId,
          indexArray: IndexArray,
          lessonArray: LessonArray
        })
        .subscribe(
          (res: any) => {
            const value = JSON.parse(res);
            // console.log(value);
            if (value.success === true) {
              // console.log(value.success);
              this.completed = false;
            } else {
              // console.log(value.success);
              this.completed = true;
            }
          },
          (err: any) => {
            console.log("remove", err);
            this.completed = true;
          },
          () => this.data.nameChange("HomeComponent")
        );
      // console.log('checked');
    } else {
      console.log("userID not found");
      this.completed = false;
      setTimeout(() => this.data.nameChange("HomeComponent"), 1000);
    }
  }
}
