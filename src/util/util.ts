import {access, readFile} from 'fs/promises';
import {createHash} from 'crypto';
import axios from 'axios';
import * as os from 'os';
import path from 'path';
import {LaunchResponse, LaunchTypeData} from '../types/launch';

export async function sha1Hash(filePath: string) {
  if (await fileExists(filePath)) {
    const hash = createHash('sha1');
    try {
      hash.update(await readFile(filePath));
    } catch (e) {
      throw {
        short: 'Failed to read',
        description: 'Could not read file hash.',
      };
    }
    return hash.digest('hex');
  }
  return null;
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getTextureIndex(indexURL: string): Promise<string> {
  return axios.get(indexURL).then(value => {
    return value.data;
  });
}

export function printOnCurrentLine(text: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(text);
}

export function gatherClassPath(launchData: LaunchResponse) {
  const artifacts = [];
  for (const artifact of launchData.launchTypeData.artifacts) {
    if (artifact.type === 'CLASS_PATH') {
      artifacts.push(artifact.name);
    }
  }
  return artifacts;
}
