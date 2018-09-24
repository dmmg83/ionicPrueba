import { Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '@ionic-native/file';

/*
  Generated class for the CreateSqlFileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CreateSqlFileProvider {

  public pkidtiposector: number;
  public codigotiposector: string;
  public nombretiposector: string;
  public tiposectoractivo: number;
  public creaciontiposector: string;
  public modificaciontiposector: string;
  public descripciontiposector: string;

  sectoresData: any[]; //descarga los datos de la REST API

  loading: any;

  private API_URL = 'http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/tiposector/query';
  private TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEwMCwiaWRlbnRpZmljYWNpb24iOjEyMzQsIm5hbWUiOiJBbmRyZXMiLCJzdXJuYW1lIjoiQ2FydmFqYWwiLCJyb2xlcyI6IlJvbCB1c3VhcmlvIiwicnV0YWltYWdlbiI6Ii4uXC93ZWJcL3VwbG9hZHNcLzEwMF91c3VhcmlvXzIwMTgtMDktMTJfMTMtMzYtMjAucG5nIiwicGVybWlzb3MiOiJhOjE4OntzOjI6XCIxMVwiO3M6MTI6XCJQRVJNX0FCT0dBRE9cIjtzOjI6XCIxNFwiO3M6MjQ6XCJQRVJNX0FDVElWSURBRF9DT01FUkNJQUxcIjtzOjI6XCIxOFwiO3M6MTk6XCJQRVJNX0VRVUlQT19DT01QVVRPXCI7czoyOlwiMTZcIjtzOjE5OlwiUEVSTV9FU1BFQ0lFX0FOSU1BTFwiO3M6MjpcIjE1XCI7czoyNzpcIlBFUk1fRVNUQURPX0lORlJBRVNUUlVDVFVSQVwiO3M6MTpcIjZcIjtzOjE3OlwiUEVSTV9QQVJRVUVBREVST1NcIjtzOjE6XCIyXCI7czoxMDpcIlBFUk1fUExBWkFcIjtzOjE6XCI5XCI7czoxMTpcIlBFUk1fUFVFUlRBXCI7czoxOlwiOFwiO3M6MTE6XCJQRVJNX1BVRVNUT1wiO3M6MjpcIjE5XCI7czoyODpcIlBFUk1fUkVDQVVET19QVUVTVE9fRVZFTlRVQUxcIjtzOjE6XCI1XCI7czoxMzpcIlBFUk1fU0VDVE9SRVNcIjtzOjE6XCI3XCI7czoxNjpcIlBFUk1fVElQT19BTklNQUxcIjtzOjI6XCIxMFwiO3M6MjE6XCJQRVJNX1RJUE9fUEFSUVVFQURFUk9cIjtzOjI6XCIxM1wiO3M6MTY6XCJQRVJNX1RJUE9fUFVFU1RPXCI7czoxOlwiM1wiO3M6MTY6XCJQRVJNX1RJUE9fU0VDVE9SXCI7czoyOlwiMTJcIjtzOjE4OlwiUEVSTV9USVBPX1ZFSElDVUxPXCI7czoxOlwiMVwiO3M6MTM6XCJQRVJNX1VTVUFSSU9TXCI7czoxOlwiNFwiO3M6OTpcIlBFUk1fWk9OQVwiO30iLCJtb2R1bG9zIjpbeyJwa2lkbW9kdWxvIjoxMSwibm9tYnJlbW9kdWxvIjoiQWJvZ2Fkb3MiLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoic3VwZXJ2aXNlZF91c2VyX2NpcmNsZSIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX0FCT0dBRE8ifSx7InBraWRtb2R1bG8iOjE0LCJub21icmVtb2R1bG8iOiJBY3RpdmlkYWQgQ29tZXJjaWFsIiwibW9kdWxvYWN0aXZvIjp0cnVlLCJpY29ubyI6InN3YXBfaG9yaXoiLCJub21icmVwZXJtaXNvIjoiUEVSTV9BQ1RJVklEQURfQ09NRVJDSUFMIn0seyJwa2lkbW9kdWxvIjoxOCwibm9tYnJlbW9kdWxvIjoiRXF1aXBvcyBkZSBjb21wdXRvIiwibW9kdWxvYWN0aXZvIjp0cnVlLCJpY29ubyI6ImNvbXB1dGVyIiwibm9tYnJlcGVybWlzbyI6IlBFUk1fRVFVSVBPX0NPTVBVVE8ifSx7InBraWRtb2R1bG8iOjE2LCJub21icmVtb2R1bG8iOiJFc3BlY2llIGRlIEFuaW1hbCIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJwZXRzIiwibm9tYnJlcGVybWlzbyI6IlBFUk1fRVNQRUNJRV9BTklNQUwifSx7InBraWRtb2R1bG8iOjE1LCJub21icmVtb2R1bG8iOiJFc3RhZG8gSW5mcmFlc3RydWN0dXJhIiwibW9kdWxvYWN0aXZvIjp0cnVlLCJpY29ubyI6ImJhbGxvdCIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX0VTVEFET19JTkZSQUVTVFJVQ1RVUkEifSx7InBraWRtb2R1bG8iOjYsIm5vbWJyZW1vZHVsbyI6IlBhcnF1ZWFkZXJvcyIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJjb21tdXRlIiwibm9tYnJlcGVybWlzbyI6IlBFUk1fUEFSUVVFQURFUk9TIn0seyJwa2lkbW9kdWxvIjoyLCJub21icmVtb2R1bG8iOiJQbGF6YXMgZGUgbWVyY2FkbyIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJhY2NvdW50X2JhbGFuY2UiLCJub21icmVwZXJtaXNvIjoiUEVSTV9QTEFaQSJ9LHsicGtpZG1vZHVsbyI6OSwibm9tYnJlbW9kdWxvIjoiUHVlcnRhcyIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJtZWV0aW5nX3Jvb20iLCJub21icmVwZXJtaXNvIjoiUEVSTV9QVUVSVEEifSx7InBraWRtb2R1bG8iOjgsIm5vbWJyZW1vZHVsbyI6IlB1ZXN0b3MiLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoibG9jYWxfY29udmVuaWVuY2Vfc3RvcmUiLCJub21icmVwZXJtaXNvIjoiUEVSTV9QVUVTVE8ifSx7InBraWRtb2R1bG8iOjE5LCJub21icmVtb2R1bG8iOiJSZXBvcnRlIHB1ZXN0byBldmVudHVhbCIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJjcmVkaXRfY2FyZCIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1JFQ0FVRE9fUFVFU1RPX0VWRU5UVUFMIn0seyJwa2lkbW9kdWxvIjo1LCJub21icmVtb2R1bG8iOiJTZWN0b3JlcyIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJidXNpbmVzcyIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1NFQ1RPUkVTIn0seyJwa2lkbW9kdWxvIjo3LCJub21icmVtb2R1bG8iOiJUaXBvcyBkZSBhbmltYWwiLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoicGV0cyIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1RJUE9fQU5JTUFMIn0seyJwa2lkbW9kdWxvIjoxMCwibm9tYnJlbW9kdWxvIjoiVGlwb3MgZGUgUGFycXVlYWRlcm8iLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoibnVsbCIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1RJUE9fUEFSUVVFQURFUk8ifSx7InBraWRtb2R1bG8iOjEzLCJub21icmVtb2R1bG8iOiJUaXBvcyBkZSBQdWVzdG8iLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoidHJhbnNmZXJfd2l0aGluX2Ffc3RhdGlvbiIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1RJUE9fUFVFU1RPIn0seyJwa2lkbW9kdWxvIjozLCJub21icmVtb2R1bG8iOiJUaXBvcyBkZSBTZWN0b3IiLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoibG9jYXRpb25fY2l0eSIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1RJUE9fU0VDVE9SIn0seyJwa2lkbW9kdWxvIjoxMiwibm9tYnJlbW9kdWxvIjoiVGlwb3MgZGUgVmVoaWN1bG8iLCJtb2R1bG9hY3Rpdm8iOnRydWUsImljb25vIjoiZGlyZWN0aW9uc19jYXIiLCJub21icmVwZXJtaXNvIjoiUEVSTV9USVBPX1ZFSElDVUxPIn0seyJwa2lkbW9kdWxvIjoxLCJub21icmVtb2R1bG8iOiJVc3VhcmlvcyB5IFJvbGVzIiwibW9kdWxvYWN0aXZvIjp0cnVlLCJpY29ubyI6InBlcnNvbiIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1VTVUFSSU9TIn0seyJwa2lkbW9kdWxvIjo0LCJub21icmVtb2R1bG8iOiJab25hcyIsIm1vZHVsb2FjdGl2byI6dHJ1ZSwiaWNvbm8iOiJzdG9yZV9tYWxsX2RpcmVjdG9yeSIsIm5vbWJyZXBlcm1pc28iOiJQRVJNX1pPTkEifV0sImlhdCI6MTUzNzIxOTU0NSwiZXhwIjoxNTM3ODI0MzQ1fQ.G0uV7K_OQhpccXMQMT3HuyU2FqiAqkgwNnEXPoGaVBE';

  public sql_tipoSectores: string[] = [];
  public sql_tabla_tipoSectores = 'CREATE TABLE IF NOT EXISTS tsector (id INTEGER PRIMARY KEY AUTOINCREMENT,pkidtiposector TEXT,codigotiposector TEXT,nombretiposector TEXT, tiposectoractivo TEXT, creaciontiposector TEXT, modificaciontiposector TEXT, descripciontiposector TEXT);'


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public events: Events,
    public loadingCtrl: LoadingController,
    private file: File

  ) {
    console.log('Hello CreateSqlFileProvider Provider');
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TipoSectorPage');
  }

  //Descarga sectores del REST API
  loadSectores() {
    this.setOcupado('Descargando datos...');
    let datos = 'authorization=' + this.TOKEN;
    return new Promise(resolve => {
      this.http.post(this.API_URL, datos, { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) })
        .subscribe(data => {
          //console.log("AQUI: " + data.tiposector[2].pkidtiposector);
          resolve(data);
          this.setDesocupado();

        }, error => {
          console.error(error);
        });
    });
  }

  //Trae los datos desde el API con (loadSectores();), 
  //los guarda en la variable sql_tipoSector 
  //y posteriormente crea el archivo RecaudoDB.sql el cual contiene la creación y los insert de la tabla tipo sector
  getSectoresApi() {

    this.loadSectores().then(
      async (res) => {
        this.sectoresData = res['tiposector'];

        let ContadorLongitud = this.sectoresData.length;
        console.log("Longitud: " + ContadorLongitud);

        for (let i = 0; i < this.sectoresData.length; i++) {
          this.pkidtiposector = this.sectoresData[i].pkidtiposector;
          this.codigotiposector = this.sectoresData[i].codigotiposector;
          this.nombretiposector = this.sectoresData[i].nombretiposector;
          this.tiposectoractivo = this.sectoresData[i].tiposectoractivo;
          this.creaciontiposector = this.sectoresData[i].creaciontiposector;
          this.modificaciontiposector = this.sectoresData[i].modificaciontiposector;
          this.descripciontiposector = this.sectoresData[i].descripciontiposector;

          this.sql_tipoSectores.push("INSERT INTO tsector ( pkidtiposector, codigotiposector, nombretiposector, tiposectoractivo, creaciontiposector, modificaciontiposector, descripciontiposector ) VALUES (" +
            (this.pkidtiposector = this.sectoresData[i].pkidtiposector) + ', ' +
            (this.codigotiposector = this.sectoresData[i].codigotiposector) + ', ' +
            (this.nombretiposector = this.sectoresData[i].nombretiposector) + ', ' +
            (this.tiposectoractivo = this.sectoresData[i].tiposectoractivo) + ', ' +
            (this.creaciontiposector = this.sectoresData[i].creaciontiposector) + ', ' +
            (this.modificaciontiposector = this.sectoresData[i].modificaciontiposector) + ', ' +
            (this.descripciontiposector = this.sectoresData[i].descripciontiposector) + "); \n");



          /*console.log("INSERT INTO tsector ( pkidtiposector, codigotiposector, nombretiposector, tiposectoractivo, creaciontiposector, modificaciontiposector, descripciontiposector ) VALUES (" +
            parseInt(this.pkidtiposector = this.sectoresData[i].pkidtiposector) + ', ' +
            (this.codigotiposector = this.sectoresData[i].codigotiposector) + ', ' +
            (this.nombretiposector = this.sectoresData[i].nombretiposector) + ', ' +
            (this.tiposectoractivo = this.sectoresData[i].tiposectoractivo) + ', ' +
            (this.creaciontiposector = this.sectoresData[i].creaciontiposector) + ', ' +
            (this.modificaciontiposector = this.sectoresData[i].modificaciontiposector) + ', ' +
            (this.descripciontiposector = this.sectoresData[i].descripciontiposector) + ");"
          );*/

        }

        //Crea el archivo RecaudoDB.sql
        this.file.writeFile(this.file.externalDataDirectory, 'RecaudoDB.sql', '' + this.sql_tabla_tipoSectores + '\n' + this.sql_tipoSectores, { replace: true })
          .then(data => {
            console.log("Archivo RecaudoBD.sql creado");
          })
          .catch((err) => {
            console.error("Error al crear el archivo" + err);
          });

        console.log("ESTE ES EL SQL: " + this.sql_tipoSectores)

      }, (error) => {
        console.error("Error al descargar sectores " + error);
      })
  }

}
