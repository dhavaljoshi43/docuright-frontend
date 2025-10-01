// src/lib/anonymousTracking.ts

interface DocumentGeneration {
  id: string;
  documentType: string;
  timestamp: number;
  formData: any;
}

interface AnonymousUserData {
  generationCount: number;
  generations: DocumentGeneration[];
  lastPromptShown: string | null;
  hasSeenBanner: boolean;
  hasSeenModal: boolean;
}

const STORAGE_KEY = 'docuright_anonymous_user';
const MAX_FREE_GENERATIONS = 3;

export class AnonymousTracker {
  
  /**
   * Track a new document generation
   */
  static trackGeneration(documentType: string, formData: any): void {
    const userData = this.getUserData();
    
    const generation: DocumentGeneration = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentType,
      timestamp: Date.now(),
      formData: this.sanitizeFormData(formData)
    };
    
    userData.generations.push(generation);
    userData.generationCount++;
    
    this.saveUserData(userData);
  }
  
  /**
   * Get current user data from localStorage
   */
  static getUserData(): AnonymousUserData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading anonymous user data:', error);
    }
    
    return {
      generationCount: 0,
      generations: [],
      lastPromptShown: null,
      hasSeenBanner: false,
      hasSeenModal: false
    };
  }
  
  /**
   * Save user data to localStorage
   */
  static saveUserData(data: AnonymousUserData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving anonymous user data:', error);
    }
  }
  
  /**
   * Determine which registration prompt to show
   */
  static getPromptType(): 'none' | 'banner' | 'modal' | 'gate' {
    const userData = this.getUserData();
    const count = userData.generationCount;
    
    if (count === 0) return 'none';
    if (count === 1 && !userData.hasSeenBanner) return 'banner';
    if (count === 2 && !userData.hasSeenModal) return 'modal';
    if (count >= MAX_FREE_GENERATIONS) return 'gate';
    
    return 'none';
  }
  
  /**
   * Mark that user has seen a specific prompt type
   */
  static markPromptSeen(type: 'banner' | 'modal'): void {
    const userData = this.getUserData();
    
    if (type === 'banner') {
      userData.hasSeenBanner = true;
    } else if (type === 'modal') {
      userData.hasSeenModal = true;
    }
    
    userData.lastPromptShown = type;
    this.saveUserData(userData);
  }
  
  /**
   * Check if user has reached generation limit
   */
  static hasReachedLimit(): boolean {
    const userData = this.getUserData();
    return userData.generationCount >= MAX_FREE_GENERATIONS;
  }
  
  /**
   * Get remaining free generations
   */
  static getRemainingGenerations(): number {
    const userData = this.getUserData();
    return Math.max(0, MAX_FREE_GENERATIONS - userData.generationCount);
  }
  
  /**
   * Get all stored documents for potential claim on registration
   */
  static getStoredDocuments(): DocumentGeneration[] {
    const userData = this.getUserData();
    return userData.generations;
  }
  
  /**
   * Clear anonymous data (call after successful registration)
   */
  static clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing anonymous user data:', error);
    }
  }
  
  /**
   * Sanitize form data to only store essential info
   */
  private static sanitizeFormData(formData: any): any {
    // Only store document type, parties, and key metadata
    // Remove sensitive personal information
    return {
      documentType: formData.documentType || 'nda',
      firstPartyName: formData.firstPartyName,
      secondPartyName: formData.secondPartyName,
      effectiveDate: formData.effectiveDate,
      purposeOfNDA: formData.purposeOfNDA,
      useAIEnhancements: formData.useAIEnhancements
    };
  }
  
  /**
   * Get usage statistics for display
   */
  static getUsageStats() {
    const userData = this.getUserData();
    
    return {
      totalGenerations: userData.generationCount,
      remainingFree: this.getRemainingGenerations(),
      documents: userData.generations.map(gen => ({
        type: gen.documentType,
        date: new Date(gen.timestamp).toLocaleDateString()
      })),
      hasReachedLimit: this.hasReachedLimit()
    };
  }
}

export default AnonymousTracker;