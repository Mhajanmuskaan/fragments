const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory');

describe('memory data backend', () => {
  const fragment = {
    id: 'fragment-1',
    ownerId: 'user-1',
    created: '2026-01-01T00:00:00.000Z',
    updated: '2026-01-01T00:00:00.000Z',
    type: 'text/plain',
    size: 5,
  };

  test('writeFragment() returns a Promise and stores fragment metadata', async () => {
    const result = writeFragment(fragment);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBeUndefined();

    const stored = await readFragment(fragment.ownerId, fragment.id);

    expect(stored).toEqual(fragment);
  });

  test('readFragment() returns a Promise and reads fragment metadata', async () => {
    await writeFragment(fragment);

    const result = readFragment(fragment.ownerId, fragment.id);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual(fragment);
  });

  test('writeFragmentData() returns a Promise and stores fragment data', async () => {
    const buffer = Buffer.from('hello');

    const result = writeFragmentData(fragment.ownerId, fragment.id, buffer);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBeUndefined();

    const stored = await readFragmentData(fragment.ownerId, fragment.id);

    expect(stored).toEqual(buffer);
  });

  test('readFragmentData() returns a Promise and reads fragment data', async () => {
    const buffer = Buffer.from('hello');

    await writeFragmentData(fragment.ownerId, fragment.id, buffer);

    const result = readFragmentData(fragment.ownerId, fragment.id);

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual(buffer);
  });

  test('readFragment() returns undefined for missing fragment metadata', async () => {
    await expect(readFragment('missing-user', 'missing-id')).resolves.toBeUndefined();
  });

  test('readFragmentData() returns undefined for missing fragment data', async () => {
    await expect(readFragmentData('missing-user', 'missing-id')).resolves.toBeUndefined();
  });
});