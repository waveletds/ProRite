/**
 * Shared Type Definitions for ProRite AI
 */

export type AcademicLevel = 'ND/NCE' | 'HND' | 'Undergraduate' | 'Final Year' | 'Master\'s' | 'PhD';

export type AcademicStyle = 'APA 7th Edition' | 'MLA 9th Edition' | 'Harvard' | 'Chicago' | 'IEEE' | 'Vancouver';

export interface UserProfile {
  email: string;
  fullName: string;
  studentId?: string;
  academicLevel: AcademicLevel;
  institution: string;
  department: string;
  researchInterests: string[];
  plan: 'Free' | 'Student' | 'Researcher' | 'Institution';
  walletBalance: number; // in NGN/USD equivalent
}

export interface ResearchObjective {
  objective: string;
  question: string;
  hypothesis?: string;
}

export interface TopicDevelopment {
  topic: string;
  background: string;
  problemStatement: string;
  objectives: ResearchObjective[];
  scope: string;
  significance: string;
}

export interface AcademicProject {
  id: string;
  title: string;
  academicLevel: AcademicLevel;
  department: string;
  style: AcademicStyle;
  currentChapter: number;
  lastUpdated: string;
  chapters: {
    [key: number]: {
      title: string;
      content: string;
      references: string[];
    }
  };
  tableOfContents?: string[];
  comments?: SupervisorComment[];
  versions?: ProjectVersion[];
}

export interface SupervisorComment {
  id: string;
  author: string;
  text: string;
  chapter: number;
  timestamp: string;
  resolved: boolean;
}

export interface ProjectVersion {
  id: string;
  versionName: string;
  chapter: number;
  timestamp: string;
  content: string;
}

export interface AcademicSource {
  id: string;
  title: string;
  authors: string;
  year: number;
  source: string;
  doi?: string;
  url?: string;
  citeCount?: number;
  type: 'Journal' | 'Conference' | 'Book' | 'Thesis';
  abstract?: string;
  department?: string;
}

export interface CitationItem {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

export interface MarketplaceTemplate {
  id: string;
  title: string;
  price: number;
  downloads: number;
  rating: number;
  author: string;
  category: string;
  description: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  purpose: string;
  date: string;
  gateway?: 'Paystack' | 'Monnify' | 'Flutterwave';
}

export interface SimilarityReport {
  score: number;
  originalText: string;
  matches: {
    source: string;
    similarity: number;
    text: string;
    citation: string;
  }[];
  gaps: string[];
}
