import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { OptionsComponent } from "./options/options.component";
import { LessonComponent } from "./lesson/lesson.component";
import { ResourceComponent } from "./resource/resource.component";
import { ModalComponent } from "./modal.component"
import { ModalService } from "./services/modal.service"
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const routes: Routes = [
  {path: '', component: HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    OptionsComponent,
    LessonComponent,
    ResourceComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [
    HomeComponent,
    OptionsComponent,
    LoginComponent,
    LessonComponent,
    ResourceComponent
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule {}
