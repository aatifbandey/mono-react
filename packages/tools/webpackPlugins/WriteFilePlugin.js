import fs from 'fs-extra';
import path from 'path';

export default class WriteFilePlugin {
  constructor({ dest, data, operationName = 'Writing file...' }) {
    this.data = data;
    this.dest = dest;
    this.operationName = operationName;
  }

  apply(compiler) {
    compiler.hooks.done.tap('WriteFilePlugin', () => {
      if (this.dest && this.data) {
        console.log(`[WriteFilePlugin] Doing operation: "${this.operationName}"`);

        const dirname = path.dirname(this.dest);

        try {
          fs.ensureDirSync(dirname);

          if (typeof this.data === 'function') {
            fs.writeFileSync(this.dest, this.data());
          } else {
            fs.writeFileSync(this.dest, this.data);
          }

          console.log(`[WriteFilePlugin] Successfully finished operation: "${this.operationName}"`);
        } catch (err) {
          throw new Error(`[WriteFilePlugin] An error occured while doing operation: "${this.operationName}"`);
        }
      }
    });
  }
}
