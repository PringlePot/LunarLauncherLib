import axios from 'axios';
import {LaunchResponse} from '../types/launch';
import {MetadataResponse, SubVersion} from '../types/metadata';
import {LUNAR_BASE_URL} from '../util/constants';

export async function initializeLunarApi() {
  const metadata = await fetchMetadata();
  return new LunarApi(metadata);
}

async function fetchMetadata(): Promise<MetadataResponse> {
  const response = await axios.get(
    LUNAR_BASE_URL +
      'metadata?' +
      new URLSearchParams({
        branch: 'master',
      }),
    {
      headers: {
        'User-Agent': 'Lunar-Client Launcher Lib',
      },
    }
  );
  return response.data;
}

export default class LunarApi {
  metadata: MetadataResponse;

  constructor(metadata: MetadataResponse) {
    this.metadata = metadata;
  }

  async makeLaunchRequest(version: SubVersion): Promise<LaunchResponse> {
    // Lunar requires all body parameters to be set
    const response = await axios.post(LUNAR_BASE_URL + 'launch', {
      version: version.id,
      branch: 'master',
      module: 'lunar',
      os: process.platform,
      arch: process.arch,
      launch_type: 'OFFLINE',
      launcher_version: '2.10.1',
      hwid: 'dasdas',
      hwid_private: 'asdsa',
    });

    return response.data;
  }
}
