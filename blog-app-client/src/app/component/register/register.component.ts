import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApicallService } from 'src/app/service/apicall.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private apicallService: ApicallService,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(){
    this.submitted= true;

    if(!this.registerForm.valid){
     return;
    }

    let data=this.registerForm.value;
    this.apicallService.register(data).subscribe((res)=>{
      console.log(res)
      this.snackbarService.show(res?.message);
      if(res?.status== 201){
        // Automatically log in the user after registration
        const loginData = {
          loginId: data.email,
          password: data.password
        };
        this.apicallService.login(loginData).subscribe(
          loginResponse => {
            this.snackbarService.show(res.message);
            if(loginResponse.status==200){
              let {name,email,username,_id,img} = loginResponse.data;
              this.storageService.setStorage('user',{name,email,username,userId:_id,img})
              this.router.navigate(['/home']);
            }
          },
          loginError => {
            this.snackbarService.show('Login failed after registration');
          }
        );
      }
      this.registerForm.reset(); // Reset form values after successful login
      this.submitted = false;
    },
    (error)=>{
      this.snackbarService.show('registration failed');
    })
  }

  check(){
    this.apicallService.getCall().subscribe((res)=>{
      console.log(res)
    })
  }



}
