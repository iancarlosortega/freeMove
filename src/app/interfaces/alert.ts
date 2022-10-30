import firebase from 'firebase/compat';
export interface Alert {
  idAlert: string;
  idUser: string;
  isActive: boolean;
  linkedAccount?: string;
  startTime?: firebase.firestore.Timestamp;
  startPosition?: [number, number];
  endTime?: firebase.firestore.Timestamp;
  endPosition?: [number, number];
  coordinates?: [number, number][];
  notificationStatus: NotificationStatus;
  emailToVinculate: string;
  emailFrom: string;
}

type NotificationStatus = 'accepted' | 'pending' | 'rejected';
