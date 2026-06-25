import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { SearchService } from 'app/shared/services/search.service';
import { SortService } from 'app/shared/services/sort.service';
import { ColorHelper, ScaleType } from '@swimlane/ngx-charts';
import * as chartsData from 'app/shared/configs/general-charts.config';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-seizures',
    templateUrl: './seizures.component.html',
    styleUrls: ['./seizures.component.scss'],
    providers: [RaitoService]
})

export class SeizuresComponent implements OnInit, OnDestroy{

  data: any = [];
  dataCopy: any = [];
  loadedData: boolean = false;
  patients: any = [];
  countries = [];
  countriesSelected: any = [];
  allSelected: boolean = true;
  totalPatients: number = 0;
  lineChart = [];
  public chartNames: string[];
  public colors: ColorHelper;
  lineChartColorScheme = chartsData.lineChartOneColorScheme;
  barChartGradient = chartsData.barChartGradient;
  barChartXAxisLabel = chartsData.barChartXAxisLabel;
  barChartYAxisLabel = chartsData.barChartYAxisLabel;
  yAxisTicksDrugs = [];
  formatDate: any = [];
  rangeDate: string = 'month';
  minDateRange = new Date();
  xAxisTicks = [];
  totalSeizures:number = 0;
  numberPatients: any = [];
  private subscription: Subscription = new Subscription();

  constructor(public translate: TranslateService, private raitoService: RaitoService, private searchService: SearchService, private sortService: SortService){

  }

  ngOnInit() {
    this.subscription.add(this.raitoService.getSeizures().subscribe(
      data => {
        console.log(data)
        this.loadedData = true;
        if(data == 'No data'){
          this.data = [];
          return;
        }else{
          this.data = data.entry;
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
                        this.countries.push({name:this.data[i].resource.country, count:1, users: users})
                        this.totalPatients++;
                      }else{
                        var foundElementIndex2 = this.searchService.searchIndex(this.countries[foundElementIndex].users, 'id', this.patients[index].result.entry[0].fullUrl);
                        if(foundElementIndex2==-1){
                          this.countries[foundElementIndex].count++;
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
    this.totalSeizures = 0;
    this.numberPatients = []
    this.lineChart = [];
    var series = [];
    var maxDateTemp = new Date();
    var minDate = maxDateTemp.toDateString();
    var period = 31;
    if(this.rangeDate!='all'){
      if(this.rangeDate == 'month'){
        period = 31;
      }else if(this.rangeDate == 'quarter'){
        period = 90;
      }else if(this.rangeDate == 'year'){
        period = 365;
      }
      var actualDate = new Date();
      var pastDate=new Date(actualDate);
      pastDate.setDate(pastDate.getDate() - period);
      minDate = pastDate.toDateString();
    }else{
      period = null
    }
    for (var i = 0; i < this.data.length; i++) {
      var splitDate = new Date(this.data[i].resource.effectiveDateTime);
      if(new Date(minDate)<new Date(splitDate) && this.rangeDate!='all'){
        series.push({ value: parseInt(this.data[i].resource.valueQuantity.value), name: splitDate.toDateString(), country: this.data[i].resource.country, stringDate: splitDate.toDateString(), id: this.data[i].resource.subject.reference});
      }else if(this.rangeDate=='all'){
        series.push({ value: parseInt(this.data[i].resource.valueQuantity.value), name: splitDate.toDateString(), country: this.data[i].resource.country, stringDate: splitDate.toDateString(), id: this.data[i].resource.subject.reference});
        if(new Date(splitDate)<new Date(minDate)){
          minDate = splitDate.toDateString();
        }
      }
      
      /*if(new Date(splitDate)<new Date(minDate)){
        minDate = splitDate.toDateString();
      }*/
    }
    if(this.countriesSelected.length < this.countries.length){
      for (var i = 0; i < this.countriesSelected.length; i++) {
        this.lineChart.push({ name: this.countriesSelected[i], series: [] });
      }
      for (var i = 0; i < series.length; i++) {
        for (var j = 0; j < this.countriesSelected.length; j++) {
          if(series[i].country==this.countriesSelected[j]){
            var foundElementIndex = this.searchService.searchIndex(this.lineChart, 'name', this.countriesSelected[j]);
            if(foundElementIndex!=-1){
              //test if date is on serie
              var foundDateIndex = this.searchService.searchIndex(this.lineChart[foundElementIndex].series, 'stringDate', series[i].stringDate);
              if(foundDateIndex!=-1){
                this.lineChart[foundElementIndex].series[foundDateIndex].value++;
                this.totalSeizures++;
                this.updateNumberPatients(series[i].id);
              }else{
                if(series[i]!=undefined){
                  var info = { value: 1, name: series[i].stringDate, country: series[i].country, stringDate: series[i].stringDate}
                  this.lineChart[foundElementIndex].series.push(info);
                  this.totalSeizures++;
                  this.updateNumberPatients(series[i].id);
                }
                
              }
              //this.lineChart[foundElementIndex].series.push(series[i]);
            }
          }
        }
      }
      console.log(this.lineChart);
      for (var i = 0; i < this.lineChart.length; i++) {
        
        this.lineChart[i].series.sort(this.sortService.DateSortInver("name"));
        this.lineChart[i].series= this.add0Seizures(this.lineChart[i].series, minDate, this.lineChart[i].name);
        this.lineChart[i].series.sort(this.sortService.DateSortInver("name"));
        
      }
    }else{
      var series2 = [];
      console.log(series);
      for (var i = 0; i < series.length; i++) {
        var foundDateIndex = this.searchService.searchIndex(series2, 'stringDate', series[i].stringDate);
              if(foundDateIndex!=-1){
                series2[foundDateIndex].value++;
                this.totalSeizures++;
                this.updateNumberPatients(series[i].id);
              }else{
                if(series[i]!=undefined){
                  var info = { value: 1, name: series[i].stringDate, country: series[i].country, stringDate: series[i].stringDate}
                  series2.push(info);
                  this.totalSeizures++;
                  this.updateNumberPatients(series[i].id);
                }
                
              }
      }
      this.lineChart.push({ name: 'all', series: series2 });
      this.lineChart[0].series.sort(this.sortService.DateSortInver("name"));
    }
    this.chartNames = this.lineChart.map((d: any) => d.name);
    this.colors = new ColorHelper(this.lineChartColorScheme as any, ScaleType.Ordinal, this.chartNames, this.lineChartColorScheme);
    var actualDate1=new Date();
    var pastDate1=new Date(actualDate1);
    pastDate1.setDate(pastDate1.getDate() - Math.round((period+1)/2));
    var mediumDate = pastDate1;
    this.xAxisTicks = [minDate,mediumDate.toISOString(),maxDateTemp.toISOString()];
    console.log(this.lineChart);
  }

  updateNumberPatients(idPatient){
    var foundDateIndex = this.searchService.searchIndex(this.numberPatients, 'id', idPatient);
    if(foundDateIndex==-1){
      this.numberPatients.push({id:idPatient});
    }
  }

  add0Seizures(datagraphseizures, minDate, country){
    if(datagraphseizures.length>0){
      var maxDateTemp = new Date();
      var maxDate = maxDateTemp.toDateString();
      
      var minDate = minDate;
      
      var splitLastDate = datagraphseizures[datagraphseizures.length-1].stringDate;
      var splitFirstDate = datagraphseizures[0].stringDate;
        if(new Date(splitLastDate)<new Date(maxDate)){
          datagraphseizures.push({value: 0,name:maxDate,stringDate:maxDate, country: country})
        }
        if(new Date(minDate)<new Date(splitFirstDate)){
          datagraphseizures.push({value: 0,name:minDate,stringDate:minDate, country: country})
        }
        var copydatagraphseizures = JSON.parse(JSON.stringify(datagraphseizures));
        datagraphseizures.sort(this.sortService.DateSortInver("stringDate"));
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
              copydatagraphseizures.push({value: 0,name:actualDate,stringDate:actualDate, country: country})
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
              copydatagraphseizures.push({value: 0,name:actualDate,stringDate:actualDate, country: country})
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
    }else{
      return [];
    }
    //var copydatagraphseizures = JSON.parse(JSON.stringify(datagraphseizures));
    
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

  axisFormat(val) {
    if (Number.isInteger(val)) {
      return Math.round(val);
    } else {
      return '';
    }

  }

  loadDataRangeDate(rangeDate) {
    this.rangeDate = rangeDate;
    
    this.applyFilter();
  } 

}
