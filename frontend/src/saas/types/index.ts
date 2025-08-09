export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number | string;
  currency: string;
  billing: string;
  student_limit: number | string;
  features: string[];
  popular: boolean;
}

export interface TenantRegistrationData {
  school_name: string;
  subdomain: string;
  school_address: string;
  school_phone: string;
  school_email: string;
  school_website?: string;
  subscription_plan: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_phone: string;
  admin_password: string;
  terms_accepted: boolean;
}

export interface SubdomainCheckResponse {
  subdomain: string;
  available: boolean;
  reserved: boolean;
  url_preview: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
  subject: 'demo' | 'pricing' | 'support' | 'sales' | 'other';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface Stats {
  students: number;
  schools: number;
  teachers: number;
  countries: number;
}
