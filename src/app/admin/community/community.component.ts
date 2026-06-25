import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { DateService } from 'app/shared/services/date.service';
import { Apif29BioService } from 'app/shared/services/api-f29bio.service';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {Observable, of, fromEvent, OperatorFunction} from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { SortService } from 'app/shared/services/sort.service';
import { SearchService } from 'app/shared/services/search.service';
import * as chartsData from 'app/shared/configs/general-charts.config';
import { ColorHelper, ScaleType } from '@swimlane/ngx-charts';
import Swal from 'sweetalert2';
import { jsPDFService } from 'app/shared/services/jsPDF.service'
import { ApiDx29ServerService } from 'app/shared/services/api-dx29-server.service';
import { Subscription } from 'rxjs';
declare let html2canvas: any;

@Component({
    standalone: false,
    selector: 'app-community',
    templateUrl: './community.component.html',
    styleUrls: ['./community.component.scss'],
    providers: [RaitoService, Apif29BioService, jsPDFService, ApiDx29ServerService]
})

export class CommunityComponent implements OnInit, OnDestroy{

  patients: any = [];
  loadedUsers: boolean = false;
  loading: boolean = false;
  modalReference: NgbModalRef;
  actualPatient: any= [];
  selectedPatient: any= [];
  step = 0;
  showButtonScroll: boolean = false;
  lang: string = 'en';
  private subscription: Subscription = new Subscription();
  private eventSubscription: Subscription = new Subscription();
  modalProfileReference: NgbModalRef;

  recommendedDoses: any = [];
  medications: any = [];
  actualMedications: any;
  private group: string;
  private groupName: string;
  timeformat = "";
  private msgDownload: string;
  private tittleExportData: string;
  private msgDataSavedOk: string;
  private msgDataSavedFail: string;
  private titleDose: string;
  private titleDrugsVsNormalized: string;
   titleDrugsVsDrugs: string;
   private titleDrugsVsNoNormalized: string;
   private transWeight: string;
   private msgDate: string;
   titleSeizuresLegend = [];
   yAxisTicksSeizures = [];
   private titleSeizures: string;
   yAxisLabelRight: string;
   loadingDataGroup: boolean = false;
   dataGroup: any;
  drugsLang: any;
  rangeDate: string = 'month';
  groupBy: string = 'Months';
  minDateRange = new Date();
  xAxisTicks = [];
  loadedFeels: boolean = false;
  loadedEvents: boolean = false;
  loadedDrugs: boolean = false;
  feels: any = [];
  events: any = [];
//Chart Data
lineChartSeizures = [];
lineChartHeight = [];
lineChartDrugs = [];
lineChartDrugsCopy = [];
lineDrugsVsSeizures = [];
//Line Charts

lineChartView: any[] = chartsData.lineChartView;

// options
lineChartShowXAxis = chartsData.lineChartShowXAxis;
lineChartShowYAxis = chartsData.lineChartShowYAxis;
lineChartGradient = chartsData.lineChartGradient;
lineChartShowLegend = chartsData.lineChartShowLegend;
lineChartShowXAxisLabel = chartsData.lineChartShowXAxisLabel;
lineChartShowYAxisLabel = chartsData.lineChartShowYAxisLabel;

lineChartColorScheme = chartsData.lineChartColorScheme;
lineChartOneColorScheme = chartsData.lineChartOneColorScheme;
lineChartOneColorScheme2 = chartsData.lineChartOneColorScheme2;

// line, area
lineChartAutoScale = chartsData.lineChartAutoScale;
lineChartLineInterpolation = chartsData.lineChartLineInterpolation;


//Bar Charts
 barChartView: any[] = chartsData.barChartView;

 // options
 barChartShowYAxis = chartsData.barChartShowYAxis;
 barChartShowXAxis = chartsData.barChartShowXAxis;
 barChartGradient = chartsData.barChartGradient;
 barChartShowLegend = chartsData.barChartShowLegend;
 barChartShowXAxisLabel = chartsData.barChartShowXAxisLabel;
 barChartXAxisLabel = chartsData.barChartXAxisLabel;
 barChartShowYAxisLabel = chartsData.barChartShowYAxisLabel;
 barChartYAxisLabel = chartsData.barChartYAxisLabel;
 barChartColorScheme = chartsData.barChartColorScheme;
 formatDate: any = [];
 maxValue: number = 0;
maxValueDrugsVsSeizu: number = 0;
normalized: boolean = true;
normalized2: boolean = true;
 yAxisTicksDrugs = [];
 //lastchart
showXAxis = false;
showYAxis = true;
gradient = false;
showLegend = false;
legendTitle = 'Legend';
legendPosition = 'right';
showXAxisLabel = false;
xAxisLabel = 'Country';
showYAxisLabel = true;
yAxisLabel = 'Seizures';
showGridLines = true;
animations: boolean = true;
barChart: any[] = barChart;
lineChartSeries: any[] = lineChartSeries;
lineChartScheme = {
  name: 'coolthree',
  selectable: true,
  group: 'Ordinal',
  domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
};

comboBarScheme = {
  name: 'singleLightBlue',
  selectable: true,
  group: 'Ordinal',
  domain: this.lineChartOneColorScheme2.domain
};
showRightYAxisLabel: boolean = true;
generatingPDF: boolean = false;
loadingPDF: boolean = false;

exportOptions: any = {
  seizures:false,
  drugs:false
}

public chartNames: string[];
public colors: ColorHelper;
public colors2: ColorHelper;
public colorsLineToll: ColorHelper;
age: number = null;
weight: string;
rangeResourcesDate: any = {};
rangeResourcesDateDefault={
  "data":{
      "drugs":{
          "daysToUpdate":180
      },
      "phenotypes":{
          "daysToUpdate":180
      },
      "feels":{
          "daysToUpdate":30
      },
      "seizures":{
          "daysToUpdate":30
      },
      "weight": {
          "daysToUpdate":180
      },
      "height":{
          "daysToUpdate":180
      }
  },    
  "meta":{
      "id":""
  }
}

meses: any = 
[
  {id: 1, es: 'Enero', en: 'January'},
  {id: 2, es: 'Febrero', en: 'February'},
  {id: 3, es: 'Marzo', en: 'March'},
  {id: 4, es: 'Abril', en: 'April'},
  {id: 5, es: 'Mayo', en: 'May'},
  {id: 6, es: 'Junio', en: 'June'},
  {id: 7, es: 'Julio', en: 'July'},
  {id: 8, es: 'Agosto', en: 'August'},
  {id: 9, es: 'Septiembre', en: 'September'},
  {id: 10, es: 'Octubre', en: 'October'},
  {id: 11, es: 'Noviembre', en: 'November'},
  {id: 12, es: 'Diciembre', en: 'December'}
];
  
  constructor(public translate: TranslateService, private raitoService: RaitoService, private dateService: DateService, private modalService: NgbModal, private apif29BioService: Apif29BioService, private adapter: DateAdapter<any>, private sortService: SortService,  private searchService: SearchService, public jsPDFService: jsPDFService, private apiDx29ServerService: ApiDx29ServerService){

  }

  ngOnInit() {
    this.lang = sessionStorage.getItem('lang');
    this.loadGroupFile();

    this.subscription.add(this.raitoService.getOnlyPatients(true).subscribe(
      data => {
        this.patients = data;

        for (var index in this.patients) {
          if(this.patients[index].result.entry[0].resource.birthDate !=null){
            this.patients[index].result.entry[0].resource.age = this.ageFromDateOfBirthday(this.patients[index].result.entry[0].resource.birthDate);
          }else{
            this.patients[index].result.entry[0].resource.age = null;
          }
          this.patients[index].metaInfo=this.calculateColorMetaInfo(this.patients[index].metaInfo)
        }
        this.loadedUsers = true;
      }
    ));

    this.eventSubscription = fromEvent(window, "scroll").subscribe(e => {
      if($('#tabspills')){
          console.log($('#tabspills').height())
          if($('#tabspills').height()>720){
              this.showButtonScroll = true;
          }else{
              this.showButtonScroll = false;
          }
      }
      //console.log(window.innerHeight);
    });
  }

  loadGroupFile(){
      this.subscription.add(this.raitoService.getGroupFile().subscribe((data : any) => {
        console.log(data);
          this.rangeResourcesDate = data;
      }, (err) => {
        console.log(err);
        this.rangeResourcesDate = this.rangeResourcesDateDefault;
      }
      ));
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ageFromDateOfBirthday(dateOfBirth: any){
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    var months;
    months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    var age =0;
    if(months>0){
      age = Math.floor(months/12)
    }
    var res = months <= 0 ? 0 : months;
    var m=res % 12;
    return {years:age, months:m }
  }

  calculateColorMetaInfo(metaInfo){
    for (var index in metaInfo) {
      var lastDate = new Date(metaInfo[index].date);
      var actualDate = new Date();
      var pastDate=new Date(actualDate);
      if(this.rangeResourcesDate.data[index]!=undefined){
        pastDate.setDate(pastDate.getDate() - this.rangeResourcesDate.data[index].daysToUpdate);
      }else{
        pastDate = lastDate;
      }
      if(metaInfo[index][index]==0){
        metaInfo[index].color='danger';
      }else if(lastDate<pastDate){
        metaInfo[index].color='danger';
      }else{
        metaInfo[index].color='success';
      }
    }
    return metaInfo;
  }


  viewPatient(patientId, contentModalPatient){
    this.loading = true;
    this.subscription.add( this.raitoService.getPatient(patientId)
    .subscribe( (res : any) => {
      console.log(res);
      this.actualPatient.resume = {};
      this.actualPatient.condition = {};
      this.actualPatient.drugs = [];
      this.actualPatient.questionnaires = [];
      this.actualPatient.phenotypes = [];
      this.actualPatient.seizures = [];
      this.actualPatient.feels = [];
      this.actualPatient.weights = [];
      this.actualPatient.heights = [];
      for(var index in res.result.entry){
        console.log(res.result.entry[index].resource.resourceType);
        if(res.result.entry[index].resource.resourceType=='Patient'){
          this.actualPatient.resume = res.result.entry[index];
          if(this.actualPatient.resume.resource.birthDate !=null){
            this.actualPatient.resume.resource.age = this.ageFromDateOfBirthday(this.actualPatient.resume.resource.birthDate);
          }
        }
        if(res.result.entry[index].resource.resourceType=='Condition'){
          this.actualPatient.condition = res.result.entry[index];
        }
        if(res.result.entry[index].resource.resourceType=='MedicationStatement'){
          this.actualPatient.drugs.push(res.result.entry[index]);
        }
        if(res.result.entry[index].resource.resourceType=='QuestionnaireResponse'){
          this.actualPatient.questionnaires.push(res.result.entry[index]);
        }
        if(res.result.entry[index].resource.resourceType=='Observation'){
          if(res.result.entry[index].resource.code.text=='Phenotype'){
            this.actualPatient.phenotypes.push(res.result.entry[index]);
          }
          if(res.result.entry[index].resource.code.text.indexOf('Seizure - ')!=-1){
            this.actualPatient.seizures.push(res.result.entry[index]);
          }
          if(res.result.entry[index].resource.code.text=='Feel'){
            this.actualPatient.feels.push(res.result.entry[index]);
          }
          if(res.result.entry[index].resource.code.text=='Weight'){
            this.actualPatient.weights.push(res.result.entry[index]);
          }
          if(res.result.entry[index].resource.code.text=='Body height'){
            this.actualPatient.heights.push(res.result.entry[index]);
          }
        }
        
      }

      if(this.actualPatient.phenotypes.length>0){
        this.getHpoCodes();
      }

      console.log(this.actualPatient);
      //this.actualPatient = res;
      if(this.modalReference!=undefined){
        this.modalReference.close();
      }
      let ngbModalOptions: NgbModalOptions = {
            backdrop : 'static',
            keyboard : false,
            windowClass: 'ModalClass-xl'
      };
      this.modalReference = this.modalService.open(contentModalPatient, ngbModalOptions);
      this.loading = false;
     }, (err) => {
       console.log(err);
       this.loading = false;
     }));
  }

  getHpoCodes(){
    var hposStrins = [];

    for(var i=0;i<this.actualPatient.phenotypes.length;i++){
      hposStrins.push(this.actualPatient.phenotypes[i].resource.valueString);
    }

    if (hposStrins.length >0) {
      this.callGetInfoSymptoms(hposStrins);
    }
  }
  
  callGetInfoSymptoms(hposStrins) {
    var lang = this.lang;
    this.subscription.add(this.apif29BioService.getInfoOfSymptoms(lang, hposStrins)
        .subscribe((res: any) => {
            var tamano = Object.keys(res).length;
            if (tamano > 0) {
                for (var i in res) {
                    for (var j = 0; j < this.actualPatient.phenotypes.length; j++) {
                        if (res[i].id == this.actualPatient.phenotypes[j].resource.valueString) {
                          this.actualPatient.phenotypes[j].resource.name = res[i].name;
                          this.actualPatient.phenotypes[j].resource.def = res[i].desc;
                          this.actualPatient.phenotypes[j].resource.synonyms = res[i].synonyms;
                          this.actualPatient.phenotypes[j].resource.comment = res[i].comment;
                        }
                    }
                }
                //this.temporalSymptoms.sort(this.sortService.GetSortOrder("name"));
            }
        }, (err) => {
            console.log(err);
        }));
  }

  closeModal() {
    if (this.modalReference != undefined) {
        this.modalReference.close();
        this.modalReference = undefined;
    }
  }

  reset(){
    this.generatingPDF = false;
    this.rangeDate = 'month'
    this.selectedPatient = [];
    this.feels = [];
    this.lineChartHeight = []
    this.events = [];
    this.lineChartSeizures = [];
    this.lineChartDrugs = [];
    this.lineChartDrugsCopy = [];
    this.medications = [];
  }

  download(patientId){
    this.loading = true;
    this.subscription.add( this.raitoService.getPatient(patientId)
    .subscribe( (res : any) => {
          var json = JSON.stringify(res.result);
          var blob = new Blob([json], {type: "application/json"});
          var url  = URL.createObjectURL(blob);
          var p = document.createElement('p');
          document.getElementById('content').appendChild(p);
  
          var a = document.createElement('a');
          var dateNow = new Date();
          var stringDateNow = this.dateService.transformDate(dateNow);
          a.download    = "dataRaito_fhir_"+patientId+'_'+stringDateNow+".json";
          a.target     = "_blank";
          a.href        = url;
          a.textContent = "dataRaito_fhir_"+patientId+'_'+stringDateNow+".json";
          a.setAttribute("id", "download")
  
          document.getElementById('content').appendChild(a);
          document.getElementById("download").click();
          this.loading = false;
     }, (err) => {
       console.log(err);
       this.loading = false;
     }));
  }

  setStep(index: number) {
    this.step = index;
  }

  goTopTabs(){
    document.getElementById('inittabs').scrollIntoView(true);
  }

  closeModalProfile() {
    if (this.modalProfileReference != undefined) {
      this.modalProfileReference.close();
      this.modalProfileReference = undefined;
      this.reset();
    }
  }

  viewPatient2(patientId, pdfPanel){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'ModalClass-sm'// xl, lg, sm
  };
    this.modalProfileReference = this.modalService.open(pdfPanel, ngbModalOptions);
    this.initEnvironment(patientId);
  }

  initEnvironment(patientId){
    this.subscription.add( this.raitoService.loadPatientId(patientId)
    .subscribe( (res : any) => {
      console.log(res);
      this.selectedPatient = res.patient;
      this.selectedPatient.id = patientId;
      this.loadRecommendedDose();
      this.loadEnvironment();
    }, (err) => {
      console.log(err);
      this.loading = false;
    }));
  }

  loadRecommendedDose() {
    this.recommendedDoses = [];
    this.subscription.add( this.raitoService.loadRecommendedDose()
    .subscribe( (res : any) => {
      console.log(res);
      this.recommendedDoses = res;
    }, (err) => {
      console.log(err);
    }));
  
  }

  loadEnvironment() {
    this.medications = [];
    this.actualMedications = [];
    this.group = this.selectedPatient.group;
    this.loadGroups();
  
    this.loadTranslations();
    this.adapter.setLocale(this.lang);
    switch (this.lang) {
      case 'en':
        this.timeformat = "mediumDate";
        break;
      case 'es':
        this.timeformat = "mediumDate";
        break;
      case 'nl':
        this.timeformat = "d-M-yy";
        break;
      default:
        this.timeformat = "M/d/yy";
        break;
  
    }
  
    this.loadTranslationsElements();
  }

  loadGroups() {
    this.subscription.add( this.raitoService.loadGroups()
    .subscribe( (res : any) => {
        console.log(res);
        for (var i = 0; i < res.length; i++) {
          if(this.group==res[i]._id){
            this.groupName = res[i].name;
          }
        }
      }, (err) => {
        console.log(err);
      }));
  }

  //traducir cosas
loadTranslations(){
  this.translate.get('generics.Data saved successfully').subscribe((res: string) => {
    this.msgDataSavedOk=res;
  });
  this.translate.get('generics.Data saved fail').subscribe((res: string) => {
    this.msgDataSavedFail=res;
  });
  this.translate.get('generics.ExportData').subscribe((res: string) => {
    this.tittleExportData=res;
  });
  this.translate.get('generics.Download').subscribe((res: string) => {
    this.msgDownload=res;
  });
  this.translate.get('anthropometry.Weight').subscribe((res: string) => {
    this.transWeight = res;
  });
  this.translate.get('generics.Date').subscribe((res: string) => {
    this.msgDate = res;
  });

  this.translate.get('menu.Seizures').subscribe((res: string) => {
    this.titleSeizures = res;
    var tempTitle = this.titleSeizures+' ('+this.translate.instant("pdf.Vertical bars")+')';
    this.titleSeizuresLegend = [tempTitle]
  });
  this.translate.get('medication.Dose mg').subscribe((res: string) => {
    this.yAxisLabelRight = res;
  });
  this.translate.get('homeraito.Normalized').subscribe((res: string) => {
    this.titleDrugsVsNormalized= res;
    this.titleDose = res;
    this.titleDrugsVsDrugs = this.titleDrugsVsNormalized;
  });
  this.translate.get('homeraito.Not normalized').subscribe((res: string) => {
    this.titleDrugsVsNoNormalized= res;
  });
}

loadTranslationsElements() {
  this.loadingDataGroup = true;
  this.subscription.add( this.raitoService.loadDrugsGroup(this.group)
    .subscribe( (res : any) => {
      if (res.medications.data.length == 0) {
        //no tiene datos sobre el grupo
      } else {
        this.dataGroup = res.medications.data;
        this.drugsLang = [];
        if (this.dataGroup.drugs.length > 0) {
          for (var i = 0; i < this.dataGroup.drugs.length; i++) {
            var found = false;
            for (var j = 0; j < this.dataGroup.drugs[i].translations.length && !found; j++) {
              if (this.dataGroup.drugs[i].translations[j].code == this.lang) {
                if (this.dataGroup.drugs[i].drugsSideEffects != undefined) {
                  this.drugsLang.push({ name: this.dataGroup.drugs[i].name, translation: this.dataGroup.drugs[i].translations[j].name, drugsSideEffects: this.dataGroup.drugs[i].drugsSideEffects });
                } else {
                  this.drugsLang.push({ name: this.dataGroup.drugs[i].name, translation: this.dataGroup.drugs[i].translations[j].name });
                }
                found = true;
              }
            }
          }
          this.drugsLang.sort(this.sortService.GetSortOrder("translation"));
        }
      }
      this.loadingDataGroup = false;
      this.calculateMinDate();
      this.loadData();
      }, (err) => {
        console.log(err);
        this.loadingDataGroup = false;
        this.calculateMinDate();
        this.loadData();
      }));

}

  calculateMinDate(){
    var period = 31;
    if(this.rangeDate == 'quarter'){
      period = 90;
    }else if(this.rangeDate == 'year'){
      period = 365;
    }
    var actualDate = new Date();
    var pastDate=new Date(actualDate);
    pastDate.setDate(pastDate.getDate() - period);
    this.minDateRange = pastDate;

    var actualDate1=new Date();
    var pastDate1=new Date(actualDate1);
    pastDate1.setDate(pastDate1.getDate() - Math.round((period+1)/2));
    var mediumDate = pastDate1;
    this.xAxisTicks = [this.minDateRange.toISOString(),mediumDate.toISOString(),actualDate.toISOString()];
  }

  loadDataRangeDate(rangeDate) {
    this.loadedDrugs = false;
    this.rangeDate = rangeDate;
    this.calculateMinDate();
    this.normalized = true;
    this.normalized2 = true;
    this.loadData();
  }

  changeGroupBy(groupBy) {
    this.groupBy = groupBy;
    this.loadDataRangeDate(this.rangeDate);
  }

  loadData() {
    //cargar los datos del usuario
    this.loadedFeels = false;
    this.getFeels();
    this.getSeizures();
    this.calculateMinDate();
    this.getWeightAndAge();
  }

  getWeightAndAge() {
    if(this.selectedPatient.birthDate == null){
      this.age = null;
    }else{
      this.ageFromDateOfBirthday(this.selectedPatient.birthDate);
    }
    this.subscription.add( this.raitoService.getPatientWeight(this.selectedPatient.id)
    .subscribe( (res : any) => {
        console.log(res);
        if (res.message == 'There are no weight') {
        }else if(res.message == 'old weight'){
          console.log(res.weight)
          this.weight = res.weight.value
        }else{
          this.weight = res.weight.value
        }
      }, (err) => {
        console.log(err);
        //this.toastr.error('', this.translate.instant("generics.error try again"));
      }));
  }

  getFeels() {
    this.feels = [];
    var info = {rangeDate: this.rangeDate}
    this.subscription.add( this.raitoService.getFeelsPatient(this.selectedPatient.id, info)
    .subscribe( (resFeels : any) => {
      if (resFeels.message) {
        //no tiene historico de peso
      } else {
        resFeels.feels.sort(this.sortService.DateSortInver("date"));
        this.feels = resFeels.feels;
        
        var datagraphheight = [];
          for (var i = 0; i < this.feels.length; i++) {
            var splitDate = new Date(this.feels[i].date);
            var numAnswers = 0;
            var value = 0;
            if(this.feels[i].a1!=""){
              numAnswers++;
              value = value+parseInt(this.feels[i].a1);
            }
            if(this.feels[i].a2!=""){
              numAnswers++;
              value = value+parseInt(this.feels[i].a2);
            }
            if(this.feels[i].a3!=""){
              numAnswers++;
              value = value+parseInt(this.feels[i].a3);
            }
            var value = value/numAnswers;
            var splitDate = new Date(this.feels[i].date);
            var stringDate = splitDate.toDateString();
            var foundDateIndex = this.searchService.searchIndex(datagraphheight, 'name', splitDate.toDateString());
            if(foundDateIndex != -1){
              //There cannot be two on the same day
              datagraphheight[foundDateIndex].name = splitDate.toDateString();
              datagraphheight[foundDateIndex].value = value;
              datagraphheight[foundDateIndex].splitDate = splitDate;
            }else{
              datagraphheight.push({ value: value, name: splitDate.toDateString(), stringDate: stringDate });
            }
          }
          var result = this.add0Feels(datagraphheight);
          var prevValue = 0;
          for (var i = 0; i < result.length; i++) {
            if(resFeels.old.date){
              if(result[i].value==0 && resFeels.old.date<result[i].stringDate && prevValue==0){
                result[i].value = (parseInt(resFeels.old.a1)+parseInt(resFeels.old.a2)+parseInt(resFeels.old.a3))/3;
              }else if(result[i].value==0 && prevValue!=0){
                result[i].value = prevValue;
              }
              else if(result[i].value!=0){
                prevValue = result[i].value;
              }
            }else{
              if(result[i].value==0 && prevValue!=0){
                result[i].value =prevValue;
              }else if(result[i].value!=0){
                prevValue = result[i].value;
              }
            }
          }
          this.lineChartHeight = [
            {
              "name": 'Feel',
              "series": result
            }
          ];

      }

      this.loadedFeels = true;
      this.generatingPDF = true;
      }, (err) => {
        console.log(err);
        this.loadedFeels = true;
      }));
  }

  add0Feels(datagraphheight){
    var maxDateTemp = new Date();
    var maxDate = maxDateTemp.toDateString();
    
    var minDate = this.minDateRange.toDateString();
    if(datagraphheight[datagraphheight.length-1]!=undefined){
      var splitLastDate = datagraphheight[datagraphheight.length-1].stringDate;
      var splitFirstDate = datagraphheight[0].stringDate;
      if(new Date(splitLastDate)<new Date(maxDate)){
        datagraphheight.push({value: 0,name:maxDate,stringDate:maxDate, types: []})
      }
      if(new Date(minDate)<new Date(splitFirstDate)){
        datagraphheight.push({value: 0,name:minDate,stringDate:minDate, types: []})
      }
    }
    
      var copydatagraphheight = JSON.parse(JSON.stringify(datagraphheight));
      datagraphheight.sort(this.sortService.DateSortInver("stringDate"));
    for (var j = 0; j < datagraphheight.length; j=j+1) {
      var foundDate = false;
      var actualDate = datagraphheight[j].stringDate;
      if(datagraphheight[j+1]!=undefined){
        var nextDate = datagraphheight[j+1].stringDate;
        //stringDate
        for (var k = 0; actualDate != nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copydatagraphheight.push({value: 0,name:actualDate,stringDate:actualDate, types: []})
          }else{
            foundDate = true;
          }
          
        }
        if(datagraphheight[j+2]!=undefined){
        var actualDate = datagraphheight[j+1].stringDate;
        var nextDate = datagraphheight[j+2].stringDate;
        for (var k = 0; actualDate != nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copydatagraphheight.push({value: 0,name:actualDate,stringDate:actualDate, types: []})
          }
          
        }
  
        }
      }
    }
    copydatagraphheight.sort(this.sortService.DateSortInver("stringDate"));
    for (var j = 0; j < copydatagraphheight.length; j++) {
      copydatagraphheight[j].name = copydatagraphheight[j].stringDate
      var theDate = new Date(copydatagraphheight[j].name);
      copydatagraphheight[j].name = this.tickFormattingDay(theDate)
    }
    return copydatagraphheight;
}
  

  getSeizures() {
    this.events = [];
    this.lineChartSeizures = [];
    var info = {rangeDate: this.rangeDate}
    this.subscription.add( this.raitoService.getSeizuresPatient(this.selectedPatient.id, info)
      .subscribe((res: any) => {
        if (res.message) {
          //no tiene información
          this.events = [];
        } else {
          if (res.length > 0) {
            res.sort(this.sortService.DateSortInver("date"));
            res.sort(this.sortService.DateSortInver("start"));
            this.events = res;
            var datagraphseizures = [];
            
            datagraphseizures = this.getStructure2(res);
            var respseizures = this.add0Seizures(datagraphseizures);
            if(this.rangeDate == 'quarter' || this.rangeDate == 'year'){
              respseizures = this.groupPerWeek(respseizures);
            }
            var maxValue = this.getMaxValue(respseizures);
            if(maxValue>1){
              this.yAxisTicksSeizures = [0,Math.round(maxValue/2),maxValue];
            }else{
              this.yAxisTicksSeizures = [0,maxValue];
            }
            this.lineChartSeizures = [
              {
                "name": this.titleSeizures,
                "series": respseizures
              }
            ];
            this.getDrugs();
          } else {
            this.events = [];
            this.getDrugs();
          }
  
        }
        this.loadedEvents = true;
      }, (err) => {
        console.log(err);
        this.loadedEvents = true;
      }));
  }

  getMaxValue(array){
    var max= 0;
    for (var i=0; i < array.length; i++)
    {
      if(max<array[i].value){
        max= array[i].value;
      }
    }
    return max;
  }

  getStructure2(res){
    var datagraphseizures = [];
    for (var i = 0; i < res.length; i++) {
      var splitDate = new Date(res[i].start);
      var type = res[i].type;
      var stringDate = splitDate.toDateString();
      var foundElementIndex = this.searchService.searchIndex(datagraphseizures, 'stringDate', stringDate);
      if (foundElementIndex != -1) {
        datagraphseizures[foundElementIndex].value++;
        var foundElementIndexType = this.searchService.searchIndex(datagraphseizures[foundElementIndex].types, 'types', type);
        if (foundElementIndexType != -1) {
          datagraphseizures[foundElementIndex].types[foundElementIndexType].count++;
        } else {
          datagraphseizures[foundElementIndex].types.push({ type: type, count: 1 });
        }
      } else {
        datagraphseizures.push({ value: 1, name: splitDate, stringDate: stringDate, types: [{ type: type, count: 1 }] });
      }
  
    }
    return datagraphseizures;
  }

  add0Seizures(datagraphseizures){
    //var copydatagraphseizures = JSON.parse(JSON.stringify(datagraphseizures));
    var maxDateTemp = new Date();
    var maxDate = maxDateTemp.toDateString();
    
    var minDate = this.minDateRange.toDateString();
    
    var splitLastDate = datagraphseizures[datagraphseizures.length-1].stringDate;
    var splitFirstDate = datagraphseizures[0].stringDate;
    console.log(splitLastDate)
    console.log(maxDate)
      if(new Date(splitLastDate)<new Date(maxDate)){
        console.log('add today');
        datagraphseizures.push({value: 0,name:maxDate,stringDate:maxDate, types: []})
      }
      if(new Date(minDate)<new Date(splitFirstDate)){
        console.log('add init');
        datagraphseizures.push({value: 0,name:minDate,stringDate:minDate, types: []})
      }
      var copydatagraphseizures = JSON.parse(JSON.stringify(datagraphseizures));
      datagraphseizures.sort(this.sortService.DateSortInver("stringDate"));
      console.log(datagraphseizures)
    for (var j = 0; j < datagraphseizures.length; j=j+1) {
      var foundDate = false;
      var actualDate = datagraphseizures[j].stringDate;
      if(datagraphseizures[j+1]!=undefined){
        var nextDate = datagraphseizures[j+1].stringDate;
        //stringDate
        for (var k = 0; actualDate != nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copydatagraphseizures.push({value: 0,name:actualDate,stringDate:actualDate, types: []})
          }else{
            foundDate = true;
          }
          
        }
        if(datagraphseizures[j+2]!=undefined){
        var actualDate = datagraphseizures[j+1].stringDate;
        var nextDate = datagraphseizures[j+2].stringDate;
        for (var k = 0; actualDate != nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copydatagraphseizures.push({value: 0,name:actualDate,stringDate:actualDate, types: []})
          }
          
        }
  
        }
      }
    }
    copydatagraphseizures.sort(this.sortService.DateSortInver("stringDate"));
    for (var j = 0; j < copydatagraphseizures.length; j++) {
      copydatagraphseizures[j].name = copydatagraphseizures[j].stringDate
      var theDate = new Date(copydatagraphseizures[j].name);
      copydatagraphseizures[j].name = this.tickFormattingDay(theDate)
    }
    return copydatagraphseizures;
  }

  tickFormattingDay(d: any) {
    if (sessionStorage.getItem('lang') == 'es') {
      this.formatDate = 'es-ES'
    } else {
      this.formatDate = 'en-EN'
    }
    //var options = { year: 'numeric', month: 'short' };
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    var res = d.toLocaleString(this.formatDate, options)
    return res;
  }

  groupPerWeek(seizures){
    
    var respseizures = [];
    for (var i=0; i < seizures.length; i++)
    {
      var varweek = new Date(seizures[i].stringDate)
      if(this.groupBy=='Weeks'){
        seizures[i].name = this.getWeek(varweek, 1);
      }else{
        seizures[i].name = this.getMonthLetter(varweek, 1);
      }
    }
    var copyseizures = JSON.parse(JSON.stringify(seizures));
    for (var i=0; i < copyseizures.length; i++){
      var foundElementIndex = this.searchService.searchIndex(respseizures, 'name', copyseizures[i].name);
      
      if(foundElementIndex!=-1){
        respseizures[foundElementIndex].value = respseizures[foundElementIndex].value+copyseizures[i].value;
        for (var j=0; j < copyseizures[i].types.length; j++){
          var foundElementIndexType = this.searchService.searchIndex(respseizures[foundElementIndex].types, 'types', copyseizures[i].types[j].type);
          if (foundElementIndexType != -1) {
            respseizures[foundElementIndex].types[foundElementIndexType].count++;
          } else {
            respseizures[foundElementIndex].types.push({ type: copyseizures[i].types[j].type, count: 1 });
          }
        }
        
      }else{
        respseizures.push(copyseizures[i]);
      }
    }
    return respseizures;
  }
  
  getMonthLetter(newdate, dowOffset?){
    if (this.lang != 'es') {
      return this.meses[newdate.getMonth()].en
  } else {
      return this.meses[newdate.getMonth()].es
  }
  }

  getWeek(newdate, dowOffset?) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  
      dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
      var newYear = new Date(newdate.getFullYear(),0,1);
      var day = newYear.getDay() - dowOffset; //the day of week the year begins on
      day = (day >= 0 ? day : day + 7);
      var daynum = Math.floor((newdate.getTime() - newYear.getTime() - 
      (newdate.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
      var weeknum;
      //if the year starts before the middle of a week
      if(day < 4) {
          weeknum = Math.floor((daynum+day-1)/7) + 1;
          if(weeknum > 52) {
              var nYear = new Date(newdate.getFullYear() + 1,0,1);
              var nday = nYear.getDay() - dowOffset;
              nday = nday >= 0 ? nday : nday + 7;
              /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
              weeknum = nday < 4 ? 1 : 53;
          }
      }
      else {
          weeknum = Math.floor((daynum+day-1)/7);
      }
      var formatDate = this.getDateOfISOWeek(weeknum, newYear.getFullYear())
      var pastDate=new Date(formatDate);
      pastDate.setDate(pastDate.getDate() +7);
      var res = this.tickFormattingDay(formatDate)+ ' - ' +this.tickFormattingDay(pastDate);
      return res;
  };
  
  getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  }

  getDrugs() {
    this.lineChartDrugs = [];
    this.lineChartDrugsCopy = [];
    this.maxValue = 0;
    this.medications = [];
    var info = {rangeDate: this.rangeDate}
    this.subscription.add( this.raitoService.getMedicationsPatient(this.selectedPatient.id, info)
      .subscribe((res: any) => {
        this.medications = res;
        if (this.medications.length > 0) {
          res.sort(this.sortService.DateSortInver("date"));
          this.searchTranslationDrugs();
          this.groupMedications();
          var datagraphseizures = [];
          
          this.lineChartDrugs = this.getStructure(res);
          
          
          this.lineChartDrugs = this.add0Drugs(this.lineChartDrugs);
          this.lineChartDrugsCopy = JSON.parse(JSON.stringify(this.lineChartDrugs));
  
          // Get chartNames
          this.chartNames = this.lineChartDrugs.map((d: any) => d.name);
          // Convert hex colors to ColorHelper for consumption by legend
          this.colors = new ColorHelper(this.lineChartColorScheme as any, ScaleType.Ordinal, this.chartNames, this.lineChartColorScheme);
          this.colors2 = new ColorHelper(this.lineChartOneColorScheme2 as any, ScaleType.Ordinal, this.chartNames, this.lineChartOneColorScheme2);
          //newColor
          var tempColors = JSON.parse(JSON.stringify(this.lineChartColorScheme))
          var tempColors2 = JSON.parse(JSON.stringify(this.lineChartOneColorScheme2))
          tempColors.domain[this.chartNames.length]=tempColors2.domain[0];
          this.colorsLineToll = new ColorHelper(tempColors as any, ScaleType.Ordinal, this.chartNames, tempColors);

          this.normalizedChanged(this.normalized);
          if(this.events.length>0){
            this.getDataNormalizedDrugsVsSeizures();
          }
          this.medications.sort(this.sortService.DateSortInver("endDate"));
        }
        this.loadedDrugs = true;
      }, (err) => {
        console.log(err);
        this.loadedDrugs = true;
      }));
  
  }

  normalizedChanged(normalized){
    this.normalized = normalized;
    if(this.normalized){
      this.titleDose = this.titleDrugsVsNormalized;
    }else{
      this.titleDose = this.titleDrugsVsNoNormalized;
    }
      var templineChartDrugs = JSON.parse(JSON.stringify(this.lineChartDrugsCopy));
      this.lineChartDrugs = [];
      var maxValue = 0;
      for (var i = 0; i < this.lineChartDrugsCopy.length; i++) {
        var maxValueRecommededDrug = this.getMaxValueRecommededDrug(this.lineChartDrugsCopy[i].name);
        if(maxValueRecommededDrug==0){
          maxValueRecommededDrug = this.maxValue;
        }
        for (var j = 0; j < this.lineChartDrugsCopy[i].series.length; j++) {
          if(this.normalized){
            templineChartDrugs[i].series[j].value = this.normalize(this.lineChartDrugsCopy[i].series[j].value, 0, maxValueRecommededDrug);
          }
          templineChartDrugs[i].series[j].name = this.lineChartDrugsCopy[i].series[j].name;
          if(maxValue<this.lineChartDrugsCopy[i].series[j].value){
            maxValue= this.lineChartDrugsCopy[i].series[j].value;
          }
        }
        templineChartDrugs[i].series.sort(this.sortService.DateSortInver("name"));
      }
      this.lineChartDrugs = JSON.parse(JSON.stringify(templineChartDrugs));
      if(maxValue>1 && !this.normalized){
        this.yAxisTicksDrugs = [0,Math.round(maxValue/2),maxValue];
      }else{
        this.yAxisTicksDrugs = [0,0.5,1];
      }
      console.log(this.yAxisTicksDrugs);
  }
  
  normalize(value, min, max) {
    var normalized = 0;
    if(value!=0){
      normalized = (value - min) / (max - min);
    }
    return normalized;
  }
  
  getMaxValueRecommededDrug(name){
    var maxDose = 0;
    var actualRecommendedDoses = this.recommendedDoses[name];
    console.log(this.weight);
    if(actualRecommendedDoses==undefined || !this.weight){
      return maxDose;
    }else{
      if(this.age<18){
        if(actualRecommendedDoses.data != 'onlyadults'){
          if(actualRecommendedDoses.kids.perkg=='no'){
            maxDose = actualRecommendedDoses.kids.maintenancedose.max
          }else{
            maxDose = actualRecommendedDoses.kids.maintenancedose.max * Number(this.weight);
          }
        }
      }else{
        if(actualRecommendedDoses.data != 'onlykids'){
          if(actualRecommendedDoses.adults.perkg=='no'){
            maxDose = actualRecommendedDoses.adults.maintenancedose.max
          }else{
            maxDose = actualRecommendedDoses.adults.maintenancedose.max * Number(this.weight);
          }
        }
      }
      return maxDose;
    }
  }

  searchTranslationDrugs() {
    for (var i = 0; i < this.medications.length; i++) {
      var foundTranslation = false;
      for (var j = 0; j < this.drugsLang.length && !foundTranslation; j++) {
        if (this.drugsLang[j].name == this.medications[i].drug) {
          for (var k = 0; k < this.drugsLang[j].translation.length && !foundTranslation; k++) {
            this.medications[i].drugTranslate = this.drugsLang[j].translation;
            foundTranslation = true;
          }
        }
      }
    }
  }
  
  groupMedications() {
    this.actualMedications = [];
    for (var i = 0; i < this.medications.length; i++) {
      if (!this.medications[i].endDate) {
        this.actualMedications.push(this.medications[i]);
      } else {
        var medicationFound = false;
        if (this.actualMedications.length > 0) {
          for (var j = 0; j < this.actualMedications.length && !medicationFound; j++) {
            if (this.medications[i].drug == this.actualMedications[j].drug) {
              medicationFound = true;
            }
          }
        }
  
      }
    }
  }
  
  getStructure(res){
    var lineChartDrugs = [];
    for (var i = 0; i < res.length; i++) {
      var foundElementDrugIndex = this.searchService.searchIndex(lineChartDrugs, 'name', res[i].drugTranslate);
      var splitDate = new Date(res[i].startDate);
      if(splitDate<this.minDateRange){
        splitDate = this.minDateRange
      }
        
        var splitDateEnd = null;
  
  
        if (foundElementDrugIndex != -1) {
          if(this.maxValue<Number(res[i].dose)){
            this.maxValue=Number(res[i].dose);
          }
          lineChartDrugs[foundElementDrugIndex].series.push({ value: parseInt(res[i].dose), name: splitDate.toDateString() });
          if (res[i].endDate == null) {
            splitDateEnd = new Date();
            lineChartDrugs[foundElementDrugIndex].series.push({ value: parseInt(res[i].dose), name: splitDateEnd.toDateString() });
          } else {
            splitDateEnd = new Date(res[i].endDate);
            lineChartDrugs[foundElementDrugIndex].series.push({ value: parseInt(res[i].dose), name: splitDateEnd.toDateString() });
          }
        } else {
          if(this.maxValue<Number(res[i].dose)){
            this.maxValue=Number(res[i].dose);
          }
          var seriesfirst = [{ value: parseInt(res[i].dose), name: splitDate.toDateString() }];
          if (res[i].endDate == null) {
            splitDateEnd = new Date();
            seriesfirst.push({ value: parseInt(res[i].dose), name: splitDateEnd.toDateString() });
          } else {
            splitDateEnd = new Date(res[i].endDate);
            seriesfirst.push({ value: parseInt(res[i].dose), name: splitDateEnd.toDateString() });
          }
          if(res[i].drugTranslate==undefined){
            lineChartDrugs.push({ name: res[i].drug, series: seriesfirst });
          }else{
            lineChartDrugs.push({ name: res[i].drugTranslate, series: seriesfirst });
          }
        }     
    }
  
    var copymeds = JSON.parse(JSON.stringify(lineChartDrugs));
    for (var i = 0; i < lineChartDrugs.length; i++) {
      lineChartDrugs[i].series.sort(this.sortService.DateSortInver("name"));
      for (var j = 0; j < lineChartDrugs[i].series.length; j=j+2) {
        var foundDate = false;
        var actualDate = lineChartDrugs[i].series[j].name;
        var nextDate = lineChartDrugs[i].series[j+1].name;
        for (var k = 0; actualDate != nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copymeds[i].series.push({value: lineChartDrugs[i].series[j].value,name:actualDate})
          }
          
        }
        if(lineChartDrugs[i].series[j+2]!=undefined){
        var actualDate = lineChartDrugs[i].series[j+1].name;
        var nextDate = lineChartDrugs[i].series[j+2].name;
        for (var k = 0; actualDate != nextDate && actualDate< nextDate && !foundDate; k++) {
          var theDate = new Date(actualDate);
          theDate.setDate(theDate.getDate()+1);
          actualDate = theDate.toDateString();
          if(actualDate != nextDate){
            copymeds[i].series.push({value: 0,name:actualDate})
          }
        }
  
        }else{
          actualDate = new Date(lineChartDrugs[i].series[j+1].name);
          nextDate = new Date();
          for (var k = 0; actualDate != nextDate && actualDate< nextDate; k++) {
            var theDate2 = actualDate;
            theDate2.setDate(theDate2.getDate()+1);
            actualDate = theDate2.toDateString();
            if(actualDate != nextDate && actualDate< nextDate){
              copymeds[i].series.push({value: 0,name:actualDate})
            }
            
          }
        }
        
      }
      copymeds[i].series.sort(this.sortService.DateSortInver("name"));
    }
    lineChartDrugs = JSON.parse(JSON.stringify(copymeds));
    return lineChartDrugs;
  }
  
  add0Drugs(datagraphdrugs){
    //var copydatagraphseizures = JSON.parse(JSON.stringify(datagraphseizures));
    var maxDateTemp = new Date();
    var maxDate = maxDateTemp.toDateString();
    
    var minDate = this.minDateRange.toDateString();
    var copydatagraphseizures = [];
    for (var i = 0; i < datagraphdrugs.length; i++) {
      copydatagraphseizures.push({name:datagraphdrugs[i].name, series:[]});
      var splitLastDate = datagraphdrugs[i].series[datagraphdrugs[i].series.length-1].name;
      var splitFirstDate = datagraphdrugs[i].series[0].name;
        if(splitLastDate<maxDate){
          datagraphdrugs[i].series.push({value: 0,name:maxDate})
        }
        if(new Date(minDate)<new Date(splitFirstDate)){
          datagraphdrugs[i].series.push({value: 0,name:minDate})
        }
        copydatagraphseizures[i].series = JSON.parse(JSON.stringify(datagraphdrugs[i].series));
        datagraphdrugs[i].series.sort(this.sortService.DateSortInver("name"));
      for (var j = 0; j < datagraphdrugs[i].series.length; j=j+1) {
        var foundDate = false;
        var actualDate = datagraphdrugs[i].series[j].name;
        if(datagraphdrugs[i].series[j+1]!=undefined){
          var nextDate = datagraphdrugs[i].series[j+1].name;
          //stringDate
          for (var k = 0; actualDate != nextDate && !foundDate; k++) {
            var theDate = new Date(actualDate);
            theDate.setDate(theDate.getDate()+1);
            actualDate = theDate.toDateString();
            if(actualDate != nextDate){
              copydatagraphseizures[i].series.push({value: 0,name:actualDate})
            }else{
              foundDate = true;
            }
            
          }
          if(datagraphdrugs[i].series[j+2]!=undefined){
          var actualDate = datagraphdrugs[i].series[j+1].name;
          var nextDate = datagraphdrugs[i].series[j+2].name;
          for (var k = 0; actualDate != nextDate && !foundDate; k++) {
            var theDate = new Date(actualDate);
            theDate.setDate(theDate.getDate()+1);
            actualDate = theDate.toDateString();
            if(actualDate != nextDate){
              copydatagraphseizures[i].series.push({value: 0,name:actualDate})
            }
            
          }
    
          }
        }
      }
      copydatagraphseizures[i].series.sort(this.sortService.DateSortInver("name"));
      for (var j = 0; j < copydatagraphseizures[i].series.length; j++) {
        copydatagraphseizures[i].series[j].name = copydatagraphseizures[i].series[j].name
        var theDate = new Date(copydatagraphseizures[i].series[j].name);
        copydatagraphseizures[i].series[j].name = this.tickFormattingDay(theDate)
      }
    }
    return copydatagraphseizures;
  }
  
  getDataNormalizedDrugsVsSeizures(){
    var meds = this.getStructure(this.medications);
    var seizu = this.getStructure2(this.events);
    seizu = this.add0Seizures(seizu);
    meds = this.add0Drugs(meds);
    var copymeds = JSON.parse(JSON.stringify(meds));
    
    if(this.rangeDate == 'quarter' || this.rangeDate == 'year'){
      //meds = this.groupPerWeekDrugs(meds)
      
    }
    if(this.rangeDate == 'quarter' || this.rangeDate == 'year'){
      seizu = this.add0Seizures(seizu);
      seizu = this.groupPerWeek(seizu);
    }
  
    this.maxValueDrugsVsSeizu = 0;
    for (var i = 0; i < this.lineChartSeizures[0].series.length; i++) {
      if(this.maxValueDrugsVsSeizu<Number(this.lineChartSeizures[0].series[i].value)){
        this.maxValueDrugsVsSeizu=Number(this.lineChartSeizures[0].series[i].value);
      }
    }
    
    var percen = 0;
    if(this.maxValue>this.maxValueDrugsVsSeizu){
      percen = this.maxValue/this.maxValueDrugsVsSeizu
    }else{
      percen = this.maxValueDrugsVsSeizu/this.maxValue
    }
    
  
    this.barChart = seizu;
    console.log(copymeds);
    this.lineChartSeries = copymeds;
    if(this.normalized2){
  
      var templineChartDrugs = JSON.parse(JSON.stringify(this.lineChartSeries));
      console.log(this.lineChartSeries);
      var maxValue = 0;
      for (var i = 0; i < this.lineChartSeries.length; i++) {
        var maxValueRecommededDrug = this.getMaxValueRecommededDrug(this.lineChartSeries[i].name);
        if(maxValueRecommededDrug==0){
          maxValueRecommededDrug = this.maxValue;
        }
        for (var j = 0; j < this.lineChartSeries[i].series.length; j++) {
          if(this.normalized){
            templineChartDrugs[i].series[j].value = this.normalize(this.lineChartSeries[i].series[j].value, 0, maxValueRecommededDrug);
          }
          templineChartDrugs[i].series[j].name = this.lineChartSeries[i].series[j].name;
          if(maxValue<this.lineChartSeries[i].series[j].value){
            maxValue= this.lineChartSeries[i].series[j].value;
          }
        }
        templineChartDrugs[i].series.sort(this.sortService.DateSortInver("name"));
      }
      this.lineChartSeries = JSON.parse(JSON.stringify(templineChartDrugs));
      console.log(this.lineChartSeries);
      
      /*var templineChartDrugs = JSON.parse(JSON.stringify(this.lineDrugsVsSeizures));
      for (var i = 0; i < this.lineDrugsVsSeizures.length; i++) {
        for (var j = 0; j < this.lineDrugsVsSeizures[i].series.length; j++) {
          if(this.lineDrugsVsSeizures[i].name==this.titleSeizures){
            templineChartDrugs[i].series[j].value = percen*this.normalize2(this.lineDrugsVsSeizures[i].series[j].value, 0);
          }else{
            templineChartDrugs[i].series[j].value = this.normalize2(this.lineDrugsVsSeizures[i].series[j].value, 0);
          }
        }
      }
      this.lineDrugsVsSeizures = [];
      this.lineDrugsVsSeizures = JSON.parse(JSON.stringify(templineChartDrugs));*/
    }
  }

  normalizedChanged2(normalized){
    this.normalized2 = normalized;
    if(this.normalized2){
      this.titleDrugsVsDrugs = this.titleDrugsVsNormalized;
    }else{
      this.titleDrugsVsDrugs = this.titleDrugsVsNoNormalized;
    }
     this.getDataNormalizedDrugsVsSeizures();
    
  }

  exportPDF2(){
    Swal.fire({
      title: this.translate.instant("generics.Please wait"),
      html: '<i class="fa fa-spinner fa-spin fa-3x fa-fw pink"></i>',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false
    }).then((result) => {
  
    });
  
    this.loadingPDF = true;
    var seizuresMonths = [];
    if((this.rangeDate == 'quarter' || this.rangeDate == 'year') && this.events.length > 0){
      seizuresMonths = this.getSeizuresMonths();
    }
    if(this.rangeDate == 'month' && this.events.length > 0){
      seizuresMonths = this.lineChartSeizures[0].series;
    }
    
  
    setTimeout(async function () {
      var images= {"img1":{show:false, info:null}, "img2":{show:false, info:null}, "img3":{show:false, info:null, normalized: this.normalized}, "img4":{show:false, info:null, normalized: this.normalized2}};
    
  
      if(this.events.length > 0 && this.loadedEvents){
        images.img1.info = await this.getImg('#line-chart1');
        images.img1.show = true;      
      }
      console.log(images);
      if(this.feels.length > 0){
        images.img2.info = await this.getImg('#line-chart2');
        images.img2.show = true;
      }
      console.log(images);
      if(this.medications.length > 0 && this.loadedDrugs){
        images.img3.info = await this.getImg('#line-chart3');
        images.img3.show = true;
      }
      console.log(images);
      if(this.medications.length > 0 && this.loadedDrugs && this.events.length > 0 && this.loadedEvents){
        images.img4.info = await this.getImg('#line-chart4');
        images.img4.show = true;
      }
      
      console.log(images);
      var infoDrugs = this.medications;//this.getPlainInfoDiseases();
        var phenotype = [];
        this.subscription.add( this.raitoService.getPatientPhenotypes(this.selectedPatient.id)
          .subscribe(async (res: any) => {
            if (!res.message) {
              if (res.phenotype.data.length > 0) {
                res.phenotype.data.sort(this.sortService.GetSortOrder("name"));
                phenotype = res.phenotype.data;
      
                var hposStrins = [];
                phenotype.forEach(function (element) {
                    hposStrins.push(element.id);
                  });
                  //get symtoms
                  var phenotype2 = await this.callGetInfoTempSymptomsJSON(hposStrins, phenotype);
                  this.jsPDFService.generateResultsPDF(phenotype2, infoDrugs, this.lang, images, this.rangeDate, this.timeformat, seizuresMonths)
                  this.loadingPDF = false;
                  Swal.close();
                  //phenotype = this.callGetInfoTempSymptomsJSON(hposStrins, phenotype);
              }else{
                this.jsPDFService.generateResultsPDF(phenotype, infoDrugs, this.lang, images, this.rangeDate, this.timeformat, seizuresMonths)
                this.loadingPDF = false;
                Swal.close();
              }
            }else{
              this.jsPDFService.generateResultsPDF(phenotype, infoDrugs, this.lang, images, this.rangeDate, this.timeformat, seizuresMonths)
              this.loadingPDF = false;
              Swal.close();
            }
            
          }, (err) => {
            console.log(err);
          }));
    }.bind(this), 2000);
   
  }

  async callGetInfoTempSymptomsJSON(hposStrins, phenotype) {
    return new Promise(async function (resolve, reject) {
      var lang = this.lang;
      this.subscription.add(this.apif29BioService.getInfoOfSymptoms(lang, hposStrins)
        .subscribe((res: any) => {
    
          var tamano = Object.keys(res).length;
          if (tamano > 0) {
            for (var i in res) {
              for (var j = 0; j < phenotype.length; j++) {
                if (res[i].id == phenotype[j].id) {
                  phenotype[j].name = res[i].name;
                  phenotype[j].def = res[i].desc;
                  phenotype[j].synonyms = res[i].synonyms;
                  phenotype[j].comment = res[i].comment;
                  if (phenotype[j].importance == undefined) {
                    phenotype[j].importance = 1;
                  }
                }
              }
            }
            phenotype.sort(this.sortService.GetSortOrder("name"));
          }
          resolve (phenotype);
    
        }, (err) => {
          resolve ([]);
        }));
    }.bind(this));
    
  }

  getSeizuresMonths(){
    var result = [];
    var eventsCopy = JSON.parse(JSON.stringify(this.events));
    for (var i = 0; i < eventsCopy.length; i++) {
      var theDate = new Date(eventsCopy[i].start);
      theDate.setDate(1);
      var foundElementIndex = this.searchService.searchIndex(result, 'name', theDate.toDateString());
      if(foundElementIndex!= -1){
        result[foundElementIndex].value++;
      }else{
        result.push({name: theDate.toDateString(), value: 1, date: theDate.toISOString()});
      }
    }
    //add months 0
    var maxDateTemp = new Date();
    
    var period = 31;
    if(this.rangeDate == 'quarter'){
      period = 3;
    }else if(this.rangeDate == 'year'){
      period = 12;
    }
    var actualDate = new Date();
    actualDate.setDate(1);
    var pastDate=new Date(actualDate);
    pastDate.setMonth(pastDate.getMonth() - period);
    maxDateTemp.setDate(1);
    var maxDate = maxDateTemp;
    var minDate = pastDate;
    //add month to maxDate
    for (var i = 0; minDate.getTime() < maxDate.getTime(); i++) {
      var maxDateTemp2 = new Date(minDate);
      maxDateTemp2.setMonth(maxDateTemp2.getMonth() + 1);
      var foundElementIndex2 = this.searchService.searchIndex(result, 'name', maxDateTemp2.toDateString());
      if(foundElementIndex2== -1){
        result.push({name: maxDateTemp2.toDateString(), value: 0, date: maxDateTemp2.toISOString()});
      }
      minDate = maxDateTemp2;
    }
    result.sort(this.sortService.DateSortInver("name"));
    return result;
  }

  getImg(idElement){
    return new Promise((resolve, reject) => {
      html2canvas(document.querySelector(idElement)).then(function(canvas) {
        var img=canvas.toDataURL("image/jpg")
        var scale = canvas.width/170;
        var width = canvas.width;
        var height = canvas.height;
        if(scale>1){
          if(scale>3){
            width = canvas.width/scale;
            height = canvas.height/scale;
          }else if(scale>2){
            width = canvas.width/(scale*2);
            height = canvas.height/(scale*2);
          }else{
            width = canvas.width/(scale*3);
            height = canvas.height/(scale*3);
          }
          
        }
        if(height==0){
          height = width;
        }
        var res = {data:img, width:width, height:height};
        resolve(res);
      });
    });
  }

}


export let lineChartSeries = [
];

export let barChart: any = [
];
