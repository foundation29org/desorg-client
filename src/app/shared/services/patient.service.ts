import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../app/shared/auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge, mergeMap, concatMap } from 'rxjs/operators'

@Injectable()
export class PatientService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    getPatientId(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/patients-all/'+this.authService.getIdUser()).pipe(
          map((res: any) => {
          if(res.listpatients.length>0){
            this.authService.setPatientList(res.listpatients);
            this.authService.setCurrentPatient(res.listpatients[0]);
            this.authService.setGroup(res.listpatients[0].group);
            return this.authService.getCurrentPatient();
          }else{
            return null;
          }
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPatientWeight(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/weight/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPatientHeight(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/height/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getGeneralShare(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/openraito/patient/generalshare/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    setGeneralShare(info){
      //cargar las faqs del knowledgeBaseID
      return this.http.post(environment.api+'/api/openraito/patient/generalshare/'+this.authService.getCurrentPatient().sub, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getCustomShare(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/openraito/patient/customshare/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    setCustomShare(info){
      //cargar las faqs del knowledgeBaseID
      return this.http.post(environment.api+'/api/openraito/patient/customshare/'+this.authService.getCurrentPatient().sub, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getIndividualShare(){
      //cargar las faqs del knowledgeBaseID
      return this.http.get(environment.api+'/api/openraito/patient/individualshare/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    setIndividualShare(info){
      //cargar las faqs del knowledgeBaseID
      return this.http.post(environment.api+'/api/openraito/patient/individualshare/'+this.authService.getCurrentPatient().sub, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getDocuments(){
      return this.http.get(environment.api+'/api/documents/'+this.authService.getCurrentPatient().sub).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    addDocument(info){
      return this.http.post(environment.api+'/api/document/'+this.authService.getCurrentPatient().sub, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    deleteDocument(documentId){
      return this.http.delete(environment.api+'/api/document/'+documentId).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

}
