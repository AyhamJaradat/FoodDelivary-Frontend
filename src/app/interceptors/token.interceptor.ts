import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';


interface RequestCloneParameters
{
    headers?: HttpHeaders;
    reportProgress?: boolean;
    params?: HttpParams;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
    body?: any | null;
    method?: string;
    url?: string;
    setHeaders?: {
        [name: string]: string | string[];
    };
    setParams?: {
        [param: string]: string;
    };
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private apiUrl =  environment.api_base_url; //process.env.API_URL;
  private authService: AuthService;

  /**
   * Constructor
   * @param {Injector} injector
   */
  constructor(
    private injector: Injector
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    let requestConstructor: RequestCloneParameters = {};

    return from ( this.authService.getUserAuthToken() )
      .pipe(mergeMap(token =>
      {
        // Fix URL for REST API endpoints
        let url = request.url;
        let isExternal = !url.startsWith('http://') && !url.startsWith('https://');
        let isLang = url.startsWith('./assets/i18n') || url.startsWith('assets/i18n') ;
        if (isExternal && !isLang)
          requestConstructor.url = this.apiUrl + url;

        // Inject JWT
        if ( token ) {
          requestConstructor.setHeaders = {
            Authorization: `Bearer ${token}`
          };
        }

        // Create the new request
        let modifiedRequest: HttpRequest<any> = request.clone( requestConstructor );

        // Return
        return next.handle(modifiedRequest);
      }));
  }
}
