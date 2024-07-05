import { Injectable } from '@angular/core';
import { ClaimsDto } from '../models/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setUserClaims(claim:any)
  {
    localStorage.setItem(environment.claimKey, JSON.stringify(claim));
  }

  public getUserClaims(): ClaimsDto | null
  {
    const claims = localStorage.getItem(environment.claimKey);
    if (claims)
    {
      const userData: ClaimsDto = JSON.parse(claims);
      return userData;
    }
    return null;
  }

  public removeUserClaims()
  {
    localStorage.removeItem(environment.claimKey);
  }
}
