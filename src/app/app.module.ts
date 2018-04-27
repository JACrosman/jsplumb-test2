import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { StepsComponent } from './steps/steps.component';
import { StepComponent } from './steps/step/step.component';

@NgModule({
  declarations: [
    AppComponent,
    StepsComponent,
    StepComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [
    StepComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
