import { NgModule } from '@angular/core';
import {TableModule} from 'primeng-lts/table';
import {ToastModule} from 'primeng-lts/toast';
import {CalendarModule} from 'primeng-lts/calendar';
import {SliderModule} from 'primeng-lts/slider';
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {ContextMenuModule} from 'primeng-lts/contextmenu';
import {DialogModule} from 'primeng-lts/dialog';
import {ButtonModule} from 'primeng-lts/button';
import {DropdownModule} from 'primeng-lts/dropdown';
import {ProgressBarModule} from 'primeng-lts/progressbar';
import {InputTextModule} from 'primeng-lts/inputtext';
import {DragDropModule} from 'primeng-lts/dragdrop';
import {TooltipModule} from 'primeng-lts/tooltip';
import { DynamicDialogModule} from 'primeng-lts/dynamicdialog';
import {ConfirmDialogModule} from 'primeng-lts/confirmdialog';
import {RadioButtonModule} from 'primeng-lts/radiobutton';
import {SidebarModule} from 'primeng-lts/sidebar';
import {AccordionModule} from 'primeng-lts/accordion';
import {EditorModule} from 'primeng-lts/editor';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {ColorPickerModule} from 'primeng-lts/colorpicker';
import {CheckboxModule} from 'primeng-lts/checkbox';
import {ListboxModule} from 'primeng-lts/listbox';
import {GalleriaModule} from 'primeng-lts/galleria';
import {ProgressSpinnerModule} from 'primeng-lts/progressspinner';
import {ToolbarModule} from 'primeng-lts/toolbar';

@NgModule({
  exports: [
    TableModule,
    ToastModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    CalendarModule,
    DynamicDialogModule,
    DragDropModule,
    TooltipModule,
    //ChartModule,
    ConfirmDialogModule,
    RadioButtonModule,
    SidebarModule,
    AccordionModule,
    EditorModule,
    InputSwitchModule,
    ColorPickerModule,
    CheckboxModule,
    ListboxModule,
    GalleriaModule,
    ProgressSpinnerModule,
    ToolbarModule
  ],
providers: []
})
export class PrimengModule { }
