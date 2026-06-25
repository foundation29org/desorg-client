import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { EqualToValidatorModule } from 'app/shared/directives/equal-to-validator.module';
import { FullPagesRoutingModule } from "./full-pages-routing.module";
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserProfilePageComponent } from "./user-profile/user-profile-page.component";
import { SupportComponent } from './support/support.component';


@NgModule({
    exports: [
        TranslateModule
    ],
    imports: [
        CommonModule,
        FullPagesRoutingModule,
        FormsModule,
        NgbModule,
        TranslateModule,
        EqualToValidatorModule
    ],
    declarations: [
        UserProfilePageComponent,
        SupportComponent
    ]
})
export class FullPagesModule { }
