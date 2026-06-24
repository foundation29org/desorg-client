import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PerfectScrollbarStubDirective } from './directives/perfect-scrollbar-stub.directive';

import { FooterComponent } from './footer/footer.component';
import { Footer2Component } from './footer2/footer2.component';
import { FooterLandComponent } from './footer-land/footer-land.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarComponentNolog } from './navbar-nolog/navbar-nolog.component';
import { NavbarD29Component } from './navbar-dx29/navbar-dx29.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomizerComponent } from './customizer/customizer.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';

import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
import { SidebarDirective } from './directives/sidebar.directive';
import { SidebarLinkDirective } from './directives/sidebarlink.directive';
import { SidebarListDirective } from './directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebaranchortoggle.directive';
import { SidebarToggleDirective } from './directives/sidebartoggle.directive';

@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    Footer2Component,
    FooterLandComponent,
    NavbarComponent,
    NavbarComponentNolog,
    NavbarD29Component,
    SidebarComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarDirective,
    NgbModule,
    TranslateModule
  ],
  imports: [
    FormsModule,
    CustomFormsModule,
    RouterModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    MatCheckboxModule
  ],
  declarations: [
    FooterComponent,
    Footer2Component,
    FooterLandComponent,
    NavbarComponent,
    NavbarComponentNolog,
    NavbarD29Component,
    SidebarComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarDirective,
    SidebarLinkDirective,
    SidebarListDirective,
    SidebarAnchorToggleDirective,
    SidebarToggleDirective,
    PerfectScrollbarStubDirective
  ]
})
export class SharedModule {}
