import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { IStep } from '../step.model';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  @Input()
  step: IStep;

  @Input()
  position: { top: number, left: number };

  @ViewChild('node')
  node: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }
}
