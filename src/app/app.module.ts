import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// NG Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserMenuComponent } from './components/browser-menu/browser-menu.component';
import { BrowserPaneContainerComponent } from './components/browser-pane-container/browser-pane-container.component';
import { BrowserPaneComponent } from './components/browser-pane/browser-pane.component';
import { BrowserComponent } from './components/browser/browser.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { SparrowContextMenuComponent } from './components/sparrow-context-menu/sparrow-context-menu.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabComponent } from './components/tab/tab.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { StaticDataService } from './services/static-data-service/static-data-service.service';
import { UserDataService } from './services/user-data-service/user-data-service.service';
import { SharedModule } from './shared/shared.module';
import { WindowDragControlDirective } from './directives/window-drag-control.directive';


// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

export function initializeApplication(userData: UserDataService, staticData: StaticDataService): () => Promise<any> {
  return (): Promise<void> => new Promise<void>((resolve) => {
    userData.initialize().then((res) => {
      staticData.initialize().then((b) => {
        resolve();
      });
    });
  });
}

@NgModule({
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    TitlebarComponent,
    BrowserPaneContainerComponent,
    BrowserPaneComponent,
    NavigationBarComponent,
    TabBarComponent,
    TabComponent,
    BrowserComponent,
    BrowserMenuComponent,
    SparrowContextMenuComponent,
    ClickOutsideDirective,
    WindowDragControlDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApplication, deps: [UserDataService, StaticDataService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
