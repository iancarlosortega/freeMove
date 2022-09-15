export interface Alert {
  idAlert: string;
  idUser: string;
  isActive: boolean;
  linkedAccount?: string;
  startTime?: number;
  startPosition?: [number, number];
  endTime?: number;
  endPosition?: [number, number];
  coordinates?: [number, number][];
  notificationStatus: NotificationStatus;
  emailToVinculate: string;
  emailFrom: string;
}

type NotificationStatus = 'accepted' | 'pending' | 'rejected';
