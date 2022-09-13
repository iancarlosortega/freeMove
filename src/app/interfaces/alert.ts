export interface Alert {
  idAlert: string;
  idUser: string;
  isActive: boolean;
  linkedAccount?: string;
  startTime?: number;
  endTime?: number;
  timeElapsed?: number;
  coordinates?: [number, number][];
  notificationStatus: NotificationStatus;
  emailToVinculate: string;
  emailFrom: string;
}

type NotificationStatus = 'accepted' | 'pending' | 'rejected';
