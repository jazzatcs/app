export interface KeyValueObj {
  [key: string]: string;
}

export type Props = {
  [key: string]: any;
};



export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export interface TypeAppSdkConfigState {
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  contentTypeConfig: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface TypeItem {
  id: string;
  type: string;
  name: string;
}

export interface TypeSelectedItems {
  items: TypeItem[];
  removeItems: Function;
  setRearrangedItems: Function;
}


export type RECORD = {
  id: number;
  checked: boolean;
  item: string;
  key: string;
  description: string;
};