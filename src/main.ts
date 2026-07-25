import '@gershy/clearing';

// TODO: @gershy/throttler
export default class Throttler {
  
  protected limit: number;
  protected active: Set<any>;
  protected pending: { prm: PromiseLater<any>, fn: () => Promise<any> }[];
  
  constructor(limit: number) {
    if (limit < 1)                   throw Error('limit too low')[cl.mod]({ limit });
    if (Math.floor(limit) !== limit) throw Error('limit invalid')[cl.mod]({ limit });
    this.limit = limit;
    this.active = new Set();
    this.pending = [];
  }
  
  protected finish(donePrm) {
    
    this.active[cl.rem](donePrm);
    const next = this.pending.shift();
    if (!next) return;
    
    // Safely run `fn` - wire resolve+reject to the `Promise.later` value
    const { prm, fn } = next;
    this.do(fn).then(val => prm.resolve(val), err => prm.reject(err));
    
  }
  
  public do<T>(fn: () => Promise<T>): Promise<T> {
    
    if (this.active.size < this.limit) {
      
      const prm = fn(); // Synchronous throws will propagate!
      this.active.add(prm);
      return prm.finally(() => this.finish(prm));
      
    }
    
    const prm = Promise[cl.later]<T>();
    this.pending.push({ prm, fn });
    return prm;
    
  }
  
}