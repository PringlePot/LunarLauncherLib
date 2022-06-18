export interface LaunchResponse {
  success: boolean;

  launchTypeData: LaunchTypeData;

  licenses: License[];
  textures: Textures;

  jre: JRE;
}

interface LaunchTypeData {
  artifacts: Artifact[];
  mainClass: string;
  ichor: boolean;
}

interface Artifact {
  name: string;
  sha1: string;
  url: string;
  type: 'CLASS_PATH' | 'NATIVES';
}

interface License {
  file: string;
  url: string;
  sha1: string;
}

interface Textures {
  indexUrl: string;
  indexSha1: string;
  baseUrl: string;
}

interface JRE {
  download: {
    url: string;
    extension: string;
  };
  executablePathInArchive: string[];
  checkFiles: string[][];
  extraArguments: string[];
  javawDownload: string;
  javawExeChecksum: string;
  javaExeChecksum: string;
}
