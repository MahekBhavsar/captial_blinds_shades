import { z } from "zod";

// ==========================================
// 1. User & Admin Schema
// ==========================================
export const UserSchema = z.object({
  id: z.string().optional(),
  uid: z.string().optional(),
  email: z.string().email(),
  displayName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "user", "lead"]),
  processStatus: z.enum(["Pending", "Completed", "Rejected"]).default("Pending"),
  companyName: z.string().optional(),
  serviceRequested: z.array(z.string()).optional(),
  createdAt: z.date(),
  lastLoginAt: z.date().optional(),
});
export type UserDocument = z.infer<typeof UserSchema>;

// ==========================================
// 2. Quote Request Schema
// ==========================================
export const QuoteSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  companyName: z.string().optional(),
  serviceRequested: z.array(z.string()).min(1, "Select at least one service"),
  description: z.string().optional(),
  artworkUrls: z.array(z.string()).optional(), // URLs from Firebase Storage
  quoteData: z.any().optional(), // Stores the generated Quote details (prices, items)
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"]).default("Pending"),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type QuoteDocument = z.infer<typeof QuoteSchema>;

// ==========================================
// 3. Portfolio Schema
// ==========================================
export const PortfolioItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string(),
  clientName: z.string().optional(),
  category: z.enum([
    "Vehicle Wraps", 
    "Shopfront Signs", 
    "Business Printing", 
    "Corporate Branding", 
    "Construction", 
    "Events"
  ]),
  imageUrl: z.string().url(),
  beforeImageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
});
export type PortfolioDocument = z.infer<typeof PortfolioItemSchema>;

// ==========================================
// 4. Testimonial Schema
// ==========================================
export const TestimonialSchema = z.object({
  id: z.string().optional(),
  clientName: z.string(),
  companyName: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  createdAt: z.date(),
});
export type TestimonialDocument = z.infer<typeof TestimonialSchema>;

// ==========================================
// 5. Blog Post Schema
// ==========================================
export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string(), // For SEO friendly URLs
  content: z.string(), // HTML or Markdown
  excerpt: z.string(),
  coverImageUrl: z.string().url().optional(),
  authorId: z.string(),
  tags: z.array(z.string()),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type BlogPostDocument = z.infer<typeof BlogPostSchema>;

// ==========================================
// 6. Settings Schema
// ==========================================
export const SettingsSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().default("Capital Print & Sign"),
  phone: z.string().default("0430 123 456"),
  email: z.string().default("sales@capitalprintandsign.com.au"),
  address: z.string().default("21 Huddart Court, Mitchell ACT 2911"),
  whatsapp: z.string().default("61430123456"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  notificationEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().default(false),
  updatedAt: z.date().optional(),
});
export type SettingsDocument = z.infer<typeof SettingsSchema>;

// ==========================================
// 7. Service Schema
// ==========================================
export const ServiceFeatureSchema = z.object({
  iconName: z.string(), // e.g. "Sun", "Shield", "Leaf"
  label: z.string(),    // e.g. "Light Control"
  value: z.string(),    // e.g. "Full to Filtered"
});

export const ServiceSpecSchema = z.object({
  label: z.string(),   // e.g. "Max Width"
  value: z.string(),   // e.g. "Up to 3.5m"
});

export const ServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  desc: z.string(),               // Short description on the card
  tagline: z.string().optional(), // Italic subtitle shown in popup header
  longContent: z.string().optional(), // Extended description in popup
  imageUrl: z.string().optional(), // Custom image URL for this service
  iconName: z.string(),            // Lucide icon name for the card
  color: z.string(),
  importantWords: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),          // "Why Choose" bullets
  features: z.array(ServiceFeatureSchema).optional(), // 4 quick-feature tiles
  specs: z.array(ServiceSpecSchema).optional(),       // Spec table rows
  fabrics: z.array(z.string()).optional(),            // Fabric/finish chips
  order: z.number().default(0),
  createdAt: z.date().optional(),
});
export type ServiceDocument = z.infer<typeof ServiceSchema>;
export type ServiceFeature = z.infer<typeof ServiceFeatureSchema>;
export type ServiceSpec = z.infer<typeof ServiceSpecSchema>;

