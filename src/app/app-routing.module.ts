import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportGridWrapperComponent } from './reporting_components/wrappers-grid/report-grid-wrapper/report-grid-wrapper.component';
import { TabsGridWrapperComponent } from './reporting_components/wrappers-grid/tabs-grid-wrapper/tabs-grid-wrapper.component';
import { PrepareExportationComponent } from './reporting_components/wrappers-others/prepare-exportation/prepare-exportation.component';





const routes: Routes = [
  {path:"" , redirectTo : "GridReport" , pathMatch:"full"},
  {path:"GridReport" , component:ReportGridWrapperComponent},
  {path:"TabsGrid" , component:TabsGridWrapperComponent},
  {path:"Exportation" , component:PrepareExportationComponent},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule 
{ 
  
  
  

}
