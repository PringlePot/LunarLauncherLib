import {LaunchResponse} from '../types/launch';
import {mkdir} from 'fs/promises';
import {LICENSES_LOCATION, TEXTURES_LOCATION} from '../util/constants';
import path = require('path');
import {getTextureIndex, printOnCurrentLine, sha1Hash} from '../util/util';
import {downloadFiles} from '../util/downloads';

export async function downloadTextures(launchData: LaunchResponse) {
  printOnCurrentLine('Downloading textures');

  try {
    await mkdir(LICENSES_LOCATION, {
      recursive: true,
    });
  } catch (e) {
    throw {
      short: 'Create directory',
      description: 'Could not create textures directory.',
    };
  }

  const textureIndex = await getTextureIndex(launchData.textures.indexUrl);

  const texturesTodDownload = [];
  for (const texture of textureIndex.split('\n')) {
    const [fileName, hash] = texture.split(' ');
    const filePath = path.join(TEXTURES_LOCATION, fileName);

    if ((await sha1Hash(filePath)) !== hash) {
      texturesTodDownload.push({
        url: launchData.textures.baseUrl + hash,
        saveTo: filePath,
      });
    }
  }

  await downloadFiles('TEXTURES', texturesTodDownload);
  printOnCurrentLine(
    'Checked ' + textureIndex.split('\n').length + ' textures!'
  );
}
