import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, BehaviorSubject } from 'rxjs';

import PouchDB from 'pouchdb';



@Injectable()
export class DataService {

  username: string;
  db: any;
  password: string;
  remote: string;
  data: any;
  //numOfRec:Promise<number>;
  //numOfRec: any = 9999;
  //numOfRec: Observable<any>;
  numOfRec: BehaviorSubject<number | object>;




  constructor(private zone: NgZone) {

    this.db = new PouchDB('mytestdb');
    this.username = 'rom';
    this.password = '12';
    //this.remote = 'https://MY-BLUEMIX-URL-bluemix.cloudant.com/mytestdb';
    this.remote = 'https://localhost:6984/mytestdb2';
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    };

    this.db.sync(this.remote, options);
    this.numOfRec = new BehaviorSubject(0)
    //this.numOfRec=this.numberOfRecords()
    this.numOfRec.subscribe(res => { console.log('subsc: ' + res) })
    this.numberOfRecords()
    // this.numberOfRecords().then((result) => {
    //   this.numOfRec.next(result)
    // })
    // this.numberOfRecords().then((result) => {
    //    console.log("result"+result);
    //   this.numOfRec = result;
    // });

  }


  addDocument(doc) {
    this.db.put(doc);
  }

  getDocuments() {

    return new Promise(resolve => {

      this.db.allDocs({

        include_docs: true

      }).then((result) => {

        this.data = [];
        console.log(result);

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
          //resolve(this.data);
        });
        resolve(this.data);
        console.log(this.data);

        this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
          this.handleChange(change);
          //this.numOfRec = this.numberOfRecords();
          this.numberOfRecords();
        });

      }).catch((error) => {

        console.log(error);

      });

    });

  }

  handleChange(change) {

    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }
      //A document was added
      else {
        // console.log('doc_add: ')
        this.data.push(change.doc);
      }

    }

  }
  // numberOfRecords() {
  //   return new Promise(resolve => {
  //     this.db.allDocs({
  //       include_docs: false
  //     }).then((result) => {
  //       let numOfRows: number = result.rows.length
  //       console.log(numOfRows);
  //       this.numOfRec = numOfRows;
  //       resolve(numOfRows)
  //     }).catch((error) => {

  //       console.log(error);

  //     });

  //   });
  // }

  numberOfRecords() {
    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: false
      }).then((result) => {
        let numOfRows: number = result.rows.length
        //console.log(numOfRows);
        //this.numOfRec = numOfRows;
        this.zone.run(() => this.numOfRec.next(numOfRows));
        //this.numOfRec.next(numOfRows)
        resolve(numOfRows)
      }).catch((error) => {

        console.log(error);

      });

    });
  }
  sprav_view = function (doc, emit) {
    if (!doc.fam) doc.fam = "";
    if (!doc.name) doc.name = "";
    if (!doc.otch) doc.otch = "";
    emit(doc.n_pp, {
      "n_pp": doc.n_pp,
      "kod": doc.kod,
      "im_mo": doc.im_mo,
      "f_sob": doc.f_sob,
      "im_uz": doc.im_uz,
      "dolgn": doc.dolgn,
      "FIO": doc.fam + " " + doc.name + " " + doc.otch,
      //"fam" : doc.fam,
      //"name" : doc.name,
      //"otch" : doc.otch,
      "sot_tlph": doc.sot_tlph,
      "rab_tlph": doc.rab_tlph
    });
  };

}