import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { Subscription } from 'rxjs';
import { DateService } from 'app/shared/services/date.service';
import { json2csv } from 'json-2-csv';
import { ToastrService } from 'ngx-toastr';

@Component({
    standalone: false,
    selector: 'app-datamanagement',
    templateUrl: './datamanagement.component.html',
    styleUrls: ['./datamanagement.component.scss'],
    providers: [RaitoService]
})

export class DataManagementComponent implements OnInit{

  data: any = [];
  loadedData: boolean = false;
  loadedData2: boolean = false;
  private subscription: Subscription = new Subscription();
  private msgDownload: string;

  constructor(public translate: TranslateService, private raitoService: RaitoService, private dateService: DateService, public toastr: ToastrService){

  }

  ngOnInit() {
    this.translate.get('generics.Download').subscribe((res: string) => {
      this.msgDownload=res;
    });
  }

  extractFhir(){
    this.loadedData = true;
    this.subscription.add( this.raitoService.getPatients()
    .subscribe( (res : any) => {
          var json = JSON.stringify(res);
          var blob = new Blob([json], {type: "application/json"});
          var url  = URL.createObjectURL(blob);
          var p = document.createElement('p');
          var t = document.createTextNode(this.msgDownload+":");
          p.appendChild(t);
          document.getElementById('content').appendChild(p);
  
          var a = document.createElement('a');
          var dateNow = new Date();
          var stringDateNow = this.dateService.transformDate(dateNow);
          a.download    = "dataRaito_fhir_"+stringDateNow+".json";
          a.target     = "_blank";
          a.href        = url;
          a.textContent = "dataRaito_fhir_"+stringDateNow+".json";
          a.setAttribute("id", "download")
  
          document.getElementById('content').appendChild(a);
          document.getElementById("download").click();
          this.loadedData = false;
     }, (err) => {
       console.log(err);
       this.toastr.info('No data');
       this.loadedData = false;
     }));
  }

  extractCSV(){
    this.loadedData2 = true;
    this.subscription.add( this.raitoService.getPatients()
    .subscribe( (res : any) => {
      console.log(res);
      var tempRes = JSON.parse(JSON.stringify(res));
      this.loadedData2 = false;
      var patients = [];
      for(var i=0;i<tempRes.length;i++){
        var entries = [];
        for(var j=0;j<tempRes[i].result.entry.length;j++){
          if(tempRes[i].result.entry[j].resource.resourceType=='Patient'){
            patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, name:tempRes[i].result.entry[j].resource.name.given[0], gender: tempRes[i].result.entry[j].resource.gender, birthDate: tempRes[i].result.entry[j].resource.birthDate})
          }
          if(tempRes[i].result.entry[j].resource.resourceType=='Condition'){
            patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, value:tempRes[i].result.entry[j].resource.code.text})
          }
          if(tempRes[i].result.entry[j].resource.resourceType=='MedicationStatement'){
            patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, value:tempRes[i].result.entry[j].resource.contained[0].code.coding[0].display,dosage:tempRes[i].result.entry[j].resource.dosage[0].text+' mg/day', start: tempRes[i].result.entry[j].resource.effectivePeriod.start, end: tempRes[i].result.entry[j].resource.effectivePeriod.end})
          }
          if(tempRes[i].result.entry[j].resource.resourceType=='Observation'){
            if(tempRes[i].result.entry[j].resource.code.text=='Phenotype'){
              patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, category:tempRes[i].result.entry[j].resource.code.text, value:tempRes[i].result.entry[j].resource.valueString, date: tempRes[i].result.entry[j].resource.effectiveDateTime})
            }
            if(tempRes[i].result.entry[j].resource.code.text=='Feel'){
              patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, category:tempRes[i].result.entry[j].resource.code.text, value:tempRes[i].result.entry[j].resource.valueQuantity.value+' AVG', date: tempRes[i].result.entry[j].resource.effectiveDateTime, note:tempRes[i].result.entry[j].resource.note})
            }
            if(tempRes[i].result.entry[j].resource.code.text.indexOf('Seizure - ')!=-1){
              patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, category:tempRes[i].result.entry[j].resource.code.text, value:tempRes[i].result.entry[j].resource.valueQuantity.value+' Seconds', date: tempRes[i].result.entry[j].resource.effectiveDateTime, note:tempRes[i].result.entry[j].resource.note})
            }
            if(tempRes[i].result.entry[j].resource.code.text=='Weight'){
              patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, category:tempRes[i].result.entry[j].resource.code.text, value:tempRes[i].result.entry[j].resource.valueQuantity.value+' kg', date: tempRes[i].result.entry[j].resource.effectiveDateTime})
            }
            if(tempRes[i].result.entry[j].resource.code.text=='Body height'){
              patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, category:tempRes[i].result.entry[j].resource.code.text, value:tempRes[i].result.entry[j].resource.valueQuantity.value+' cm', date: tempRes[i].result.entry[j].resource.effectiveDateTime})
            }
          }
          if(tempRes[i].result.entry[j].resource.resourceType=='QuestionnaireResponse'){
            patients.push({patientId:tempRes[i].patientId,resourceType:tempRes[i].result.entry[j].resource.resourceType, id:tempRes[i].result.entry[j].resource.id, value:JSON.stringify(tempRes[i].result.entry[j].resource.item)})
          }
          //entries.push({resourceType:tempRes[i].result.entry[j].resource.resourceType, info: JSON.stringify(tempRes[i].result.entry[j].resource)})
        }
        //patients.push({patientId:tempRes[i].patientId, resources:entries})
      }
      this.createFile(patients);
      
     }, (err) => {
       console.log(err);
       this.toastr.info('No data');
       this.loadedData2 = false;
     }));
  }

  createFile(res){
    try {
      const csv = json2csv(res, {
        expandArrayObjects: true,
        delimiter: { field: ';' },
        excelBOM: true,
        preventCsvInjection: true
      });
      var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    var url  = URL.createObjectURL(blob);
    var p = document.createElement('p');
    document.getElementById('content2').appendChild(p);

    var a = document.createElement('a');
    var dateNow = new Date();
    var stringDateNow = this.dateService.transformDate(dateNow);
    a.download    = "reliefukraine_"+stringDateNow+".csv";
    a.href        = url;
    a.textContent = "reliefukraine_"+stringDateNow+".csv";
    a.setAttribute("id", "download")

    document.getElementById('content2').appendChild(a);
    document.getElementById("download").click();
    } catch (err) {
      console.error('Could not create CSV file', err);
      this.toastr.error('Could not create CSV file');
    }

  }

}
