import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../app/shared/auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge, mergeMap, concatMap } from 'rxjs/operators'

@Injectable()
export class RaitoService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    getPatients(){
      return this.http.get(environment.urlRaito+'/api/eo/patients/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPatient(idPatient){
      return this.http.get(environment.urlRaito+'/api/eo/patient/'+idPatient).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getOnlyPatients(meta){
      return this.http.post(environment.urlRaito+'/api/eo/onlypatients/'+this.authService.getGroup(), {meta:meta}).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getSeizures(){
      return this.http.get(environment.urlRaito+'/api/eo/seizures/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getDrugs(){
      return this.http.get(environment.urlRaito+'/api/eo/drugs/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPhenotypes(){
      return this.http.get(environment.urlRaito+'/api/eo/phenotypes/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getFeels(){
      return this.http.get(environment.urlRaito+'/api/eo/feels/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getProms(){
      return this.http.get(environment.urlRaito+'/api/eo/proms/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getWeights(){
      return this.http.get(environment.urlRaito+'/api/eo/weights/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getHeights(){
      return this.http.get(environment.urlRaito+'/api/eo/heights/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }


    getQuestionnairesGroup(){
      return this.http.get(environment.urlRaito+'/api/group/questionnaires/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    loadAllQuestionnaire(){
      //cargar las palabras del idioma
      return this.http.get(environment.urlRaito + '/api/resources/questionnaires/all').pipe(
          map((res: any) => {
            return res;
         }),
          catchError((err) => { console.log(err);
           return of({}); })
        )
    }

    loadQuestionnaire(questionnaireId: string){
      //cargar las palabras del idioma
      return this.http.get(environment.urlRaito + '/api/resources/questionnaire/'+questionnaireId).pipe(
          map((res: any) => {
            return res;
         }),
          catchError((err) => { console.log(err);
           return of({}); })
        )
    }

    newQuestionnaire(actualQuestionnaire){
      console.log(actualQuestionnaire);
      return this.http.post(environment.urlRaito+'/api/resources/questionnaire/'+this.authService.getGroup(), actualQuestionnaire).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    updateQuestionnaire(actualQuestionnaire){
      console.log(actualQuestionnaire);
      return this.http.put(environment.urlRaito+'/api/resources/questionnaire/'+this.authService.getGroup(), actualQuestionnaire).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    addlinkQuestionnaire(actualQuestionnaire){
      console.log(actualQuestionnaire);
      return this.http.post(environment.urlRaito+'/api/resources/questionnaire/add/'+this.authService.getGroup(), actualQuestionnaire).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    deletelinkQuestionnaire(actualQuestionnaire){
      console.log(actualQuestionnaire);
      return this.http.post(environment.urlRaito+'/api/resources/questionnaire/remove/'+this.authService.getGroup(), actualQuestionnaire).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    rateQuestionnaire(info){
      console.log(info);
      return this.http.post(environment.urlRaito+'/api/resources/questionnaire/rate/'+this.authService.getGroup(), info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getGroupFile(){
      return this.http.get(environment.urlRaito+'/api/group/configfile/'+this.authService.getGroup()).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
          return err; })
        )
    }

    loadPatientId(idPatient){
      return this.http.get(environment.urlRaito+'/api/patients/'+idPatient).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    loadRecommendedDose(){
      return this.http.get(environment.urlRaito+'/assets/jsons/recommendedDose.json').pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    loadGroups(){
      return this.http.get(environment.urlRaito+'/api/groupsnames/').pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    loadDrugsGroup(idGroup){
      return this.http.get(environment.urlRaito+'/api/group/medications/'+idGroup).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getFeelsPatient(idPatient, info){
      return this.http.post(environment.urlRaito+'/api/feels/dates/'+idPatient, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getSeizuresPatient(idPatient, info){
      return this.http.post(environment.urlRaito+'/api/seizures/dates/'+idPatient, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getMedicationsPatient(idPatient, info){
      return this.http.post(environment.urlRaito+'/api/medications/dates/'+idPatient, info).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPatientWeight(idPatient){
      return this.http.get(environment.urlRaito+'/api/weight/'+idPatient).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

    getPatientPhenotypes(idPatient){
      return this.http.get(environment.urlRaito+'/api/phenotypes/'+idPatient).pipe(
          map((res: any) => {
          return res;
         }),
          catchError((err) => { console.log(err);
             return of(null); })
        )
    }

}
