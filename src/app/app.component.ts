import { Component, OnInit } from '@angular/core';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  AppState,
  LocalStorageService,
  routeAnimations,
  selectIsAuthenticated
} from '@app/core';
import { environment as env } from '@env/environment';
import { select, Store } from '@ngrx/store';
import browser from 'browser-detect';
import { Observable } from 'rxjs';

import {
  ActionSettingsChangeAnimationsPageDisabled,
  ActionSettingsChangeLanguage,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader
} from './settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/logo.svg');
  languages = ['en', 'zh'];
  navigation = [{ link: 'manage', label: 'menu.manage' }];

  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  constructor(private store: Store<AppState>, private storageService: LocalStorageService) {
    window.onresize = () => {
      // https://blog.khophi.co/angular-material-2-responsive-sidebar-menu-navigation/
      // https://medium.com/@lopesgon/angular-material-a-responsive-sidenav-ef1d06b37986
      // set screenWidth on screen size change
    };
  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        new ActionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  onLoginClick() {
    this.store.dispatch(new ActionAuthLogin());
  }

  onLogoutClick() {
    this.store.dispatch(new ActionAuthLogout());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(new ActionSettingsChangeLanguage({ language }));
  }

  isMediumWidth() {
    return window.innerWidth >= 768;
  }

  isLargeWidth() {
    return window.innerWidth >= 992;
  }
}
