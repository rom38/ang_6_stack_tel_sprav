import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string =  'app workss1!';
  jsonn: Promise<string>
  dat_serv: any
  page: number = 1
  pageSize: number = 30
  //numOfRecords: Promise<number>
  numOfRecords: BehaviorSubject<number>;
  //numOfRecords: number
  constructor(DataService: DataService) {
    this.dat_serv = DataService
    //this.jsonn = DataService.getDocuments();
    //this.numOfRecords = new BehaviorSubject(76);
    //this.numOfRecords = DataService.numberOfRecords();
    //console.log("app_comp_dat_rec" + DataService.numOfRec)
    //this.numOfRecords = DataService.numOfRec; //DataService.numberOfRecords();

  }

  ngOnInit() {
    this.jsonn = this.dat_serv.getDocuments();
  }
  increment() {
    //this.numOfRecords = this.dat_serv.numOfRec;
    //this.numOfRecords += 1;
  }
  identify(index,item){
    //do what ever logic you need to come up with the unique identifier of your item in loop, I will just return the object id.
      return item["_id"];
  }

}
