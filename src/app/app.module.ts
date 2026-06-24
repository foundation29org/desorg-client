import * as $ from 'jquery';
import { NgModule, LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData, DatePipe } from '@angular/common';
registerLocaleData(es);
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Angulartics2Module } from 'angulartics2';
import { QRCodeComponent } from 'angularx-qrcode';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';
import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { LandPageLayoutComponent } from './layouts/land-page/land-page-layout.component';

import { AuthService } from './shared/auth/auth.service';
import { TokenService } from './shared/auth/token.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { RoleGuard } from './shared/auth/role-guard.service';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { DateService } from 'app/shared/services/date.service';
import { SearchFilterPipe } from 'app/shared/services/search-filter.service';
import { HighlightSearch } from 'app/shared/services/search-filter-highlight.service';
import { TextTransform } from 'app/shared/services/transform-text.service';
import { LocalizedDatePipe } from 'app/shared/services/localizedDatePipe.service';
import { SortService } from 'app/shared/services/sort.service';
import { SearchService } from 'app/shared/services/search.service';
import { EventsService } from 'app/shared/services/events.service';
import { DialogService } from 'app/shared/services/dialog.service';
import { Data } from 'app/shared/services/data.service';
import { GoogleAnalyticsService } from './shared/services/google-analytics.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    ContentLayoutComponent,
    LandPageLayoutComponent,
    SearchFilterPipe,
    HighlightSearch,
    TextTransform,
    LocalizedDatePipe
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot(),
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    Angulartics2Module.forRoot(),
    QRCodeComponent
  ],
  providers: [
    AuthService,
    TokenService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
    DateService,
    SearchFilterPipe,
    HighlightSearch,
    TextTransform,
    LocalizedDatePipe,
    { provide: LOCALE_ID, useValue: 'es-ES' },
    SortService,
    SearchService,
    EventsService,
    DialogService,
    Data,
    GoogleAnalyticsService,
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
