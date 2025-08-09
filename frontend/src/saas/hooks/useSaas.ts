import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SaasApiService } from '../services/api';
import { TenantRegistrationData, ContactFormData } from '../types';

// Hook for tenant registration
export const useRegisterTenant = () => {
  return useMutation({
    mutationFn: (data: TenantRegistrationData) => SaasApiService.registerTenant(data),
    onSuccess: data => {
      // Handle successful registration
      console.log('Tenant registered successfully:', data);
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });
};

// Hook for subdomain checking
export const useSubdomainCheck = () => {
  const [debouncedCheck, setDebouncedCheck] = useState<NodeJS.Timeout | null>(null);

  const checkSubdomain = useCallback(
    (subdomain: string, callback: (result: any) => void) => {
      if (debouncedCheck) {
        clearTimeout(debouncedCheck);
      }

      const timeout = setTimeout(async () => {
        if (subdomain.length >= 3) {
          try {
            const result = await SaasApiService.checkSubdomain(subdomain);
            callback(result);
          } catch (error) {
            callback({ available: false, error: 'Check failed' });
          }
        }
      }, 500);

      setDebouncedCheck(timeout);
    },
    [debouncedCheck]
  );

  return { checkSubdomain };
};

// Hook for pricing plans
export const usePricingPlans = () => {
  return useQuery({
    queryKey: ['pricing-plans'],
    queryFn: () => SaasApiService.getPricingPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for contact form
export const useContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => SaasApiService.submitContactForm(data),
  });
};

// Hook for managing form state
export const useFormState = <T>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched: setFieldTouched,
    reset,
  };
};
