// src/services/auth.service.ts
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

class AuthService {
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) throw new Error("Authentication failed");

            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return { user, isNewUser: true };
            }

            return { user, isNewUser: false };
        } catch (error) {
            console.error('Google Sign-in Error:', error);
            throw error;
        }
    }

    async completeProfile(uid: string, name: string, role: string) {
        await setDoc(doc(db, 'users', uid), {
            name,
            role,
            createdAt: new Date(),
        });
    }

    async logout() {
        await signOut(auth);
    }
}

export default new AuthService();
