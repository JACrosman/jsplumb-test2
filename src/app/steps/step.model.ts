export interface IStep {
  id: number;
  name: string;
  type: string;

  next: number;
  previous: number;
}

export interface IPopover extends IStep {
  target: string;
  siblings: number[];
}

export interface IBranch extends IStep {
  yes: number;
  no: number;
}

export class Popover implements IPopover {
  type: string;
  target: string;

  constructor(
    public id: number,
    public name: string,
    public next: number,
    public previous: number,
    public siblings: number[]
  ) {
    this.type = 'popover';
  }
}

export class Branch implements IBranch {
  type: string;
  next: number;

  constructor(
    public id: number,
    public name: string,
    public yes: number,
    public no: number,
    public previous: number
  ) {
    this.type = 'branch';
  }
}

export type StepMap = { [id: number]: IStep };

