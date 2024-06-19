import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-click-board',
  templateUrl: './click-board.component.html',
  styleUrls: ['./click-board.component.scss']
})
export class ClickBoardComponent implements OnInit {

  list:any=[];
  history:any=[];
  colors:any=['blue','green','yellow','blue','pink','grey','black'];
  constructor() { }

  ngOnInit(): void {
  }

  undo(e:Event){
    e.stopPropagation()
    if(this.list.length==0){
      return
    }
    let copy=[...this.list];
    let last=copy.pop();
    this.list=copy;
    this.history.push(last)
    console.log("undo");
  }
  redo(e:Event){
    e.stopPropagation();
    let copy=[...this.history];
    let last=copy.pop();
    this.history=copy;
    this.list.push(last)
    console.log("undo");
  }
  reset(e:Event){
    e.stopPropagation()
    this.list=[]
    this.history=[]
  }

  addDot(e:any){
    e.stopPropagation();
    let randomColor=this.colors[Math.floor(Math.random()*this.colors.length)]

    let data={
      x:e.clientX,
      y:e.clientY,
      bg:randomColor
    }

    this.list.push(data)
    console.log(this.list );
  }

}
