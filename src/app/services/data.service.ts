import { WordpressService } from "./wordpress.service";
import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private wp: WordpressService) {}
  $componentName = new EventEmitter();

  private lessonSource = new BehaviorSubject({});
  currentLesson = this.lessonSource.asObservable();

  private dataSource = new BehaviorSubject({});
  currentData = this.dataSource.asObservable();

  nameChange(component: any) {
    this.$componentName.emit(component);
  }

  lessonChange(index: any, lesson: any) {
    this.lessonSource.next({ index, lesson });
    let completedLesson = JSON.parse(localStorage.getItem("Lesson"));
    if (completedLesson !== null) {
      if ( !completedLesson.includes(lesson)) {
        localStorage.setItem("LastLesson", JSON.stringify(index));
      }
    } else {
      localStorage.setItem("LastLesson", JSON.stringify(index));
    }
  }

  dataChange(data: any) {
    this.dataSource.next(data);
  }
}
