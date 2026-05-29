// // Use crypto.randomUUID() to create unique IDs, see:
// // https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
// const { randomUUID } = require('crypto');
// // Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
// const contentType = require('content-type');

// // Functions for working with fragment metadata/data using our DB
// const {
//   readFragment,
//   writeFragment,
//   readFragmentData,
//   writeFragmentData,
//   listFragments,
//   deleteFragment,
// } = require('./data');

// class Fragment {
//   constructor({ id, ownerId, created, updated, type, size = 0 }) {
//     if (!ownerId) {
//       throw new Error('ownerId is required');
//     }

//     if (!type) {
//       throw new Error('type is required');
//     }

//     if (!Fragment.isSupportedType(type)) {
//       throw new Error(`unsupported type: ${type}`);
//     }

//     if (typeof size !== 'number') {
//       throw new Error('size must be a number');
//     }

//     if (size < 0) {
//       throw new Error('size cannot be negative');
//     }

//     this.id = id || randomUUID();
//     this.ownerId = ownerId;
//     this.created = created || new Date().toISOString();
//     this.updated = updated || new Date().toISOString();
//     this.type = type;
//     this.size = size;
//   }

//   static async byUser(ownerId, expand = false) {
//   const fragments = await listFragments(ownerId, expand);

//   if (!expand) {
//     return fragments;
//   }

//   return fragments.map((fragment) =>
//     new Fragment(typeof fragment === 'string' ? JSON.parse(fragment) : fragment)
//   );
// }
//   static async byId(ownerId, id) {
//     const fragment = await readFragment(ownerId, id);

//     if (!fragment) {
//       throw new Error(`fragment not found: ${id}`);
//     }

//     return new Fragment(fragment);
//   }

//   static delete(ownerId, id) {
//     return deleteFragment(ownerId, id);
//   }

//   save() {
//     this.updated = new Date().toISOString();
//     return writeFragment(this);
//   }

//   getData() {
//     return readFragmentData(this.ownerId, this.id);
//   }

//   async delete() {
//   return deleteFragment(this.ownerId, this.id);
// }

//   async setData(data) {
//     if (!Buffer.isBuffer(data)) {
//       throw new Error('data must be a Buffer');
//     }

//     this.size = data.length;
//     this.updated = new Date().toISOString();

//     await writeFragment(this);
//     return writeFragmentData(this.ownerId, this.id, data);
//   }

//   get mimeType() {
//     const { type } = contentType.parse(this.type);
//     return type;
//   }

//   get isText() {
//     return this.mimeType.startsWith('text/');
//   }

//   get formats() {
//     if (this.mimeType === 'text/plain') {
//       return ['text/plain'];
//     }

//     return [];
//   }

//   static isSupportedType(value) {
//     try {
//       const { type } = contentType.parse(value);
//       return type === 'text/plain';
//     } catch {
//       return false;
//     }
//   }
// }

// module.exports.Fragment = Fragment;

const { randomUUID } = require('crypto');
const contentType = require('content-type');

const logger = require('../logger');

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
      throw new Error('ownerId is required');
    }

    if (!type) {
      throw new Error('type is required');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error(`unsupported type: ${type}`);
    }

    if (typeof size !== 'number') {
      throw new Error('size must be a number');
    }

    if (size < 0) {
      throw new Error('size cannot be negative');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  static async byUser(ownerId, expand = false) {
    logger.debug({ ownerId, expand }, 'Reading fragments by user');

    const fragments = await listFragments(ownerId, expand);

    if (!expand) {
      return fragments;
    }

    return fragments.map((fragment) =>
      new Fragment(typeof fragment === 'string' ? JSON.parse(fragment) : fragment)
    );
  }

  static async byId(ownerId, id) {
    logger.debug({ ownerId, id }, 'Reading fragment by id');

    const fragment = await readFragment(ownerId, id);

    if (!fragment) {
      throw new Error(`fragment not found: ${id}`);
    }

    return new Fragment(fragment);
  }

  static delete(ownerId, id) {
    logger.debug({ ownerId, id }, 'Deleting fragment');

    return deleteFragment(ownerId, id);
  }

  save() {
    logger.debug({ ownerId: this.ownerId, id: this.id }, 'Saving fragment metadata');

    this.updated = new Date().toISOString();

    return writeFragment(this);
  }

  getData() {
    logger.debug({ ownerId: this.ownerId, id: this.id }, 'Reading fragment data');

    return readFragmentData(this.ownerId, this.id);
  }

  async delete() {
    logger.debug({ ownerId: this.ownerId, id: this.id }, 'Deleting fragment');

    return deleteFragment(this.ownerId, this.id);
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('data must be a Buffer');
    }

    logger.debug(
      {
        ownerId: this.ownerId,
        id: this.id,
        size: data.length,
      },
      'Saving fragment data'
    );

    this.size = data.length;
    this.updated = new Date().toISOString();

    await writeFragment(this);

    return writeFragmentData(this.ownerId, this.id, data);
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);

    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    if (this.mimeType === 'text/plain') {
      return ['text/plain'];
    }

    return [];
  }

  static isSupportedType(value) {
    try {
      const { type } = contentType.parse(value);

      return type === 'text/plain';
    } catch {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;