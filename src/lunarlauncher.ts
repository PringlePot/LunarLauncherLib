import LunarApi, {initializeLunarApi} from './api/lunarapi';
import {SubVersion} from './types/metadata';
import {downloadLicenses, downloadTextures, downloadAssets} from './download';
import {downloadArtifacts} from './download/artifacts';
import {extractNatives} from './util/natives';
import {gatherClassPath, printOnCurrentLine} from './util/util';
import {ExecException} from 'child_process';
import path from 'path';
import {
  ARTIFACTS_LOCATION,
  defaultMinecraftDirectory,
  TEXTURES_LOCATION,
} from './util/constants';
import {machineIdSync} from 'node-machine-id';

const {exec} = require('child_process');

export async function initializeLauncher() {
  const api = await initializeLunarApi();
  return new LunarLauncher(api);
}

export default class LunarLauncher {
  API: LunarApi;
  // Because SubVersion has all the required asset information
  private chosenSubversion: SubVersion;

  constructor(api: LunarApi) {
    this.API = api;
    this.chosenSubversion = api.metadata.versions
      .find(value => value.default)!
      .subversions.find(value => value.default)!;
  }

  getVersions() {
    return this.API.metadata.versions;
  }

  getSubversion() {
    return this.chosenSubversion;
  }

  setVersion(version: string) {
    const foundVersion = this.API.metadata.versions.find(
      value => value.id === version
    );
    if (!foundVersion) {
      throw 'Invalid version';
    }
    this.chosenSubversion = foundVersion.subversions.find(
      value => value.default
    )!;
  }

  async launch() {
    const launchData = await this.API.makeLaunchRequest(this.chosenSubversion);

    // Make sure all the required files are downloaded
    await Promise.all([
      downloadLicenses(launchData),
      downloadTextures(launchData),
      downloadAssets(this.chosenSubversion),
    ]);

    // Launch the game
    await downloadArtifacts(launchData, this.chosenSubversion);
    await extractNatives(launchData, this.chosenSubversion);

    printOnCurrentLine('Launching lunar client!');
    await exec(
      `java -Djava.library.path=natives -cp ${gatherClassPath(launchData).join(
        'win32' === process.platform ? ';' : ':'
      )} ${launchData.launchTypeData.mainClass} --version ${
        this.chosenSubversion.id
      } --assetIndex ${
        this.chosenSubversion.assets.id
      } --gameDir ${defaultMinecraftDirectory()} --texturesDir ${TEXTURES_LOCATION} --accessToken 0 --userProperties {} --hwid ${machineIdSync()} --launcherVersion 2.2.10`,
      {
        cwd: path.join(ARTIFACTS_LOCATION, this.chosenSubversion.id),
      },
      (error: ExecException | null) => {
        console.error(error);
      }
    );
  }
}
