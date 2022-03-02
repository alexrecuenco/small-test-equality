import fc, { Arbitrary } from 'fast-check';
import { asyncDeepEquals, deepCopy } from '../src';

const EachSimpleType = [
  ['null', fc.constant(null)],
  ['string', fc.string()],
  ['integers', fc.integer()],
  ['doubles', fc.double()],
  ['dates', fc.date()],
] as const;

describe('deepEquals', () => {
  describe.each(EachSimpleType)('Simple type %p', (_, arb: Arbitrary<any>) => {
    test('Should work for simple types', async () => {
      await fc.assert(
        fc.asyncProperty(arb, async (v) => {
          return asyncDeepEquals(v, deepCopy(v));
        }),
      );
    });

    test('Should work for simple arrays', async () => {
      await fc.assert(
        fc.asyncProperty(fc.array(arb), async (arr) => {
          return asyncDeepEquals(arr, deepCopy(arr));
        }),
      );
    });
  });

  test('Should work for simple objects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.object({ maxDepth: 5, values: [fc.string(), fc.integer(), fc.double(), fc.date()] }),
        async (obj: any) => {
          return asyncDeepEquals(obj, deepCopy(obj));
        },
      ),
    );
  });

  describe('Incorrect comparisons', () => {
    const arbitrary: Arbitrary<any> = fc.oneof(
      fc.integer(),
      fc.date(),
      fc.object(),
      fc.string(),
      fc.array(fc.integer()),
    );
    test('should fail on different types', async () => {
      await fc.assert(
        fc.asyncProperty(arbitrary, arbitrary, async (a, b) => {
          // we are testing only when both objects are of different types
          fc.pre(typeof a !== typeof b);
          return (await asyncDeepEquals(a, b)) === false;
        }),
      );
    });

    test('should fail when compared to null', async () => {
      await fc.assert(
        fc.asyncProperty(arbitrary, async (a: any) => {
          return (await asyncDeepEquals(a, null)) === false;
        }),
      );
    });

    test('should fail for different sized arrays', async () => {
      expect(await asyncDeepEquals([1], [1, 2])).toBe(false);
    });
    test('should fail for different arrays', async () => {
      expect(await asyncDeepEquals([1], [2])).toBe(false);
    });
    test('should fail for different sized objects', async () => {
      expect(await asyncDeepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });
    test('should fail for different values', async () => {
      expect(await asyncDeepEquals({ a: 1 }, { a: 2 })).toBe(false);
    });
    test('should fail for different keys', async () => {
      expect(await asyncDeepEquals({ a: 1 }, { b: 1 })).toBe(false);
    });
    test('should fail for different dates', async () => {
      expect(await asyncDeepEquals(new Date(), new Date(0))).toBe(false);
    });
  });

  describe('Handcrafted examples', () => {
    const examples = [
      [[[]], [[]], true],
      [[1, { 1: [1] }], [1, { 1: [1] }], true],
      [[1, { 1: [1] }], [1, { 1: [1] }], true],
      [[1, 2], [2, 1], false],
      [[new Date(0), 1], [new Date(0), 2], false],
      [{ 1: { 1: { 2: 3, 4: 5, 5: 6 } } }, { 1: { 1: { 1: 2 } } }, false],
    ] as [any, any, boolean][];
    test.each(examples)('should work for %o and %o, returning %p', async (a: any, b: any, value: boolean) => {
      await expect(asyncDeepEquals(a, b)).resolves.toBe(value);
    });
  });
});
