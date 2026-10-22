// ==============================================================================
// FLUVIA FLOW - APPLICATION TYPES & INTERFACES
// ==============================================================================

export type UserRole = 'creator' | 'admin' | 'enterprise';

export interface ThemePreferences {
  colorTheme: string; // e.g. 'midnight-violet', 'ocean-blue', etc.
  mode: 'dark' | 'light' | 'system';
  completed: boolean;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  authProvider?: 'password' | 'google';
  googleId?: string;
  emailVerified?: boolean;
  onboardingData?: {
    primaryUseCase?: string;
    experienceLevel?: string;
    socialPlatforms?: string[];
    videoTypes?: string[];
    completed?: boolean;
  };
  themePreferences?: ThemePreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export type MediaType = 'video' | 'image' | 'audio' | 'script';
export type ProjectStatus = 'draft' | 'processing' | 'completed' | 'archived';

export interface TimelineClip {
  id: string;
  trackId: string;
  type: 'video' | 'image' | 'audio' | 'text';
  title: string;
  sourceUrl?: string;
  text?: string;
  startTimeSec: number;
  durationSec: number;
  offsetSec?: number;
  volume?: number;
  muted?: boolean;
  opacity?: number;
  style?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    positionX?: number;
    positionY?: number;
  };
}

export interface TimelineTrack {
  id: string;
  type: 'video' | 'overlay' | 'text' | 'audio';
  name: string;
  muted?: boolean;
  locked?: boolean;
}

export interface TimelineData {
  durationSec: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p' | '4k';
  backgroundColor?: string;
  tracks: TimelineTrack[];
  clips: TimelineClip[];
}

export interface Project {
  id: string;
  workspaceId: string;
  ownerId: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  status: ProjectStatus;
  thumbnailUrl?: string;
  timeline: TimelineData;
  metadata?: Record<string, any>;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Asset {
  id: string;
  workspaceId: string;
  ownerId: string;
  projectId?: string;
  assetType: 'video' | 'image' | 'audio' | 'font';
  name: string;
  storageKey: string;
  url: string;
  mimeType: string;
  fileSize: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface GenerationJob {
  id: string;
  userId: string;
  workspaceId: string;
  projectId?: string;
  providerId: string;
  modelId: string;
  status: JobStatus;
  progressPercent: number;
  progressMessage?: string;
  input: {
    prompt?: string;
    negativePrompt?: string;
    aspectRatio?: '16:9' | '9:16' | '1:1';
    durationSec?: number;
    resolution?: string;
    referenceImageUrl?: string;
    scriptText?: string;
    voiceId?: string;
    style?: string;
    [key: string]: any;
  };
  output?: {
    videoUrl?: string;
    thumbnailUrl?: string;
    audioUrl?: string;
    imageUrl?: string;
    transcript?: string;
    metadata?: Record<string, any>;
    isDemoSimulated?: boolean;
  };
  estimatedCredits: number;
  reservedCredits: number;
  actualCredits: number;
  providerRequestId?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreditAccount {
  userId: string;
  availableBalance: number;
  reservedBalance: number;
  updatedAt: string;
}

export type CreditTransactionType =
  | 'signup_bonus'
  | 'monthly_allowance'
  | 'subscription_grant'
  | 'purchase'
  | 'generation_reserve'
  | 'generation_settle'
  | 'refund'
  | 'admin_adjustment';

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  transactionType: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  relatedJobId?: string;
  paymentId?: string;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  priceInr: number;
  priceAnnualInr?: number;
  billingInterval: 'month' | 'year';
  creditsPerPeriod: number;
  category?: 'individual' | 'business';
  badge?: string;
  accentTheme?: 'basic' | 'pro' | 'max' | 'teams';
  features?: string[];
  entitlements: {
    maxResolution: '720p' | '1080p' | '4k';
    watermark: boolean;
    maxVideoLengthSec: number;
    supportedModels: string[];
    storageMb: number;
    priorityQueue?: boolean;
    brandKitsAllowed?: number;
    seatsAllowed?: number;
    commercialLicense?: boolean;
    apiAccess?: boolean;
    supportLevel?: 'community' | 'standard' | 'priority' | 'dedicated';
  };
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  providerSubscriptionId?: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  providerPaymentId?: string;
  amountInr: number;
  currency: 'INR' | 'USD';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentType: 'subscription' | 'credit_pack';
  webhookEventId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CreditPack {
  id: string;
  name: string;
  priceInr: number;
  creditAmount: number;
  isActive: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  providerType: 'video' | 'image' | 'audio' | 'text' | 'multimodal';
  configurationStatus: 'configured' | 'unconfigured' | 'mock';
  isActive: boolean;
}

export interface AIModel {
  id: string;
  providerId: string;
  modelIdentifier: string;
  displayName: string;
  mediaType: 'video' | 'image' | 'voice' | 'script';
  capabilities: {
    resolutions?: string[];
    aspectRatios?: string[];
    maxDuration?: number;
    languages?: string[];
    emotions?: string[];
    [key: string]: any;
  };
  costConfiguration: {
    unitCostUsd: number;
  };
  creditPricing: {
    costCredits: number;
  };
  isActive: boolean;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  templateData: {
    aspectRatio: '16:9' | '9:16' | '1:1';
    duration: number;
    music?: string;
    scenes: Array<{
      text: string;
      duration: number;
      mediaUrl?: string;
    }>;
  };
  isPublished: boolean;
}

export interface BrandKit {
  id: string;
  workspaceId: string;
  name: string;
  logoAssetId?: string;
  logoUrl?: string;
  colors: string[];
  fonts: string[];
  guidelinesText?: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  userId: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  settings: {
    resolution: '720p' | '1080p' | '4k';
    fps: number;
    format: 'mp4' | 'webm';
  };
  outputAssetId?: string;
  outputUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  payload?: any;
  processingStatus: 'received' | 'processed' | 'ignored' | 'failed';
  receivedAt: string;
  processedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail?: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// PAYU INDIA & BILLING SYSTEM INTERFACES
// ==============================================================================

export interface TaxBreakdown {
  baseAmount: number;
  taxRate: number; // e.g. 18
  taxAmount: number;
  cgstRate: number; // e.g. 9
  cgstAmount: number;
  sgstRate: number; // e.g. 9
  sgstAmount: number;
  igstRate: number; // e.g. 18
  igstAmount: number;
  isInterState: boolean;
  placeOfSupply: string;
}

export interface CustomerBillingDetails {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state: string;
  pincode?: string;
  gstin?: string;
}

export interface SupplierLegalDetails {
  legalName: string;
  tradeName: string;
  registeredAddress: string;
  state: string;
  gstin?: string;
  pan?: string;
  supportEmail: string;
  website: string;
  isGstRegistered: boolean;
}

export interface PayUPaymentOrder {
  id: string;
  txnid: string;
  userId: string;
  workspaceId: string;
  paymentType: 'subscription' | 'credit_pack';
  itemPlanOrPackId: string;
  productInfo: string;
  currency: 'INR';
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaise: number;
  taxBreakdown: TaxBreakdown;
  customerDetails: CustomerBillingDetails;
  status: 'created' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
  payuMihpayid?: string;
  payuBankRefNum?: string;
  payuPaymentMode?: string;
  payuResponseHash?: string;
  payuError?: string;
  idempotencyKey: string;
  invoiceId?: string;
  invoiceNumber?: string;
  receiptId?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unitPrice: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  txnid: string;
  userId: string;
  workspaceId: string;
  supplier: SupplierLegalDetails;
  customer: CustomerBillingDetails;
  items: InvoiceItem[];
  baseAmount: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  currency: 'INR';
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  payuPaymentId?: string;
  terms: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  orderId: string;
  txnid: string;
  invoiceId?: string;
  invoiceNumber?: string;
  userId: string;
  workspaceId: string;
  customerName: string;
  customerEmail: string;
  amountReceived: number;
  currency: 'INR';
  paymentMethod: string;
  payuMihpayid?: string;
  payuBankRefNum?: string;
  productPurchased: string;
  paymentDate: string;
  paymentStatus: 'verified_success';
  verificationReference: string;
  footerNotice: string;
  createdAt: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  userId: string;
  workspaceId: string;
  orderId: string;
  txnid: string;
  reason: string;
  adjustmentAmount: number;
  taxAdjustment: number;
  totalAdjustment: number;
  status: 'issued' | 'applied';
  createdAt: string;
}

export interface BillingOverviewStats {
  subscription?: Subscription;
  plan?: Plan;
  availableCredits: number;
  purchasedCredits: number;
  creditsUsed: number;
  totalSuccessfulPayments: number;
  totalSpentInr: number;
  recentTransactions: PayUPaymentOrder[];
  pendingOrdersCount: number;
  latestInvoices: Invoice[];
  latestReceipts: PaymentReceipt[];
}
