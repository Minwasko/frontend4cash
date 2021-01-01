import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post, PostInfo} from "../../scripts/ts/metadata/Post";
import {UserService} from "./user.service";
import URLRouter from "../../scripts/ts/utils/URLRouter";
import LocalUser from "../../scripts/ts/utils/LocalUser";
import StringUtils from "../../scripts/ts/utils/StringUtils";

@Injectable()
export class PostService {
  private readonly postsUrl: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.postsUrl = URLRouter.getRoute('posts');
  }

  public getPost(id: string): Observable<any> {
    const url = this.postsUrl + id;
    return this.http.get<any>(url);
  }

  public getNPosts(amount: number): Observable<PostInfo[]> {
    return this.http.get<PostInfo[]>(`${this.postsUrl}?amount=${amount}`);
  }

  public savePost(title: string, content: string): Observable<void> {
    return this.http.post<any>(this.postsUrl, {title: StringUtils.stripTags(title), content: StringUtils.stripTags(content), authorEmail: LocalUser.user.email},
      {
        headers: new HttpHeaders({
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        })
      });
  }
}
