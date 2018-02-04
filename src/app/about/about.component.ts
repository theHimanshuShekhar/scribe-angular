import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  // Line Chart Data
  public lineChartData:Array<any> = [
    {data: [0, 3, 5, 15, 20, 22, 34], label: 'Posts'},
    {data: [0, 1, 2, 3, 4, 5, 8], label: 'Groups'},
    {data: [2, 7, 8, 10, 12, 14, 15], label: 'Users'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(0,0,255,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      backgroundColor: 'rgb(0,0,0,0.4)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { 
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public chartClicked(e:any):void {
    
  }
 
  public chartHovered(e:any):void {
    
  }
 


  ngOnInit() {
    this.title.setTitle('Scribe | About');
  }
}
