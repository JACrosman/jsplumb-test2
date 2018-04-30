import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef, Renderer2, NgZone } from '@angular/core';

import { linear, emptyBranch, yesBranch, noBranch, mixedBranch, yesNoBranch } from './mocks';
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
  deltaY = 140;
  deltaX = 200;

  stepFunctionMap = {
    popover: this.processPopover.bind(this),
    branch: this.processBranch.bind(this)
  };

  brokenLinks: Array<{ from: number, to: number }>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log(mixedBranch);

    jsPlumb.ready(() => {
      this.ngZone.run(() => {
        this.renderSteps(mixedBranch);
      });
    });
  }

  renderSteps(steps: StepMap) {
    this.steps = steps;
    this.nodes = {};
    this.brokenLinks = [];
    const root = this.steps[1];
    this.stepContainer.clear();

    // (<Branch>this.steps[2]).converge = 6;
    this.steps[4].next = 6;
    this.steps[5].next = null;
    this.steps[6].previous = 4;

    this.processStep(root);

    for (let i = 0; i < this.brokenLinks.length; i++) {
      const link = this.brokenLinks[i];
      this.linkStep(link.from, link.to);
    }
  }

  processStep(step: IStep, linkText?: string) {
    this.renderStep(step);

    this.stepFunctionMap[step.type](step);

    this.linkStep(step.previous, step.id, linkText);
  }

  processPopover(popover: Popover) {
    this.yOffset += this.deltaY;

    if (popover.siblings) {
      // process parallel popovers
    }

    if (popover.next) {
      const stepNode = this.getStep(popover.next);
      const nextNode = this.getStepNode(popover.next);

      if (stepNode.previous === null) {
        this.linkStep(popover.id, popover.next);
      } else {
        this.processStep(this.getStep(popover.next));
      }
    }
  }

  processBranch(branch: Branch) {
    // Save previous offsets
    this.yOffset += this.deltaY;
    const previousYOffset = this.yOffset;
    const previousXOffset = this.xOffset;
    let maxY = 0;

    // Process yes conditions
    if (branch.yes) {
      // Move nodes to the right
      this.xOffset += this.deltaX;

      // Draw the yes path
      this.processStep(this.getStep(branch.yes), 'Yes');

      // Save the depth
      maxY = this.yOffset;
    }

    // Process no conditions
    if (branch.no) {
      // Reset x position
      this.xOffset = previousXOffset;
      this.yOffset = previousYOffset;

      // Draw the no path
      this.processStep(this.getStep(branch.no), 'No');

      // Determine if the depth was higher
      maxY = this.yOffset > maxY ? this.yOffset : maxY;
    }

    this.yOffset = maxY;

    // Draw the convergence
    if (branch.converge) {
      this.processStep(this.getStep(branch.converge));
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

  linkStep(from: number, to: number, text?: string) {
    const fromNode = this.getStepNode(from);
    const toNode = this.getStepNode(to);
    const overlays = text ? [
      'Arrow',
      ['Label', { label: text, location: 100 }]
    ] : null;

    if (fromNode && toNode) {
      console.log('Drawing from ' + from + ' to ' + to);
      jsPlumb.connect({
        source: fromNode.instance.node.nativeElement,
        target: toNode.instance.node.nativeElement,
        paintStyle: { strokeWidth: 2, stroke: 'rgb(189,11,11)' },
        anchors: ['Bottom', 'Top'],
        connector: 'Flowchart',
        endpoint: 'Blank',
        overlays
      });
    } else if (fromNode) {
      this.brokenLinks.push({ from, to });
    }
  }

  getStep(id: number) {
    return this.steps[id];
  }

  getStepNode(id: number) {
    return this.nodes[id];
  }
}
