import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, Renderer2, NgZone } from '@angular/core';

import { linear, emptyBranch, yesBranch, noBranch, yesNoBranch } from './mocks';
import { StepMap, Popover, IStep, Branch } from './step.model';
import { StepComponent } from './step/step.component';

const jsPlumb = window.jsPlumb;

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  /** Container for steps */
  @ViewChild('stepHost', { read: ViewContainerRef }) stepContainer: ViewContainerRef;

  steps: StepMap;

  nodes: { [id: string]: ComponentRef<any> };

  xOffset = 0;
  yOffset = 0;
  deltaY = 200;
  deltaX = 200;

  stepFunctionMap = {
    popover: this.processPopover.bind(this),
    branch: this.processBranch.bind(this)
  };

  constructor(
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log(yesNoBranch);

    jsPlumb.ready(() => {
      this.ngZone.run(() => {
        this.renderSteps(yesNoBranch);
      });
    });
  }

  renderSteps(steps: StepMap) {
    this.steps = steps;
    this.nodes = { };
    const root = this.steps[1];
    this.stepContainer.clear();

    this.processStep(root);
  }

  processStep(step: IStep) {
    this.renderStep(step);

    this.stepFunctionMap[step.type](step);

    this.linkStep(step);
  }

  processPopover(popover: Popover) {
    this.yOffset += this.deltaY;

    if (popover.siblings) {
      // process parallel popovers
    }

     if (popover.next) {
       this.processStep(this.getStep(popover.next));
     }
  }

  processBranch(branch: Branch) {
    this.yOffset += this.deltaY;
    const previousYOffset = this.yOffset;

    if (branch.yes) {
      this.xOffset = this.deltaX;

      this.processStep(this.getStep(branch.yes));

      this.xOffset = 0;
    }

    if (branch.no) {
      this.yOffset = previousYOffset;
      this.processStep(this.getStep(branch.no));
    }
  }

  renderStep(step: IStep) {
    const factory = this.resolver.resolveComponentFactory(StepComponent);
    const nodeRef = this.stepContainer.createComponent(factory);
    nodeRef.instance.step = step;
    nodeRef.instance.position = { top: this.yOffset, left: this.xOffset };

    const element = nodeRef.instance.node.nativeElement;

    this.renderer.setStyle(element, 'top', `${this.yOffset}px`);
    this.renderer.setStyle(element, 'margin-left', `${this.xOffset - 40}px`);

    this.nodes[step.id] = nodeRef;
  }

  linkStep(step: IStep) {
    const prevNode = this.nodes[step.previous];
    const nextNode = this.nodes[step.id];

    if (prevNode && nextNode) {
      console.log('Drawing from ' + prevNode.instance.step.id + ' to ' + nextNode.instance.step.id);
      jsPlumb.connect({
        source: prevNode.instance.node.nativeElement,
        target: nextNode.instance.node.nativeElement,
        paintStyle: { strokeWidth: 2, stroke: 'rgb(189,11,11)' },
        anchors: ['Bottom', 'Top'],
        connector: 'Straight'
      });
    }
  }

  getStep(id: number) {
    return this.steps[id];
  }

  getStepNode(id: number) {
    return this.nodes[id];
  }
}
