import { Popover, StepMap } from './step.model';
import { StepBuilder } from './step-builder';

export const linear: StepMap = new StepBuilder()
  .popover('Popover 1')
  .popover('Popover 2')
  .popover('Popover 3')
  .done();

export const emptyBranch: StepMap = new StepBuilder()
  .popover('Popover 1')
  .branch('Branch 1')
  .done();

export const yesBranch: StepMap = new StepBuilder()
  .popover('Popover 1')
  .branch('Branch 1')
    .yes()
      .popover('Popover 2')
      .popover('Popover 3')
  .done();

export const noBranch: StepMap = new StepBuilder()
  .popover('Popover 1')
  .branch('Branch 1')
    .no()
      .popover('Popover 2')
      .popover('Popover 3')
  .done();

export const mixedBranch: StepMap = new StepBuilder()
  .popover('Popover 1')
  .branch('Branch 1')
    .yes()
      .popover('Popover 2')
      .popover('Popover 3')
    .no()
      .popover('Popover 5')
  .branchEnd()
  .popover('Popover 6')
  .done();

export const yesNoBranch: StepMap = new StepBuilder()
.popover('Popover 1')
.branch('Branch 1')
  .yes()
    .popover('Popover 2')
    .branch('Branch2')
      .yes()
        .popover('Popover 2.1')
      .no()
        .popover('Popover 2.2')
    .branchEnd()
  .no()
    .popover('Popover 4')
    .popover('Popover 5')
.branchEnd()
.popover('Popover 7')
.done();
