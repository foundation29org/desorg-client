import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge, mergeMap, concatMap } from 'rxjs/operators'

@Injectable()
export class ApiDx29ServerService {
    constructor(private http: HttpClient) {}

    getSymptoms(id){
      return this.http.get(environment.api+'/api/phenotypes/'+id).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
           return err; })
        )
    }
    
    getDetectLanguage(text){
      var jsonText = [{ "text": text }];
        return this.http.post(environment.api+'/api/getDetectLanguage', jsonText).pipe(
          map((res: any) => {
            return res;
        }),
          catchError((err) => { console.log(err);
            return err; })
        )
    }
    getTranslationDictionary(text){
      var jsonText = [{ "text": text }];
        return this.http.post(environment.api+'/api/getTranslationDictionary', jsonText).pipe(
          map((res: any) => {
            return res;
        }),
          catchError((err) => { console.log(err);
            return err; })
        )
    }

    getAzureBlobSasToken(containerName){
      return this.http.get(environment.api+'/api/getAzureBlobSasTokenWithContainer/'+containerName).pipe(
        map((res: any) => {
          return res.containerSAS;
      }),
        catchError((err) => { console.log(err);
          return err; })
      )
  }

    calculate(info, lang) {
      return this.http.post(environment.api + '/api/gateway/Diagnosis/calculate/'+lang, info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    searchDiseases(info) {
      return this.http.post(environment.api + '/api/gateway/search/disease/', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    searchSymptoms(info) {
      return this.http.post(environment.api + '/api/gateway/search/symptoms/', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    sendEmailResultsUndiagnosed(info) {
      return this.http.post(environment.api + '/api/sendEmailResultsUndiagnosed', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    sendEmailResultsDiagnosed(info) {
      return this.http.post(environment.api + '/api/sendEmailResultsDiagnosed', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    sendEmailRevolution(info) {
      return this.http.post(environment.api + '/api/sendEmailRevolution', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    createblobOpenDx29(symptoms) {
      return this.http.post(environment.api + '/api/blobOpenDx29', symptoms).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    createblobOpenDx29Timeline(symptoms) {
      return this.http.post(environment.api + '/api/blobOpenDx29Timeline', symptoms).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    chekedSymptomsOpenDx29(info) {
      return this.http.post(environment.api + '/api/chekedSymptomsOpenDx29', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }
    
    searchwiki(info) {
      return this.http.post(environment.api + '/api/wiki', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    searchwikiSearch(info) {
      return this.http.post(environment.api + '/api/wikiSearch', info).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    getPatientGroups(idDisease) {
      return this.http.get(environment.api + '/api/patientgroups/'+idDisease).pipe(
          map((res: any) => {
          return res;
        }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    getblob(patientId, blobName){
      var jsonText = { "patientId": patientId, "blobName": blobName };
        return this.http.post(environment.api+'/api/getblob', jsonText).pipe(
          map((res: any) => {
            return res;
        }),
          catchError((err) => { console.log(err);
            return err; })
        )
    }

    loadGroups() {
      return this.http.get(environment.api+'/api/groupsnames/').pipe(
        map((res: any) => {
        return res;
       }),
        catchError((err) => { console.log(err);
        return err; })
      );
    }

    callOpenAi(textf){
      console.log(textf);
      return this.http.post(environment.api+'/api/callopenai', textf).pipe(
        map((res: any) => {
          return res;
      }),
        catchError((err) => { console.log(err);
          return err; })
      )
  }

}
