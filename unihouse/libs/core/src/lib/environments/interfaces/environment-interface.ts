
export interface ExternalEnvironmentType {
  id: number;
  name: string;
  context: number;
}
export interface ExternalEnvironment {
  id: number;
  name: string;
  url: string;
  type: string;
  prod: boolean;
  createdby?: number;
  user_has_auth?: boolean;
}

export interface ExternalEnvironmentAuth {
  id: number;
  extenvid: number;
  userid?: number;
  apikey: string;
  username?: string;
}

export interface Collection {
  id: number;
  name: string;
  environments?: (number|ExternalEnvironment)[];
}

export interface CollectionEnvironment {
  id: number;
  environment_id: number;
  collection_id: number;
  // environment
}