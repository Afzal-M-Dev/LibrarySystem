import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { SystemRoleEnum } from '../models/enum';

export const authGuard: CanActivateFn = (route, state) => {
    const store = inject(StorageService);
    const router = inject(Router);

    const loggedInUser = store.getUserClaims();
    const roles = route.data?.['roles'] as Array<string>;

    if(loggedInUser && route.data?.['roles'] && (roles.find(x=>x===loggedInUser.role) || roles.find(x=>x==='all')))
    {
      return true;
    }
    else
    {
        router.navigate(['/login']);
        return false;
    }
  };

  export const authDeactiveGuard: CanActivateFn = (route, state) => {
    const store = inject(StorageService);
    const router = inject(Router);

    const loggedInUser = store.getUserClaims();
    if(loggedInUser)
    {
      if(loggedInUser?.role === SystemRoleEnum.Librarian)
        router.navigate(['/admin/home']);
      else
        router.navigate(['/user/home']);

      return false;
    }

    return true;
  };
