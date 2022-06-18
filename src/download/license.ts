import {LaunchResponse} from '../types/launch';
import {mkdir} from 'fs/promises';
import {LICENSES_LOCATION} from '../util/constants';
import {FileToDownload} from '../types/own';
import {printOnCurrentLine, sha1Hash} from '../util/util';
import {downloadFiles} from '../util/downloads';
import path = require('path');

export async function downloadLicenses(launchData: LaunchResponse) {
  printOnCurrentLine('Downloading licenses...');
  try {
    await mkdir(LICENSES_LOCATION, {
      recursive: true,
    });
  } catch (e) {
    throw {
      short: 'Create directory',
      description: 'Could not create licenses directory.',
    };
  }
  const licensesToDownload: FileToDownload[] = [];

  for (const license of launchData.licenses) {
    const filePath = path.join(LICENSES_LOCATION, license.file);
    if ((await sha1Hash(filePath)) !== license.sha1) {
      licensesToDownload.push({
        url: license.url,
        saveTo: filePath,
      });
    }
  }

  await downloadFiles('LICENSE', licensesToDownload);
  printOnCurrentLine('Done license check!');
}
