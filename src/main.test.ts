import { assertEqual, testRunner } from '../build/utils.test.ts';
import Throttler from './main.ts';

// Type testing
(async () => {
  
  type Enforce<Provided, Expected extends Provided> = { provided: Provided, expected: Expected };
  
  type Tests = {
    1: Enforce<{ x: 'y' }, { x: 'y' }>,
  };
  if (0) ((v?: Tests) => void 0)();
  
})();

testRunner([
  
  {
    name: 'basic case',
    fn: async () => {
      
      const throttler = new Throttler(3);
      const result = await Promise.all([
        throttler.do(async () => 'hi1'),
        throttler.do(async () => 'hi2'),
        throttler.do(async () => 'hi3'),
        throttler.do(async () => 'hi4'),
        throttler.do(async () => 'hi5'),
      ]);
      assertEqual(result, [ 'hi1', 'hi2', 'hi3', 'hi4', 'hi5' ]);
      
    }
  }
  
]);