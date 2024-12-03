import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//basics and internal modules
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//external modules
import { PrimengModule } from './modules/primeng/primeng.module';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxColorsModule } from 'ngx-colors';
import { ToastrModule } from 'ngx-toastr';
import { NgxPrintElementModule } from 'ngx-print-element';
import { NgChartsModule } from 'ng2-charts';
import {NgxPrintModule} from 'ngx-print';


//components 
import { AppComponent } from './app.component';
import { NavbarComponent } from './static_components/navbar/navbar.component';
import { FooterComponent } from './static_components/footer/footer.component';
import { FloatingInputComponent } from './shared_components/floating-input/floating-input.component';
import { OtherComponent } from './shared_components/other/other.component';
import { FixedTableGridWrapperComponent } from './reporting_components/wrappers-grid/fixed-table-grid-wrapper/fixed-table-grid-wrapper.component';
import { ReportGridWrapperComponent } from './reporting_components/wrappers-grid/report-grid-wrapper/report-grid-wrapper.component';
import { TabsGridWrapperComponent } from './reporting_components/wrappers-grid/tabs-grid-wrapper/tabs-grid-wrapper.component';
import { NestedGridWrapperComponent } from './reporting_components/wrappers-grid/nested-grid-wrapper/nested-grid-wrapper.component';
import { TableGridWrapperComponent } from './reporting_components/wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import { TextAreaGridWrapperComponent } from './reporting_components/wrappers-grid/textarea-grid-wrapper/textarea-grid-wrapper.component';
import { ImageGridWrapperComponent } from './reporting_components/wrappers-grid/image-grid-wrapper/image-grid-wrapper.component';
import { FunctionComponent } from './reporting_components/wrappers-tools/function/function.component';
import { AggregateComponent } from './reporting_components/wrappers-tools/aggregate/aggregate.component';
import { ExportationComponent } from './reporting_components/wrappers-others/exportation/exportation.component';
import { NestedPyramidGridWrapperComponent } from './reporting_components/wrappers-grid/nested-pyramid-grid-wrapper/nested-pyramid-grid-wrapper.component';
import { PrepareExportationComponent } from './reporting_components/wrappers-others/prepare-exportation/prepare-exportation.component';
import { PrintingLoaderComponent } from './reporting_components/wrappers-others/printing-loader/printing-loader.component';

// register Handsontable's modules
registerAllModules();

@NgModule({
  declarations: [
    AppComponent,
    TableGridWrapperComponent,
    NavbarComponent,
    FooterComponent,
    FloatingInputComponent,
    OtherComponent,
    FunctionComponent,
    AggregateComponent,
    ImageGridWrapperComponent,
    FixedTableGridWrapperComponent,
    TextAreaGridWrapperComponent,
    ReportGridWrapperComponent,
    ExportationComponent,
    NestedGridWrapperComponent,
    TabsGridWrapperComponent,
    NestedPyramidGridWrapperComponent,
    PrepareExportationComponent,
    PrintingLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HotTableModule,
    PrimengModule,
    AngularEditorModule,
    NgxColorsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    
    NgxPrintElementModule,
    NgChartsModule,
    NgxPrintModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
