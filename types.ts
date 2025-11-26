
export interface Verse {
  id: number;
  referencia: string;
  descricao: string;
  tema: string;
}

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
