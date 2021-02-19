import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Storage } from '@ionic/storage';
import { Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  protected LANG_STORAGE_KEY = 'lang';
  protected DIR_STORAGE_KEY = 'dir';

  public isRtl$ = new BehaviorSubject<boolean>(false);
  public isRtl: boolean;

  constructor(
    public storage: Storage,
    private translate: TranslateService,
    private platform:Platform,
    public loading: LoadingController,
  ) { }



  public setDefault(lang) {
    this.getLang().then(res => {
      if (!res) {
        this.setLang(lang);
        return;
      }
      this.setLang(res);
      return;
    })
  }

  public setLang(lang:string):void {
    this.isRtl =  lang=='ar';
    let appDirection = this.isRtl ? 'rtl' : 'ltr';
    let appStartSide = this.isRtl ? true : false;
    // this.translate.setDefaultLang('en');
    this.translate.use(lang).toPromise()
    .then(languageObject => {
      this.storage
        .set(this.LANG_STORAGE_KEY, lang);
      this.storage
        .set(this.DIR_STORAGE_KEY, appDirection);
      // this.platform
      //   .setDir(appDirection, true);
      // this.platform
      //   .setLang(lang, true);
      this.isRtl$
        .next(appStartSide);
    });
  }

  public getLang(): Promise<string> {
    return this.storage.get(this.LANG_STORAGE_KEY);
  }

  public getSupported(): Promise<any> {
    //app 0.3 > supported languages will be dynamic
    let supportedLangs = [
      {
        title: 'English',
        value: 'en',
        flag: 'us'
      }
      ,{
        title: 'العربية',
        value: 'ar',
        flag: 'ar'
      }
    ];

    if (supportedLangs)
      return Promise.resolve(supportedLangs);

    else
      return Promise.reject('No Supported Langs');
  }

  public translator(key: string): string {
    let value;
    this.translate.get(key)
      .subscribe(res => value = res);

    return value;
  }

  public get(key: string): Observable<string> {
    return this.translate
      .get(key);
  }

  public getPromise(key: string): Promise<string> {
    return this
      .get(key)
      .toPromise();
  }

  public t(key: string): Observable<string> {
    return this.translate.stream(key)
  }


}
