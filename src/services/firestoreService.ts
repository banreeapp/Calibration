import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import { db, auth } from './firebaseAuth';
import { MedicalDevice, CalibrationRecord, AuditLogItem } from '../types/medical';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on app startup
 */
export async function testFirestoreConnection(): Promise<boolean> {
  const testPath = 'devices';
  try {
    // Check connection using getDocFromServer
    await getDocFromServer(doc(db, testPath, 'test-connection-check')).catch(() => {
      // Document may not exist, which is fine as long as server responded
    });
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or waiting for initial connection.');
    }
    return false;
  }
}

/**
 * Seed initial Don Phut devices and records to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty(
  initialDevices: MedicalDevice[], 
  initialRecords: CalibrationRecord[]
) {
  try {
    const devicesSnap = await getDocs(collection(db, 'devices'));
    if (devicesSnap.empty) {
      console.log('Seeding initial devices to Firestore project calibration-4bb47...');
      for (const dev of initialDevices) {
        const cleanId = dev.id.replace('#', '');
        await setDoc(doc(db, 'devices', cleanId), dev);
      }
      for (const rec of initialRecords) {
        await setDoc(doc(db, 'calibrationRecords', rec.id), rec);
      }
      console.log('Firestore seeding completed successfully.');
    }
  } catch (err) {
    console.warn('Firestore seeding check finished with notice:', err);
  }
}

/**
 * Real-time listener for devices collection
 */
export function subscribeToDevices(onData: (devices: MedicalDevice[]) => void) {
  const colRef = collection(db, 'devices');
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: MedicalDevice[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as MedicalDevice);
      });
      onData(items);
    }
  }, (error) => {
    console.warn('Real-time devices listener notice:', error);
  });
}

/**
 * Save or update device in Firestore
 */
export async function saveDeviceToFirestore(device: MedicalDevice): Promise<void> {
  const cleanId = device.id.replace('#', '');
  const path = `devices/${cleanId}`;
  try {
    await setDoc(doc(db, 'devices', cleanId), device, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save calibration record in Firestore
 */
export async function saveCalibrationRecordToFirestore(record: CalibrationRecord): Promise<void> {
  const path = `calibrationRecords/${record.id}`;
  try {
    await setDoc(doc(db, 'calibrationRecords', record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save audit log to Firestore
 */
export async function saveAuditLogToFirestore(log: AuditLogItem): Promise<void> {
  const path = `auditLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'auditLogs', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
