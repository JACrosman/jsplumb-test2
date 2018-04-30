import { StepMap, IStep, Popover, IBranch, Branch } from './step.model';

export class StepBuilder {
  stepMap: StepMap;
  previousStep: IStep;
  branches: Branch[];
  addYes: boolean;
  addNo: boolean;

  constructor() {
    this.stepMap = { };
    this.branches = [];
  }

  nextId() {
    return this.previousStep ? this.previousStep.id + 1 : 1;
  }

  previousId() {
    if (this.addYes || this.addNo) {
      return this.getBranch().id;
    }

    return this.previousStep ? this.previousStep.id : 0;
  }

  getBranch() {
    return this.branches[this.branches.length - 1];
  }

  popover(name: string) {
    const step = new Popover(this.nextId(), name, null, this.previousId(), null);

    return this.addStep(step);
  }

  branch(name: string) {
    const step = new Branch(this.nextId(), name, null, null, this.previousId());

    this.branches.push(step);

    return this.addStep(step);
  }

  branchEnd() {
    this.branches.pop();
    this.addNo = this.addYes = false;

    return this;
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
      this.getBranch().yes = step.id;
    } else if (this.addNo) {
      this.getBranch().no = step.id;
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
