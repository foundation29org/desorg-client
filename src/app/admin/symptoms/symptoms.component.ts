import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { Apif29BioService } from 'app/shared/services/api-f29bio.service';
import { SearchService } from 'app/shared/services/search.service';
import { SortService } from 'app/shared/services/sort.service';
import * as chartsData from 'app/shared/configs/general-charts.config';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-symptoms',
    templateUrl: './symptoms.component.html',
    styleUrls: ['./symptoms.component.scss'],
    providers: [RaitoService, Apif29BioService]
})

export class SymptomsComponent implements OnInit, OnDestroy{

  data: any = [];
  dataCopy: any = [];
  loadedData: boolean = false;
  lang: string = 'en';
  patients: any = [];
  countries = [];
  countriesSelected: any = [];
  allSelected: boolean = true;
  totalPatients: number = 0;
  symptoms: any = [];
  lineChart: any = [];
  barChartXAxisLabel = 'Patients';
  barChartYAxisLabel = 'Symptoms';

  // options
  view: any[] = [700, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = false;
  lineChartColorScheme = chartsData.lineChartOneColorScheme;
  private subscription: Subscription = new Subscription();

  constructor(public translate: TranslateService, private raitoService: RaitoService, private apif29BioService: Apif29BioService, private searchService: SearchService, private sortService: SortService){

  }

  ngOnInit() {
    this.lang = sessionStorage.getItem('lang');

    this.subscription.add(this.raitoService.getPhenotypes().subscribe(
      data => {
        this.data = data.entry;
        this.getHpoCodes();
        
      },
      error => {
        this.data = [];
        this.loadedData = true;
        // Manejo de errores HTTP
        console.error('Error HTTP:', error);
        // Puedes agregar lógica adicional aquí, como mostrar un mensaje de error al usuario
        if (error.status === 404) {
          console.error('No se encontró el recurso solicitado');
          // Puedes agregar lógica adicional aquí, como mostrar un mensaje de error al usuario
        }
      }
    ));
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  getHpoCodes(){
    var hposStrins = [];

    for(var i=0;i<this.data.length;i++){
      hposStrins.push(this.data[i].resource.valueString);
    }

    if (hposStrins.length >0) {
      this.callGetInfoSymptoms(hposStrins);
    }else{
      this.loadedData = true;
    }
  }
  
  callGetInfoSymptoms(hposStrins) {
    var lang = this.lang;
    this.subscription.add(this.apif29BioService.getInfoOfSymptoms(lang, hposStrins)
        .subscribe((res: any) => {
            var tamano = Object.keys(res).length;
            if (tamano > 0) {
                for (var i in res) {
                    for (var j = 0; j < this.data.length; j++) {
                        if (res[i].id == this.data[j].resource.valueString) {
                            this.data[j].resource.name = res[i].name;
                            this.data[j].resource.def = res[i].desc;
                            this.data[j].resource.synonyms = res[i].synonyms;
                            this.data[j].resource.comment = res[i].comment;
                        }
                    }
                }
                //this.temporalSymptoms.sort(this.sortService.GetSortOrder("name"));
            }
            this.getCountriesAndDraw()
            this.loadedData = true;
        }, (err) => {
            console.log(err);
            this.loadedData = true;
        }));
  }

  getCountriesAndDraw(){
    this.subscription.add(this.raitoService.getOnlyPatients(false).subscribe(
          data2 => {
            this.patients = data2;
            for (var index in this.patients) {
                for(var i=0;i<this.data.length;i++){
                  if(this.data[i].resource.subject.reference==this.patients[index].result.entry[0].fullUrl){
                    this.data[i].resource.country = this.patients[index].result.entry[0].resource.address[0].country;
                    if(this.data[i].resource.country==null){
                      this.data[i].resource.country ='Unknown'
                    }
                    var foundElementIndex = this.searchService.searchIndex(this.countries, 'name', this.data[i].resource.country);
                    if(foundElementIndex==-1){
                      var users = []
                      users.push({id: this.patients[index].result.entry[0].fullUrl})
                      this.countries.push({name:this.data[i].resource.country, value:1, users: users})
                      this.totalPatients++;
                    }else{
                      var foundElementIndex2 = this.searchService.searchIndex(this.countries[foundElementIndex].users, 'id', this.patients[index].result.entry[0].fullUrl);
                      if(foundElementIndex2==-1){
                        this.countries[foundElementIndex].value++;
                        this.countries[foundElementIndex].users.push({id:this.patients[index].result.entry[0].fullUrl})
                        this.totalPatients++;
                      }
                    }
                  }
                }
            }
            this.dataCopy = JSON.parse(JSON.stringify(this.data));
            for (var indexCountry in this.countries) {
              this.countriesSelected.push(this.countries[indexCountry].name);
            }
            this.getDataGraph();
          }
        ));
  }

  countriesChanged(){
    if(this.countriesSelected.length < this.countries.length){
      this.allSelected = false;
    }
    this.applyFilter();
  }

  allChanged(){
    if(this.allSelected){
      this.countriesSelected = [];
      for (var indexCountry in this.countries) {
        this.countriesSelected.push(this.countries[indexCountry].name);
      }
    }else{
      this.countriesSelected=[];
      
    }
    this.applyFilter();
  }

  applyFilter(){
    this.loadedData=false;
    this.data = [];
    for(var i=0;i<this.dataCopy.length;i++){
      var enc = false;
      for(var j=0;j<this.countriesSelected.length && !enc;j++){
        if(this.dataCopy[i].resource.country==this.countriesSelected[j]){
          this.data.push(this.dataCopy[i]);
          enc = true;
        }
      }
    }
    this.getDataGraph();
    this.loadedData=true;
  }

  getDataGraph(){
    this.symptoms = [];
    this.lineChart = [];
    for (var i = 0; i < this.data.length; i++) {
      this.symptoms.push({name:this.data[i].resource.name, country: this.data[i].resource.country})
    }
    for (var i = 0; i < this.symptoms.length; i++) {
      for (var j = 0; j < this.countriesSelected.length; j++) {
        if(this.symptoms[i].country==this.countriesSelected[j]){
          var foundElementIndex = this.searchService.searchIndex(this.lineChart, 'name', this.symptoms[i].name);
          if(foundElementIndex==-1){
            this.lineChart.push({name:this.symptoms[i].name, value:1});
          }else{
            this.lineChart[foundElementIndex].value++;
          }
        }
      }
    }
    this.lineChart.sort(this.sortService.GetSortOrderNumber("value"));

  }

  axisFormat(val) {
    if (Number.isInteger(val)) {
      return Math.round(val);
    } else {
      return '';
    }

  }


}
