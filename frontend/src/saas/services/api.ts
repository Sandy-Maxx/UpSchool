import axios from 'axios';
import {
  TenantRegistrationData,
  SubdomainCheckResponse,
  ContactFormData,
  PricingPlan,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance for public SaaS API
const saasApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/public`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class SaasApiService {
  // Register new tenant
  static async registerTenant(data: TenantRegistrationData) {
    const response = await saasApi.post('/register/', data);
    return response.data;
  }

  // Check subdomain availability
  static async checkSubdomain(subdomain: string): Promise<SubdomainCheckResponse> {
    const response = await saasApi.post('/check-subdomain/', { subdomain });
    return response.data;
  }

  // Get pricing plans
  static async getPricingPlans(): Promise<{ plans: PricingPlan[] }> {
    const response = await saasApi.get('/pricing/');
    return response.data;
  }

  // Submit contact form
  static async submitContactForm(data: ContactFormData) {
    const response = await saasApi.post('/contact/', data);
    return response.data;
  }

  // Generate subdomain suggestions based on school name
  static generateSubdomainSuggestions(schoolName: string): string[] {
    const cleanName = schoolName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .substring(0, 20);

    const suggestions = [
      cleanName,
      `${cleanName}school`,
      `${cleanName}edu`,
      `${cleanName}academy`,
      `${cleanName}institute`,
    ];

    return suggestions.filter(s => s.length >= 3 && s.length <= 30);
  }

  // Validate subdomain format
  static validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
    if (!subdomain) {
      return { valid: false, error: 'Subdomain is required' };
    }

    if (subdomain.length < 3) {
      return { valid: false, error: 'Subdomain must be at least 3 characters long' };
    }

    if (subdomain.length > 30) {
      return { valid: false, error: 'Subdomain must be less than 30 characters' };
    }

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain)) {
      return {
        valid: false,
        error:
          'Subdomain can only contain lowercase letters, numbers, and hyphens. Must start and end with alphanumeric character.',
      };
    }

    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'test', 'staging', 'demo'];
    if (reserved.includes(subdomain.toLowerCase())) {
      return { valid: false, error: 'This subdomain is reserved' };
    }

    return { valid: true };
  }
}

export default SaasApiService;
