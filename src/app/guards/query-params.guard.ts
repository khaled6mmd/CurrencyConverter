import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsGuard {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const queryParams = route.queryParams;

    if (!queryParams.hasOwnProperty('from') || !queryParams.hasOwnProperty('to')) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
