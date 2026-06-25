import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge, mergeMap, concatMap } from 'rxjs/operators'

@Injectable()
export class Apif29NcrService {

    constructor(private http: HttpClient) {}

    getAnnotate_batch(segments){
        return this.http.post(environment.api+'/api/annotate_batch', segments).pipe(
          map((res: any) => {
            return res;
        }),
          catchError((err) => { console.log(err);
            return err; })
        )
    }

    getNoSegmentation(medicalText){
        var callJson= {"data":medicalText};
        return this.http.post(environment.ncrService, callJson).pipe(
          map((res: any) => {
            return res;
        }),
          catchError((err) => { console.log(err);
            return err; })
        )
    }
}
