import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApicallService } from 'src/app/service/apicall.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})
export class CreateBlogComponent implements OnInit {

  blogForm!:FormGroup;
  currenUser:any={}
  submitted=true
  @Input() isEdit:any
  @Input() blog:any
  check="kkk"
  @Output() goback=new EventEmitter()


  constructor(private formBuilder:FormBuilder,
    private st:StorageService,
    private apicallService:ApicallService,
    private snackbarService:SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.blog);
    let title='';
    let textBody='';
    if(this.isEdit){
      title=this.blog.title;
      textBody=this.blog.textBody
    }
    this.blogForm=this.formBuilder.group({
      title:[title,[Validators.required]],
      textBody:[textBody,[Validators.required]],
    })
    this.currenUser=this.st.getStorage('user');
  }

  onSubmit(e:Event){
    e.preventDefault();
    console.log(this.blogForm);
    if(!this.blogForm.valid){
      return;
    }
    
    let data=this.blogForm.value
    if(!this.isEdit){
      this.apicallService.createBlogs(this.currenUser.userId,data).subscribe((res:any)=>{
        if(res.status==201){
          this.snackbarService.show(res.message);
          this.router.navigate(['/home']);
        }
      },
      (err:any)=>{
        this.snackbarService.show('Blog not created');
      }
      )
    }else{
      data={...data,userId:this.blog.userId,_id:this.blog._id}
      this.apicallService.editBlogs(this.currenUser.userId,data).subscribe((res:any)=>{
        if(res.status==201){
          this.snackbarService.show(res.message);
          this.back();
          // this.router.navigate(['/home']);
        }
      },
      (err:any)=>{
        // console.log(err);
        this.snackbarService.show(err.error.message);
      }
      )
    }


  }
  back(){
    this.isEdit=false;
    this.goback.emit(this.isEdit)
    this.router.navigate(['/home'])
  }

}
