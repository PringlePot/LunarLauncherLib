import {FileToDownload} from '../types/own';
import {createWriteStream} from 'fs';
import Axios from 'axios';
import {mkdir} from 'fs/promises';
import path = require('path');
import PQueue from 'p-queue';
import {printOnCurrentLine} from './util';

export async function downloadFiles(prefix: string, files: FileToDownload[]) {
  if (files.length === 0) return;
  const queue = new PQueue({concurrency: 5});

  printOnCurrentLine(`[${prefix}] Downloading ${files.length} files`);
  for (const file of files) {
    await queue.add(async () => {
      await downloadFile(file);

      printOnCurrentLine(
        `[${prefix}] Downloaded ${Math.ceil(
          (files.indexOf(file) / files.length) * 100
        )}% (${files.indexOf(file) + 1}/${files.length})`
      );
    });
  }
  await queue.onIdle();
  printOnCurrentLine(`[${prefix}] Downloaded ${files.length} files\n`);
  return;
}

async function downloadFile(file: FileToDownload) {
  try {
    await mkdir(path.dirname(file.saveTo), {
      recursive: true,
    });
  } catch (e) {
    throw {
      short: 'Create directory',
      description: 'Could not create directory.',
    };
  }

  const writer = createWriteStream(file.saveTo);

  return Axios({
    method: 'get',
    url: file.url,
    responseType: 'stream',
  }).then(response => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: any = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}
