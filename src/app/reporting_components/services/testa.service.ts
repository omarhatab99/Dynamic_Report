import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, ReflectiveInjector, Type } from '@angular/core';
import { PrepareExportationComponent } from '../wrappers-others/prepare-exportation/prepare-exportation.component';
import { NestedGridWrapperComponent } from '../wrappers-grid/nested-grid-wrapper/nested-grid-wrapper.component';
import { TabsGridWrapperComponent } from '../wrappers-grid/tabs-grid-wrapper/tabs-grid-wrapper.component';

@Injectable({
  providedIn: 'root'
})
export class TestaService {

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {}
  
  openWindowAndLoadComponent(component: Type<any>, title: string = 'New Window') {
    // Open a new browser window
    const newWindow:any = window.open('', title, 'width=600,height=400');

    // Wait for the new window's document to be ready
    newWindow.document.write(`
      <html>
        <head><title>${title}</title></head>
        <body>
          <div id="dynamic-component-container"></div>
        </body>
      </html>
    `);
    
    newWindow.document.close(); // Finish writing to the document

    // Once the new window is ready, inject the Angular component
    const componentFactory = this.resolver.resolveComponentFactory(component);
    
    const componentRef: ComponentRef<any> = componentFactory.create(this.createInjector(newWindow));
    this.appRef.attachView(componentRef.hostView);
    newWindow.document.getElementById('dynamic-component-container')?.appendChild(componentRef.location.nativeElement);
  }

  private createInjector(newWindow: Window): Injector {
    // Here, we pass the current injector to the new window
    return ReflectiveInjector.resolveAndCreate([PrepareExportationComponent], this.injector);
  }
}
