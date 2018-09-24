import { Injectable } from '@angular/core';
import { Platform, LoadingController, Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import jsSHA from 'jssha'
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  loading: any;
  private bdActual: string = "bd1.db"

  url_file: string = this.file.externalRootDirectory + '/Download/';

  constructor(
    public sqlitePorter: SQLitePorter,
    private storage: Storage,
    private sqlite: SQLite,
    private platform: Platform,
    private http: Http,
    private file: File,
    public events: Events,
    public loadingCtrl: LoadingController
  ) {
    this.platform.ready().then(() => {
      this.storage.get('BDACTIVA').then(val => {
        if (val) {
          this.bdActual = val;
        }
        console.log("val" + val);

        this.crearBD();
      }).catch(() => {
        console.error("error val");

      });
    });
    // this.crearBD();

  }

  private crearBD() {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.bdActual,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = null;
          this.database = db;
          this.storage.set('BDACTIVA', this.bdActual);
          this.crearEstructura();
        }, (error => {
          console.log("Error (1) " + error.message);
        }));
    });
  }

  setOcupado(mensaje: string = 'cargando') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });

    this.loading.present();

  }

  setDesocupado() {
    this.loading.dismiss();
  }

  //Llena la base de datos
  fillDatabase(sql: string = null) {
    this.setOcupado('Importando BD');
    
    if (sql != null) {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
          console.log("terminó de importar");
          this.setDesocupado();
        })
        .catch(e => { console.error("Error en la Importación " + e.message) });
    }
  }



  //Inserta registros a la bd
  addDeveloper(pkidtiposector, codigotiposector, nombretiposector, tiposectoractivo, creaciontiposector, modificaciontiposector, descripciontiposector) {
    let data = [pkidtiposector, codigotiposector, nombretiposector, tiposectoractivo, creaciontiposector, modificaciontiposector, descripciontiposector]
    return this.database.executeSql("INSERT INTO tsector (pkidtiposector, codigotiposector, nombretiposector, tiposectoractivo, creaciontiposector, modificaciontiposector, descripciontiposector) VALUES (?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err.message);
      return err;
    });
  }

  //Selecciona los registros existentes
  getAllDevelopers() {
    return this.database.executeSql("SELECT * FROM tsector", []).then((data) => {
      this.setOcupado('Listando Datos Importados');
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({ pkidtiposector: data.rows.item(i).pkidtiposector, codigotiposector: data.rows.item(i).codigotiposector, nombretiposector: data.rows.item(i).nombretiposector, tiposectoractivo: data.rows.item(i).tiposectoractivo, creaciontiposector: data.rows.item(i).creaciontiposector, modificaciontiposector: data.rows.item(i).modificaciontiposector, descripciontiposector: data.rows.item(i).descripciontiposector });
        }
        console.log("N° Registros: " + data.rows.length);
      }
      this.setDesocupado();
      return developers;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

  //Check al estado de la bd
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }



  backup() {
    this.platform.ready().then(() => {
      this.database.abortallPendingTransactions();
      this.database.close().then(() => {
        console.info("bdActual: ", this.bdActual);

        this.bdActual = this.bdActual == "bd1.db" ? "bd2.db" : "bd1.db";
        console.info("bdActual despues: ", this.bdActual);
        this.sqlite.deleteDatabase({
          name: this.bdActual,
          location: 'default'
        }).then(() => {
          console.log("borrada");

          this.crearBD();
        }).catch((e) => {
          console.log("se creara el backup");
          this.crearBD();

        });

      });
    });
  }



  restore() {
    this.platform.ready().then(() => {
      this.database.abortallPendingTransactions();
      this.database.close().then(() => {
        console.info("bdActual: ", this.bdActual);

        this.bdActual = this.bdActual == "bd1.db" ? "bd2.db" : "bd1.db";
        console.info("bdActual despues: ", this.bdActual);
        this.crearBD();

      });
    });
  }

  crearEstructura() {
    this.http.get('assets/tablaTipoSector.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            console.log("estructura creada");
            
          })
          .catch(e => console.error(e));
      });
  }

}
