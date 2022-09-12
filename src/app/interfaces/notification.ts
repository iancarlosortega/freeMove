export interface Notification {
  idNotification?: string;
  idUser: string;
  title: string;
  message: string;
  url: string;
}

export interface LinkAccountNotification extends Notification {
  idUserFrom: string;
  idAlert: string;
  emailToVinculate: string;
  emailFrom: string;
  status: NotificationStatus;
}

type NotificationStatus = 'accepted' | 'pending' | 'rejected';
