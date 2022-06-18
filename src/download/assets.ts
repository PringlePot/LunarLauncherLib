import path from 'path';
import {defaultMinecraftDirectory} from '../util/constants';
import {mkdir, writeFile} from 'fs/promises';
import {SubVersion} from '../types/metadata';
import axios from 'axios';
import {printOnCurrentLine, sha1Hash} from '../util/util';
import {downloadFiles} from '../util/downloads';

export async function downloadAssets(version: SubVersion) {
  printOnCurrentLine('Downloading assets...');
  const minecraftAssetsLocation = path.join(
    defaultMinecraftDirectory(),
    'assets'
  );
  const assetsIndex = path.join(minecraftAssetsLocation, 'indexes');

  await mkdir(assetsIndex, {recursive: true});

  const assetsIndexJson = path.join(assetsIndex, version.assets.id + '.json');
  const assetsJson = await axios.get(version.assets.url);

  try {
    writeFile(assetsIndexJson, JSON.stringify(assetsJson.data));
  } catch (e) {
    throw {
      short: 'Failed to write',
      description: 'Could not write assets to file.',
    };
  }
  const minecraftObjects = assetsJson.data.objects;
  const assetsToDownload = [];
  for (const minecraftObject in minecraftObjects) {
    const fileHash = minecraftObjects[minecraftObject].hash;
    const filePath = path.join(
      minecraftAssetsLocation,
      'objects',
      fileHash.substring(0, 2),
      fileHash
    );

    if ((await sha1Hash(filePath)) !== fileHash) {
      assetsToDownload.push({
        url:
          'https://resources.download.minecraft.net/' +
          fileHash.substring(0, 2) +
          '/' +
          fileHash,
        saveTo: filePath,
      });
    }
  }

  await downloadFiles('ASSETS', assetsToDownload);
  printOnCurrentLine('Checked minecraft assets.');
}
