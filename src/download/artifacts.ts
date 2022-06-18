import {LaunchResponse} from '../types/launch';
import {mkdir} from 'fs/promises';
import path from 'path';
import {ARTIFACTS_LOCATION} from '../util/constants';
import {SubVersion} from '../types/metadata';
import {printOnCurrentLine, sha1Hash} from '../util/util';
import {downloadFiles} from '../util/downloads';

export async function downloadArtifacts(
  launchData: LaunchResponse,
  version: SubVersion
) {
  printOnCurrentLine('Downloading artifacts...');

  const versionArtifactLocation = path.join(ARTIFACTS_LOCATION, version.id);
  await mkdir(versionArtifactLocation, {
    recursive: true,
  });

  const artifactsToDownload = [];
  for (const artifact of launchData.launchTypeData.artifacts) {
    const filePath = path.join(versionArtifactLocation, artifact.name);
    if ((await sha1Hash(filePath)) !== artifact.sha1) {
      artifactsToDownload.push({
        url: artifact.url,
        saveTo: filePath,
      });
    }
  }

  await downloadFiles('ARTIFACTS', artifactsToDownload);
  printOnCurrentLine(
    'Checked ' + launchData.launchTypeData.artifacts.length + ' artifacts.'
  );
}
