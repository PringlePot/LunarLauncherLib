import {LaunchResponse} from '../types/launch';
import {SubVersion} from '../types/metadata';
import path from 'path';
import {ARTIFACTS_LOCATION} from './constants';
import StreamZip from 'node-stream-zip';
import {mkdir} from 'fs/promises';
import {printOnCurrentLine} from './util';

export async function extractNatives(
  launchData: LaunchResponse,
  version: SubVersion
) {
  printOnCurrentLine('Extracting natives...');
  const versionArtifactLocation = path.join(ARTIFACTS_LOCATION, version.id);
  const nativesLocation = path.join(versionArtifactLocation, 'natives');
  const natives = launchData.launchTypeData.artifacts.find(value => {
    return value.type === 'NATIVES';
  })!;

  await mkdir(nativesLocation, {recursive: true});

  const zip = new StreamZip.async({
    file: path.join(versionArtifactLocation, natives.name),
  });

  await zip.extract(null, nativesLocation);
  await zip.close();
  printOnCurrentLine('Extracted natives.');
}
