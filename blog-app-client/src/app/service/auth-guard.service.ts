import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  implements CanActivate{

  constructor(private router: Router,
    private st:StorageService
  ) { }
  canActivate(){
    if (!this.isLogIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  isLogIn(){
    let res=this.st.getStorage('user')
    return res?true:false;
  }
}
