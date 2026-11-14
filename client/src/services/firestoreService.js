import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

export const firestoreService = {
  // Save or update user profile document
  async saveUserProfile(user, additionalData = {}) {
    if (!db || !user?.uid) return null;
    const userRef = doc(db, "users", user.uid);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || "Learner",
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
      ...additionalData,
    };
    await setDoc(userRef, data, { merge: true });
    return data;
  },

  // Save an assessment attempt
  async saveAssessment(userId, answers) {
    if (!db || !userId) return null;
    const assessmentsRef = collection(db, "assessments");
    const docRef = await addDoc(assessmentsRef, {
      userId,
      answers,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Save or update a chosen roadmap
  async saveRoadmap(userId, opportunity, roadmap) {
    if (!db || !userId) {
      throw new Error("User must be logged in to save roadmap");
    }

    const cleanRoadmap = (roadmap || []).map((step) => ({
      title: step.title || "",
      description: step.description || "",
      done: Boolean(step.done),
    }));

    const progressRef = collection(db, "progress");

    // Check if roadmap with same opportunity title exists for this user
    try {
      const q = query(
        progressRef,
        where("userId", "==", userId),
        where("opportunity.title", "==", opportunity.title)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const updateData = {
          opportunity: {
            title: opportunity.title,
            category: opportunity.category || "General",
            why: opportunity.why || "",
            matchScore: Number(opportunity.matchScore) || 90,
            startupCost: opportunity.startupCost || "₹0",
            earningPotential: opportunity.earningPotential || "Variable",
          },
          roadmap: cleanRoadmap,
          completedSteps: cleanRoadmap.filter((s) => s.done).length,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(doc(db, "progress", existingDoc.id), updateData);
        return { _id: existingDoc.id, ...updateData };
      }
    } catch (err) {
      console.warn("Index query fallback in saveRoadmap:", err.message);
    }

    // Create new progress record
    const newDoc = {
      userId,
      opportunity: {
        title: opportunity.title,
        category: opportunity.category || "General",
        why: opportunity.why || "",
        matchScore: Number(opportunity.matchScore) || 90,
        startupCost: opportunity.startupCost || "₹0",
        earningPotential: opportunity.earningPotential || "Variable",
      },
      roadmap: cleanRoadmap,
      completedSteps: cleanRoadmap.filter((s) => s.done).length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(progressRef, newDoc);
    return { _id: docRef.id, ...newDoc };
  },

  // Get all saved roadmaps for a user
  async getUserRoadmaps(userId) {
    if (!db || !userId) return [];
    try {
      const progressRef = collection(db, "progress");
      const q = query(progressRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const roadmaps = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          _id: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      });
      // Sort in-memory to prevent requiring composite Firestore indexes
      return roadmaps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
      return [];
    }
  },

  // Get single roadmap by doc ID
  async getRoadmapById(id) {
    if (!db || !id) throw new Error("Invalid roadmap ID");
    const docRef = doc(db, "progress", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      throw new Error("Roadmap not found");
    }
    const data = snap.data();
    return {
      _id: snap.id,
      ...data,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  },

  // Toggle or update milestone step
  async updateStep(progressId, stepIndex, done, currentRoadmap) {
    if (!db || !progressId) return;
    const progressRef = doc(db, "progress", progressId);

    const updatedRoadmap = [...currentRoadmap];
    if (updatedRoadmap[stepIndex]) {
      updatedRoadmap[stepIndex].done = done;
    }

    const completedCount = updatedRoadmap.filter((s) => s.done).length;

    await updateDoc(progressRef, {
      roadmap: updatedRoadmap,
      completedSteps: completedCount,
      updatedAt: serverTimestamp(),
    });

    return { roadmap: updatedRoadmap, completedSteps: completedCount };
  },

  // Delete saved roadmap
  async deleteRoadmap(progressId) {
    if (!db || !progressId) return;
    await deleteDoc(doc(db, "progress", progressId));
  },
};

