import { Component, OnInit, OnDestroy } from '@angular/core';
import { RaitoService } from 'app/shared/services/raito.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    standalone: false,
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.scss'],
    providers: [RaitoService]
})

export class DashboardAdminComponent implements OnInit, OnDestroy{


  constructor( public translate: TranslateService, private raitoService: RaitoService){

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    
  }

}
