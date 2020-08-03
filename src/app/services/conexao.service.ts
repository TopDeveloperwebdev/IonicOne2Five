import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { element } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class ConexaoService {

    constructor() {

    }


    conexaoOnline() {
        return (
            navigator.platform === 'Linux_x86_64'
                || navigator.platform === 'Win32'
                || navigator.platform === 'MacIntel' ? true : navigator.onLine);
    }

}