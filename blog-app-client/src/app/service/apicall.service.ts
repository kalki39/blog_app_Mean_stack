import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  private baseUrl = 'http://localhost:8000'; // Replace with your actual API base URL

  constructor(private http: HttpClient,private st:StorageService) { }

  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/login`, data,{headers});
  }

  register(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/register`, JSON.stringify(data),{headers});
  }

  getCall(){
    return this.http.get(`${this.baseUrl}/`);
  }

  getBlogs(userId:String): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.baseUrl}/myblogs/${userId}`, { headers });
  }
  getAllBlogs(userId:String): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.baseUrl}/allblogs/${userId}`, { headers });
  }
  createBlogs(userId:String,data:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/create-blog/${userId}`, data ,{ headers });
  }
  editBlogs(userId:String,data:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/editblog`, data ,{ headers });
  }
  deleteBlogs(data:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/deleteblog`, data ,{ headers });
  }
  logout(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/logout`, { headers });
  }

  getFollowersList(userId:String): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.baseUrl}/followersList/${userId}`, { headers });
  }

  getFollowingList(userId:String): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.baseUrl}/followingList/${userId}`, { headers });
  }

  findPeople(userId:String): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.baseUrl}/findpeople/${userId}`, { headers });
  }

  unfollowUser(userId:String,data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/unfollowuser/${userId}`, data,{headers});
  }
  followUser(userId:String,data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/followuser/${userId}`, data,{headers});
  }
}
