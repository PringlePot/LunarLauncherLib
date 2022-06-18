export interface MetadataResponse {
  versions: Version[];

  // Don't know what this does
  branchReset: boolean;

  servers: Server[];

  blogPosts: BlogPost[];
  navItems: NavigationItem[];

  images: {
    logo: string;
    background: string;
  };

  theme: string;

  // Haven't ever seen this not be null
  alert: unknown;
}

export interface Version {
  id: string;
  description: string;
  default: boolean;

  images: {
    background: string;
    foreground: string;
  };

  subversions: SubVersion[];
}

interface SubVersion {
  id: string;
  default: boolean;
  snapshot: boolean;
  assets: {
    url: string;
    id: string;
  };
  modules: Module[];
}

interface Module {
  id: string;
  default: boolean;
  name: string;
  description: string;
  credits: string;
  image: string;
}

interface Server {
  name: string;
  icon: string;
  background: string;

  // IPs for pinging and joining
  ip: string;
  joinIp: string;
  pingIp: string;
  gameMode: string;
  region: string;

  placement: string[];
  supportedVersions: string[];
}

interface BlogPost {
  title: string;
  author: string;
  image: string;
  excerpt: string;
  link: string;
}

interface NavigationItem {
  name: string;
  remote?: string;
}
