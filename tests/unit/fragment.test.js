// const { Fragment } = require('../../src/model/fragment');

// describe('Fragment', () => {
//   test('constructor requires ownerId', () => {
//     expect(() => new Fragment({ type: 'text/plain' })).toThrow();
//   });

//   test('constructor requires type', () => {
//     expect(() => new Fragment({ ownerId: 'user1' })).toThrow();
//   });

//   test('creates a fragment with default values', () => {
//     const fragment = new Fragment({
//       ownerId: 'user1',
//       type: 'text/plain',
//     });

//     expect(fragment.id).toBeDefined();
//     expect(fragment.ownerId).toBe('user1');
//     expect(fragment.type).toBe('text/plain');
//     expect(fragment.size).toBe(0);
//     expect(fragment.created).toBeDefined();
//     expect(fragment.updated).toBeDefined();
//   });

//   test('save() stores a fragment in memory', async () => {
//     const fragment = new Fragment({
//       ownerId: 'user1',
//       type: 'text/plain',
//     });

//     await fragment.save();

//     const result = await Fragment.byId('user1', fragment.id);

//     expect(result).toEqual(fragment);
//   });

//   test('byUser() returns all fragments for a user', async () => {
//     const fragment = new Fragment({
//       ownerId: 'user2',
//       type: 'text/plain',
//     });

//     await fragment.save();

//     const results = await Fragment.byUser('user2');

//     expect(Array.isArray(results)).toBe(true);
//     expect(results).toContainEqual(fragment);
//   });

//   test('setData() stores data and updates size', async () => {
//     const fragment = new Fragment({
//       ownerId: 'user3',
//       type: 'text/plain',
//     });

//     await fragment.setData(Buffer.from('hello'));

//     const data = await fragment.getData();

//     expect(data.toString()).toBe('hello');
//     expect(fragment.size).toBe(5);
//   });

//   test('setData() rejects non-buffer data', async () => {
//     const fragment = new Fragment({
//       ownerId: 'user4',
//       type: 'text/plain',
//     });

//     await expect(fragment.setData('hello')).rejects.toThrow();
//   });

//   test('delete() removes a fragment', async () => {
//     const fragment = new Fragment({
//       ownerId: 'user5',
//       type: 'text/plain',
//     });

//     await fragment.save();
//     await fragment.delete();

//     const result = await Fragment.byId('user5', fragment.id);

//     expect(result).toBeUndefined();
//   });
// });

const { Fragment } = require('../../src/model/fragment');

describe('Fragment', () => {
  test('constructor requires ownerId', () => {
    expect(() => new Fragment({ type: 'text/plain' })).toThrow();
  });

  test('constructor requires type', () => {
    expect(() => new Fragment({ ownerId: 'user1' })).toThrow();
  });

  test('creates a fragment with default values', () => {
    const fragment = new Fragment({
      ownerId: 'user1',
      type: 'text/plain',
    });

    expect(fragment.id).toBeDefined();
    expect(fragment.ownerId).toBe('user1');
    expect(fragment.type).toBe('text/plain');
    expect(fragment.size).toBe(0);
    expect(fragment.created).toBeDefined();
    expect(fragment.updated).toBeDefined();
  });

  test('save() stores a fragment in memory', async () => {
    const fragment = new Fragment({
      ownerId: 'user1',
      type: 'text/plain',
    });

    await fragment.save();

    const result = await Fragment.byId('user1', fragment.id);

    expect(result).toEqual(fragment);
  });

  test('byUser() returns all fragment ids for a user', async () => {
    const fragment = new Fragment({
      ownerId: 'user2',
      type: 'text/plain',
    });

    await fragment.save();

    const results = await Fragment.byUser('user2');

    expect(Array.isArray(results)).toBe(true);
    expect(results).toContain(fragment.id);
  });

  test('byUser() returns expanded fragments when expand is true', async () => {
    const fragment = new Fragment({
      ownerId: 'user-expanded',
      type: 'text/plain',
    });

    await fragment.save();

    const results = await Fragment.byUser('user-expanded', true);

    expect(Array.isArray(results)).toBe(true);
    expect(results).toContainEqual(fragment);
  });

  test('setData() stores data and updates size', async () => {
    const fragment = new Fragment({
      ownerId: 'user3',
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('hello'));

    const data = await fragment.getData();

    expect(data.toString()).toBe('hello');
    expect(fragment.size).toBe(5);
  });

  test('setData() rejects non-buffer data', async () => {
    const fragment = new Fragment({
      ownerId: 'user4',
      type: 'text/plain',
    });

    await expect(fragment.setData('hello')).rejects.toThrow();
  });

  test('delete() removes a fragment', async () => {
    const fragment = new Fragment({
      ownerId: 'user5',
      type: 'text/plain',
    });

    // await fragment.save();
    // await fragment.delete();

    await fragment.save();
    await fragment.setData(Buffer.from('hello'));
    await fragment.delete();

    await expect(Fragment.byId('user5', fragment.id)).rejects.toThrow();
  });
});