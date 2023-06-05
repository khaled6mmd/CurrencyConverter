import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrencyDetailsComponent } from './currency-details/currency-details.component';
import { ConverterPanelComponent } from './converter-panel/converter-panel.component';
import { QueryParamsGuard } from './guards/query-params.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'converter-panel', pathMatch: 'full' },
      { path: 'converter-panel', component: ConverterPanelComponent },
      { path: 'details', component: CurrencyDetailsComponent, canActivate: [QueryParamsGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
