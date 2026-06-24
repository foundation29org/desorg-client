import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { SearchService } from 'app/shared/services/search.service';
import { SortService } from 'app/shared/services/sort.service';
import * as chartsData from 'app/shared/configs/general-charts.config';
import { Subscription } from 'rxjs/Subscription';

@Component({
    standalone: false,
    selector: 'app-drugs',
    templateUrl: './drugs.component.html',
    styleUrls: ['./drugs.component.scss'],
    providers: [RaitoService]
})

export class DrugsComponent implements OnInit, OnDestroy{

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
  symptoms2: any = [];
  lineChart2: any = [];
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
  totalDrugs:number = 0;
  numberPatients: any = [];
  totalDrugs2:number = 0;
  numberPatients2: any = [];
  lineChartColorScheme = chartsData.lineChartOneColorScheme;
  private subscription: Subscription = new Subscription();

  constructor(public translate: TranslateService, private raitoService: RaitoService, private searchService: SearchService, private sortService: SortService){

  }

  ngOnInit() {
    this.lang = sessionStorage.getItem('lang');

    this.subscription.add(this.raitoService.getDrugs().subscribe(
      data => {
        this.data = data.entry;
        this.loadedData = true;
        this.getCountriesAndDraw()
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
            this.getDataGraphActual();
            //this.getDataGraphOld();
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
    this.getDataGraphActual();
    //this.getDataGraphOld();
    this.loadedData=true;
  }

  getDataGraphActual(){
    this.totalDrugs = 0;
    this.numberPatients = [];
    this.symptoms = [];
    this.lineChart = [];
    for (var i = 0; i < this.data.length; i++) {
      if(this.data[i].resource.effectivePeriod.end==null){
        this.symptoms.push({name:this.data[i].resource.contained[0].code.coding[0].display, country: this.data[i].resource.country, id: this.data[i].resource.subject.reference})
      }
    }
    for (var i = 0; i < this.symptoms.length; i++) {
      for (var j = 0; j < this.countriesSelected.length; j++) {
        if(this.symptoms[i].country==this.countriesSelected[j]){
          var foundElementIndex = this.searchService.searchIndex(this.lineChart, 'name', this.symptoms[i].name);
          if(foundElementIndex==-1){
            this.lineChart.push({name:this.symptoms[i].name, value:1});
            this.totalDrugs ++;
            this.updateNumberPatients(this.symptoms[i].id);
          }else{
            this.lineChart[foundElementIndex].value++;
            this.updateNumberPatients(this.symptoms[i].id);
          }
        }
      }
    }
    this.lineChart.sort(this.sortService.GetSortOrderNumber("value"));

  }

  updateNumberPatients(idPatient){
    var foundDateIndex = this.searchService.searchIndex(this.numberPatients, 'id', idPatient);
    if(foundDateIndex==-1){
      this.numberPatients.push({id:idPatient});
    }
  }

  getDataGraphOld(){
    this.totalDrugs2 = 0;
    this.numberPatients2 = [];
    this.symptoms2 = [];
    this.lineChart2 = [];
    for (var i = 0; i < this.data.length; i++) {
      if(this.data[i].resource.effectivePeriod.end!=null){
        this.symptoms2.push({name:this.data[i].resource.contained[0].code.coding[0].display, country: this.data[i].resource.country, id: this.data[i].resource.subject.reference})
      }
    }
    for (var i = 0; i < this.symptoms2.length; i++) {
      for (var j = 0; j < this.countriesSelected.length; j++) {
        if(this.symptoms2[i].country==this.countriesSelected[j]){
          var foundElementIndex = this.searchService.searchIndex(this.lineChart2, 'name', this.symptoms2[i].name);
          if(foundElementIndex==-1){
            this.lineChart2.push({name:this.symptoms2[i].name, value:1});
            this.totalDrugs2 ++;
            this.updateNumberPatients(this.symptoms2[i].id);
          }else{
            this.lineChart2[foundElementIndex].value++;
            this.updateNumberPatients2(this.symptoms2[i].id);
          }
        }
      }
    }
    this.lineChart2.sort(this.sortService.GetSortOrderNumber("value"));

  }

  updateNumberPatients2(idPatient){
    var foundDateIndex = this.searchService.searchIndex(this.numberPatients2, 'id', idPatient);
    if(foundDateIndex==-1){
      this.numberPatients2.push({id:idPatient});
    }
  }

  axisFormat(val) {
    if (Number.isInteger(val)) {
      return Math.round(val);
    } else {
      return '';
    }

  }

}
