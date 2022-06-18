import path = require('path');
import * as os from 'os';

export const LUNAR_BASE_URL = 'https://api.lunarclientprod.com/launcher/';

export const BASE_LOCATION = path.join(os.homedir(), '.lunarlib');

export const LICENSES_LOCATION = path.join(BASE_LOCATION, 'licenses');
export const TEXTURES_LOCATION = path.join(BASE_LOCATION, 'textures');

export const ARTIFACTS_LOCATION = path.join(BASE_LOCATION, 'artifacts');

export function defaultMinecraftDirectory() {
  switch (Object(os.type)()) {
    case 'Darwin':
      return path.join(os.homedir(), '/Library/Application Support/minecraft');
    case 'win32':
    case 'Windows_NT':
      return path.join(process.env.APPDATA || '', '.minecraft');
    default:
      return path.join(os.homedir(), '.minecraft');
  }
}
