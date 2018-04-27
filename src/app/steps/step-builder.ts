import { StepMap, IStep, Popover, IBranch, Branch } from './step.model';

export class StepBuilder {
  stepMap: StepMap;
  previousStep: IStep;
  latestBranch: Branch;
  addYes: boolean;
  addNo: boolean;

  constructor() {
    this.stepMap = { };
  }

  nextId() {
    return this.previousStep ? this.previousStep.id + 1 : 1;
  }

  previousId() {
    if (this.addYes || this.addNo) {
      return this.latestBranch.id;
    }

    return this.previousStep ? this.previousStep.id : 0;
  }

  popover(name: string) {
    const step = new Popover(this.nextId(), name, null, this.previousId(), null);

    return this.addStep(step);
  }

  branch(name: string) {
    const step = new Branch(this.nextId(), name, null, null, this.previousId());

    this.latestBranch = step;

    return this.addStep(step);
  }

  yes() {
    this.addYes = true;

    return this;
  }

  no() {
    this.addNo = true;

    return this;
  }

  addStep(step: IStep) {
    this.stepMap[step.id] = step;

    if (this.addYes) {
      this.latestBranch.yes = step.id;
    } else if (this.addNo) {
      this.latestBranch.no = step.id;
    } else if (this.previousStep) {
      this.previousStep.next = step.id;
    }

    this.previousStep = step;
    this.addYes = this.addNo = false;

    return this;
  }

  step() {
    return this.previousStep;
  }

  done() {
    return this.stepMap;
  }
}
