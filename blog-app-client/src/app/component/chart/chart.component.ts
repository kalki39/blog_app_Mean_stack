import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  
  data:{ name: string, count: number,bg:String }[]=[
    {name:"NOKIA",count:60,bg:"green"},
    {name:"HCL",count:20,bg:"red"},
    {name:"IBM",count:30,bg:"yellow"},
    {name:"HP",count:10,bg:'blue'},
    {name:"ACER",count:50,bg:'grey'},
    {name:"ASUS",count:40,bg:"pink"},
  ]
  max=0;

  constructor() { }

  ngOnInit(): void {

    this.max=this.data.reduce((ac,cu)=>Math.max(ac,cu.count),0)
    console.log(this.max);
  }

}
