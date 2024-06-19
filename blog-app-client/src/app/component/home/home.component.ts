import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from 'src/app/service/apicall.service';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  blogs: any[] = [];
  followersList: any[] = [];
  followingList: any[] = [];
  updatedList: any[] = [];
  currentUser: any = {};
  isEdit: boolean = false;
  editBoldData: any = {};
  activeBtn = 1;
  loading = false;

  constructor(
    private apicallService: ApicallService,
    public authService: AuthGuardService,
    private router: Router,
    private snackbarService: SnackbarService,
    private st: StorageService
  ) {}

  ngOnInit() {
    this.loading = true;
    if (!this.getCurrentUser()) {
      this.router.navigate(['/login']);
    }
    this.currentUser = this.getCurrentUser();
    this.getBlogs();
  }

  getCurrentUser() {
    // Fetch the current user (mocked data for this example)
    return this.st.getStorage('user'); // Replace with actual user fetching logic
  }

  getBlogs() {
    this.activeBtn = 1;
    this.loading = true;
    this.blogs = [];
    this.apicallService.getBlogs(this.currentUser.userId).subscribe(
      (response: any) => {
        this.loading = false;
        this.blogs = response.date; // Adjust based on your API response structure
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }
  getAllBlog() {
    this.activeBtn = 0;
    this.loading = true;
    this.apicallService.getAllBlogs(this.currentUser.userId).subscribe(
      (response: any) => {
        this.loading = false;
        this.blogs = response.date; // Adjust based on your API response structure
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }
  getFollowersList() {
    this.activeBtn = 2;
    this.loading = true;
    this.apicallService.getFollowersList(this.currentUser.userId).subscribe(
      (response: any) => {
        this.loading = false;
        this.followersList = response.data; // Adjust based on your API response structure
        this.getFollowingList(false);
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }
  findPeople() {
    this.activeBtn = 4;
    this.loading = true;
    this.apicallService.findPeople(this.currentUser.userId).subscribe(
      (response: any) => {
        this.loading = false;
        console.log(response);
        this.updatedList = response.data;
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }
  unfollow(data: any) {
    this.loading = true;
    data = { followingUserId: data._id };
    this.apicallService.unfollowUser(this.currentUser.userId, data).subscribe(
      (response: any) => {
        this.loading = false;
        console.log(response);
        if (response.status == 200) {
          this.snackbarService.show(response.message);
          if (this.activeBtn == 3) this.getFollowingList(true);
          if (this.activeBtn == 2) this.getFollowersList();
        }
        this.updatedList = response.data;
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }

  follow(data: any) {
    this.loading = true;
    data = { followingUserId: data._id };
    this.apicallService.followUser(this.currentUser.userId, data).subscribe(
      (response: any) => {
        console.log(response);
        this.loading = false;
        if (response.status == 200) {
          this.snackbarService.show(response.message);
          if (this.activeBtn == 3) this.getFollowingList(true);
          if (this.activeBtn == 2) this.getFollowersList();
          if (this.activeBtn == 4) this.findPeople();
        }
        this.updatedList = response.data;
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }
  getFollowingList(fromButton: boolean) {
    this.loading = true;
    console.log(fromButton);
    if (fromButton) {
      this.activeBtn = 3;
    }
    this.apicallService.getFollowingList(this.currentUser.userId).subscribe(
      (response: any) => {
        this.loading = false;
        console.log(response);
        if (fromButton) {
          this.updatedList = response.data;
        } else {
          this.updatedList = this.checkUpdateList(
            this.followersList,
            this.updatedList
          );
        }
      },
      (error: any) => {
        console.error('Failed to fetch blogs', error);
      }
    );
  }

  checkUpdateList(followerarr: any, followingarr: any) {
    let arr: any[] = [];
    followerarr.forEach((follower: any) => {
      if (followingarr.some((item: any) => item._id == follower._id)) {
        follower.following = true;
      } else {
        follower.following = false;
      }
      arr.push(follower);
    });
    console.log('up', arr);
    return arr;
  }

  logout() {
    // Perform logout logic (clear tokens, etc.)
    this.loading = true;
    this.apicallService.logout().subscribe(
      (response: any) => {
        this.loading = false;
        this.snackbarService.show(response.message);
        this.st.removeStorage('user');
        if (response.status == 200) {
          this.router.navigate(['/login']);
        }
      },
      (error: any) => {
        console.error('Failed to logout', error);
      }
    );
  }

  edit(blog: any) {
    console.log(blog);
    if (this.checkTimeExceed30min(blog)) {
      return;
    }
    this.editBoldData = blog;
    this.isEdit = true;
  }
  checkTimeExceed30min(blog: any) {
    // let createTime=new Date(blog.creationDateTime).getTime()
    const creationDateTime = new Date(blog.creationDateTime).getTime();
    const currentDateTime = Date.now();
    const diff = (currentDateTime - creationDateTime) / (1000 * 60);
    console.log(creationDateTime);
    console.log(currentDateTime);
    if (diff > 30) {
      this.snackbarService.show('can not edit this blog, 30mins exceeds');
      return true;
    }
    return false;
  }
  deleteBlog(blog: any) {
    this.loading = true;
    this.apicallService.deleteBlogs(blog).subscribe((res: any) => {
      this.snackbarService.show(res.message);
      this.loading = false;
      if (res.status == 200) {
        this.getBlogs();
      }
    });
  }

  changeState(val: any) {
    this.isEdit = val;
    this.getBlogs();
  }

  navigateTo(blog: any) {}
}
