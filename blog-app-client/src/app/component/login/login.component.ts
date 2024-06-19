import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApicallService } from '../../service/apicall.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private apicallService: ApicallService,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      loginId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    if (this.getCurrentUser()) {
      this.router.navigate(['/home']);
    }
  }

  get f() {
    return this.loginForm?.controls;
  }
  getCurrentUser() {
    // Fetch the current user (mocked data for this example)
    return this.storageService.getStorage('user'); // Replace with actual user fetching logic
  }

  onSubmit() {
    this.submitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    let data = this.loginForm.value;
    this.apicallService.login(data).subscribe(
      (loginResponse) => {
        this.snackbarService.show(loginResponse.message);
        console.log(loginResponse);

        if (loginResponse.status == 200) {
          if (loginResponse.data) {
            let { name, email, username, _id, img } = loginResponse.data;
            this.storageService.setStorage('user', {
              name,
              email,
              username,
              userId: _id,
              img,
            });
            console.log(this.storageService.getStorage('user'));
          }

          this.router.navigate(['/home']);
        }
      },
      (loginError) => {
        console.log(loginError);
        this.snackbarService.show(loginError.error.message);
      }
    );
    this.apicallService.login(data).subscribe(
      (res: any) => {
        console.log(res);
        this.snackbarService.show(res?.message);
        this.loginForm.reset(); // Reset form values after successful login
        this.submitted = false;
      },
      (error: any) => {
        this.snackbarService.show('registration failed');
      }
    );
  }
}
