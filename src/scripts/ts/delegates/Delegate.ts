export interface DelegateSubscriber<TArg extends Array<any> | void, TRet> {
  (...args: TArg[]): TRet;
}

export class Delegate<TArg extends Array<any> | void> {
    protected readonly subs: Array<DelegateSubscriber<TArg, any>>;
    private unboxed;

    public isUnboxed() {
      return this.unboxed;
    }

    constructor() {
      this.subs = new Array<DelegateSubscriber<TArg, void>>()
    }

    public invoke(args: TArg): void {
      this.unboxed = true;
      for (let sub of this.subs) {
        sub(args);
      }
    }

    add(sub: DelegateSubscriber<TArg, any>) {
      this.subs.push(sub);
    }
}

export class Func<TArg extends Array<any>, TRet> extends Delegate<Array<any>> {
  public resolve(args: TArg): TRet {
    if (this.subs.length == 0) return null;
    return this.subs[this.subs.length - 1](args);
  }
}
