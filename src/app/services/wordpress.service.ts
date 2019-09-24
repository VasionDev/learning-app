import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WordpressService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(
      "https://pruvitnow.com/preview/wp-json/getLearningtools/v2/"
    );
  }

  login(): Observable<any[]> {
    return this.http.get<any[]>(
      "https://pruvitnow.com/preview/wp-json/userAuth/v2/"
    );
  }

  logout(): Observable<any[]> {
    return this.http.get<any[]>(
      "https://pruvitnow.com/preview/wp-json/setUserLogout/v2/"
    );
  }

  saveData(userInfo: any): Observable<any[]> {
    return this.http.post<any[]>(
      "https://pruvitnow.com/preview/wp-json/sendUserLearnData/v2/",
      userInfo
    );
  }

  setUserLogin(): Observable<any[]> {
    return this.http.get<any[]>(
      "https://pruvitnow.com/preview/wp-json/setUserLogin/v2/"
    );
  }
}
