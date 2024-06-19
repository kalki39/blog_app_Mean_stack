import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss']
})
export class ShapeComponent implements OnInit {

  ip=[[1,1,0],[0,0,1],[1,1,1]];
  data:any=[];
  added=new Set();
  removing=false;
  sum=0;

  constructor() { }

  ngOnInit(): void {
    this.data=this.ip.flat(Infinity);
    this.sum=this.data.reduce((a: any,b: any)=>a+b,0)
    console.log(this.data);
  }

  validate(box:any,i:Number){
    if(box==0 || this.removing)return;
    this.added.add(i)
    console.log(this.added);
    console.log(this.sum);

    if(this.sum== this.added.size){
      setTimeout(()=>{
        this.removing=true;
        this.remove()
      },100)
    }
  }

  check(i:Number){
    return this.added.has(i);
  }

  remove(){
    if(this.added.size==0){
      this.removing=false;
      return;
    };

    let myArray = Array.from(this.added);

    // Remove the first element
    myArray.shift();

    // Convert the array back to a set
    this.added = new Set(myArray);

    setTimeout(()=>this.remove(),300)

  }

}
