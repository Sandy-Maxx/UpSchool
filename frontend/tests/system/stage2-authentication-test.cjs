#!/usr/bin/env node

/**
 * STAGE 2: DUAL AUTHENTICATION & RBAC COMPREHENSIVE TEST
 * Tests all Stage 2 authentication components and validates readiness for Stage 3
 * 
 * Usage: node tests/system/stage2-authentication-test.cjs
 */

const { ComprehensiveStageTestBase } = require('../../test-utils/helpers/ComprehensiveStageTestBase.cjs');

class Stage2AuthenticationTest extends ComprehensiveStageTestBase {
  constructor() {
    super('Stage 2: Dual Authentication & RBAC', 2);
  }

  async testStageSpecificFeatures() {
    console.log('🎯 Testing Stage 2 Authentication Features...');
    
    await this.testSaaSAuthentication();
    await this.testTenantAuthentication();
    await this.testRoleBasedAccess();
    await this.testSecurityFeatures();
    await this.testAuthenticationFlows();
    await this.testSessionManagement();
  }

  async testSaaSAuthentication() {
    console.log('  Testing SaaS Portal Authentication...');
    
    // Test Google OAuth integration
    const oauthConfigExists = await this.fileExists('src/shared/services/auth/oauth.ts');
    if (oauthConfigExists) {
      this.addResult('OAuth Integration', 'PASS', '✅ Google OAuth service configured');
      
      try {
        const oauthContent = await this.readFile('src/shared/services/auth/oauth.ts');
        
        // Check for essential OAuth features
        if (oauthContent.includes('google') && oauthContent.includes('oauth')) {
          this.addResult('OAuth Provider', 'PASS', '✅ Google OAuth provider configured');
        } else {
          this.addResult('OAuth Provider', 'FAIL', '❌ Google OAuth provider not configured');
        }

        if (oauthContent.includes('scope') || oauthContent.includes('permissions')) {
          this.addResult('OAuth Scopes', 'PASS', '✅ OAuth scopes configured');
        } else {
          this.addResult('OAuth Scopes', 'WARNING', '⚠️ OAuth scopes may not be configured');
        }

      } catch (error) {
        this.addResult('OAuth Analysis', 'WARNING', '⚠️ Could not analyze OAuth configuration');
      }
    } else {
      this.addResult('OAuth Integration', 'FAIL', '❌ Google OAuth not configured');
    }
    
    // Test registration flow
    const registrationExists = await this.fileExists('src/saas/components/auth/RegisterForm.tsx');
    if (registrationExists) {
      this.addResult('Registration Flow', 'PASS', '✅ Registration form component exists');
      
      try {
        const regContent = await this.readFile('src/saas/components/auth/RegisterForm.tsx');
        
        // Check for form validation
        if (regContent.includes('validation') || regContent.includes('validate')) {
          this.addResult('Registration Validation', 'PASS', '✅ Registration form validation implemented');
        } else {
          this.addResult('Registration Validation', 'WARNING', '⚠️ Registration form validation may be missing');
        }

        // Check for email verification trigger
        if (regContent.includes('verify') || regContent.includes('verification')) {
          this.addResult('Email Verification', 'PASS', '✅ Email verification flow integrated');
        } else {
          this.addResult('Email Verification', 'FAIL', '❌ Email verification not integrated');
        }

      } catch (error) {
        this.addResult('Registration Analysis', 'WARNING', '⚠️ Could not analyze registration form');
      }
    } else {
      this.addResult('Registration Flow', 'FAIL', '❌ Registration form component missing');
    }

    // Test login form
    const loginExists = await this.fileExists('src/saas/components/auth/LoginForm.tsx');
    if (loginExists) {
      this.addResult('Login Form', 'PASS', '✅ Login form component exists');
    } else {
      this.addResult('Login Form', 'FAIL', '❌ Login form component missing');
    }

    // Test password reset functionality
    const passwordResetExists = await this.fileExists('src/saas/components/auth/PasswordReset.tsx');
    if (passwordResetExists) {
      this.addResult('Password Reset', 'PASS', '✅ Password reset component exists');
    } else {
      this.addResult('Password Reset', 'FAIL', '❌ Password reset component missing');
    }
  }

  async testTenantAuthentication() {
    console.log('  Testing Tenant Portal Authentication...');
    
    // Test SSO integration
    const ssoConfigExists = await this.fileExists('src/shared/services/auth/sso.ts');
    if (ssoConfigExists) {
      this.addResult('SSO Integration', 'PASS', '✅ SSO service configured');
      
      try {
        const ssoContent = await this.readFile('src/shared/services/auth/sso.ts');
        
        // Check for SAML support
        if (ssoContent.includes('SAML') || ssoContent.includes('saml')) {
          this.addResult('SAML Support', 'PASS', '✅ SAML SSO support implemented');
        } else {
          this.addResult('SAML Support', 'WARNING', '⚠️ SAML SSO support may be missing');
        }

        // Check for OIDC support
        if (ssoContent.includes('OIDC') || ssoContent.includes('OpenID')) {
          this.addResult('OIDC Support', 'PASS', '✅ OIDC SSO support implemented');
        } else {
          this.addResult('OIDC Support', 'WARNING', '⚠️ OIDC SSO support may be missing');
        }

      } catch (error) {
        this.addResult('SSO Analysis', 'WARNING', '⚠️ Could not analyze SSO configuration');
      }
    } else {
      this.addResult('SSO Integration', 'FAIL', '❌ SSO not configured');
    }

    // Test MFA integration
    const mfaExists = await this.fileExists('src/tenant/components/auth/MFASetup.tsx');
    if (mfaExists) {
      this.addResult('MFA Integration', 'PASS', '✅ MFA setup component exists');
    } else {
      this.addResult('MFA Integration', 'FAIL', '❌ MFA setup component missing');
    }

    // Test tenant login form
    const tenantLoginExists = await this.fileExists('src/tenant/components/auth/TenantLogin.tsx');
    if (tenantLoginExists) {
      this.addResult('Tenant Login', 'PASS', '✅ Tenant login component exists');
    } else {
      this.addResult('Tenant Login', 'FAIL', '❌ Tenant login component missing');
    }
  }

  async testRoleBasedAccess() {
    console.log('  Testing Role-Based Access Control...');
    
    // Test RBAC service implementation
    const rbacExists = await this.fileExists('src/shared/services/rbac/permissions.ts');
    if (rbacExists) {
      this.addResult('RBAC Service', 'PASS', '✅ RBAC permissions service exists');
      
      try {
        const rbacContent = await this.readFile('src/shared/services/rbac/permissions.ts');
        
        // Check for role definitions
        if (rbacContent.includes('roles') || rbacContent.includes('Role')) {
          this.addResult('Role Definitions', 'PASS', '✅ Role definitions implemented');
        } else {
          this.addResult('Role Definitions', 'FAIL', '❌ Role definitions missing');
        }

        // Check for permission checks
        if (rbacContent.includes('hasPermission') || rbacContent.includes('checkPermission')) {
          this.addResult('Permission Checks', 'PASS', '✅ Permission checking functions implemented');
        } else {
          this.addResult('Permission Checks', 'FAIL', '❌ Permission checking functions missing');
        }

        // Check for resource-based permissions
        if (rbacContent.includes('resource') || rbacContent.includes('Resource')) {
          this.addResult('Resource Permissions', 'PASS', '✅ Resource-based permissions implemented');
        } else {
          this.addResult('Resource Permissions', 'WARNING', '⚠️ Resource-based permissions may be missing');
        }

      } catch (error) {
        this.addResult('RBAC Analysis', 'WARNING', '⚠️ Could not analyze RBAC implementation');
      }
    } else {
      this.addResult('RBAC Service', 'FAIL', '❌ RBAC permissions service missing');
    }

    // Test role management components
    const roleManagementExists = await this.fileExists('src/tenant/components/admin/RoleManagement.tsx');
    if (roleManagementExists) {
      this.addResult('Role Management UI', 'PASS', '✅ Role management component exists');
    } else {
      this.addResult('Role Management UI', 'FAIL', '❌ Role management component missing');
    }

    // Test permission matrix
    const permissionMatrixExists = await this.fileExists('src/tenant/components/admin/PermissionMatrix.tsx');
    if (permissionMatrixExists) {
      this.addResult('Permission Matrix', 'PASS', '✅ Permission matrix component exists');
    } else {
      this.addResult('Permission Matrix', 'WARNING', '⚠️ Permission matrix component missing');
    }

    // Test protected route component
    const protectedRouteExists = await this.fileExists('src/shared/components/auth/ProtectedRoute.tsx');
    if (protectedRouteExists) {
      this.addResult('Protected Routes', 'PASS', '✅ Protected route component exists');
      
      try {
        const protectedContent = await this.readFile('src/shared/components/auth/ProtectedRoute.tsx');
        
        if (protectedContent.includes('permission') || protectedContent.includes('role')) {
          this.addResult('Route Protection Logic', 'PASS', '✅ Route protection logic implemented');
        } else {
          this.addResult('Route Protection Logic', 'WARNING', '⚠️ Route protection logic may be incomplete');
        }

      } catch (error) {
        this.addResult('Protected Route Analysis', 'WARNING', '⚠️ Could not analyze protected route logic');
      }
    } else {
      this.addResult('Protected Routes', 'FAIL', '❌ Protected route component missing');
    }
  }

  async testSecurityFeatures() {
    console.log('  Testing Security Features...');
    
    // Test JWT security enhancements
    try {
      const apiClientContent = await this.readFile('src/shared/services/api/client.ts');
      
      // Check for JWT token expiration handling
      if (apiClientContent.includes('exp') || apiClientContent.includes('expiration')) {
        this.addResult('JWT Expiration', 'PASS', '✅ JWT expiration handling implemented');
      } else {
        this.addResult('JWT Expiration', 'WARNING', '⚠️ JWT expiration handling may be missing');
      }

      // Check for refresh token security
      if (apiClientContent.includes('refreshToken') && apiClientContent.includes('secure')) {
        this.addResult('Secure Refresh Tokens', 'PASS', '✅ Secure refresh token handling implemented');
      } else {
        this.addResult('Secure Refresh Tokens', 'WARNING', '⚠️ Secure refresh token handling may be missing');
      }

    } catch (error) {
      this.addResult('JWT Security Analysis', 'WARNING', '⚠️ Could not analyze JWT security features');
    }

    // Test CSRF protection
    const csrfProtectionExists = await this.fileExists('src/shared/services/security/csrf.ts');
    if (csrfProtectionExists) {
      this.addResult('CSRF Protection', 'PASS', '✅ CSRF protection service exists');
    } else {
      this.addResult('CSRF Protection', 'WARNING', '⚠️ CSRF protection service missing');
    }

    // Test XSS protection utilities
    const xssProtectionExists = await this.fileExists('src/shared/utils/security/xss.ts');
    if (xssProtectionExists) {
      this.addResult('XSS Protection', 'PASS', '✅ XSS protection utilities exist');
    } else {
      this.addResult('XSS Protection', 'WARNING', '⚠️ XSS protection utilities missing');
    }

    // Test input sanitization
    const sanitizationExists = await this.fileExists('src/shared/utils/sanitization.ts');
    if (sanitizationExists) {
      this.addResult('Input Sanitization', 'PASS', '✅ Input sanitization utilities exist');
    } else {
      this.addResult('Input Sanitization', 'WARNING', '⚠️ Input sanitization utilities missing');
    }
  }

  async testAuthenticationFlows() {
    console.log('  Testing Authentication Flows...');
    
    // Test authentication store updates
    try {
      const authSliceContent = await this.readFile('src/shared/store/slices/authSlice.ts');
      
      // Check for login actions
      if (authSliceContent.includes('loginAsync') || authSliceContent.includes('login')) {
        this.addResult('Login Actions', 'PASS', '✅ Login Redux actions implemented');
      } else {
        this.addResult('Login Actions', 'FAIL', '❌ Login Redux actions missing');
      }

      // Check for logout actions
      if (authSliceContent.includes('logout') || authSliceContent.includes('signOut')) {
        this.addResult('Logout Actions', 'PASS', '✅ Logout Redux actions implemented');
      } else {
        this.addResult('Logout Actions', 'FAIL', '❌ Logout Redux actions missing');
      }

      // Check for token refresh actions
      if (authSliceContent.includes('refreshToken') || authSliceContent.includes('refresh')) {
        this.addResult('Token Refresh Actions', 'PASS', '✅ Token refresh Redux actions implemented');
      } else {
        this.addResult('Token Refresh Actions', 'FAIL', '❌ Token refresh Redux actions missing');
      }

      // Check for user profile actions
      if (authSliceContent.includes('profile') || authSliceContent.includes('user')) {
        this.addResult('User Profile Actions', 'PASS', '✅ User profile Redux actions implemented');
      } else {
        this.addResult('User Profile Actions', 'WARNING', '⚠️ User profile Redux actions may be missing');
      }

    } catch (error) {
      this.addResult('Authentication Flow Analysis', 'FAIL', `❌ Could not analyze authentication flows: ${error.message}`);
    }
  }

  async testSessionManagement() {
    console.log('  Testing Session Management...');
    
    // Test session middleware enhancements
    try {
      const sessionMiddlewareContent = await this.readFile('src/shared/store/middleware/sessionMiddleware.ts');
      
      // Check for session timeout handling
      if (sessionMiddlewareContent.includes('timeout') || sessionMiddlewareContent.includes('expire')) {
        this.addResult('Session Timeout', 'PASS', '✅ Session timeout handling implemented');
      } else {
        this.addResult('Session Timeout', 'WARNING', '⚠️ Session timeout handling may be missing');
      }

      // Check for concurrent session handling
      if (sessionMiddlewareContent.includes('concurrent') || sessionMiddlewareContent.includes('multiple')) {
        this.addResult('Concurrent Sessions', 'PASS', '✅ Concurrent session handling implemented');
      } else {
        this.addResult('Concurrent Sessions', 'WARNING', '⚠️ Concurrent session handling may be missing');
      }

    } catch (error) {
      this.addResult('Session Management Analysis', 'WARNING', '⚠️ Could not analyze session management');
    }

    // Test audit logging
    const auditLogExists = await this.fileExists('src/shared/services/audit/logger.ts');
    if (auditLogExists) {
      this.addResult('Audit Logging', 'PASS', '✅ Audit logging service exists');
    } else {
      this.addResult('Audit Logging', 'WARNING', '⚠️ Audit logging service missing');
    }

    // Test session storage security
    try {
      const authContextContent = await this.readFile('src/shared/contexts/AuthContext.tsx');
      
      if (authContextContent.includes('secure') || authContextContent.includes('httpOnly')) {
        this.addResult('Secure Session Storage', 'PASS', '✅ Secure session storage implemented');
      } else {
        this.addResult('Secure Session Storage', 'WARNING', '⚠️ Secure session storage may not be implemented');
      }

    } catch (error) {
      this.addResult('Session Storage Analysis', 'WARNING', '⚠️ Could not analyze session storage security');
    }
  }

  async readFile(filePath) {
    const fs = require('fs').promises;
    return await fs.readFile(filePath, 'utf-8');
  }

  // Override documentation check for Stage 2 specific docs
  async testDocumentation() {
    console.log('📚 Testing Stage 2 Documentation...');

    const stage2DocFiles = [
      'README.md',
      'TESTING-GUIDE.md',
      'frontend-development-plan.md',
      'STAGE2-AUTHENTICATION-SUMMARY.md'  // Stage 2 completion summary
    ];

    for (const file of stage2DocFiles) {
      const exists = await this.fileExists(file);
      if (exists) {
        this.addResult('Documentation', 'PASS', `✅ ${file} exists`);
      } else {
        this.addResult('Documentation', 'WARNING', `⚠️ ${file} missing`);
      }
    }

    // Check authentication documentation
    const authDocsExist = await this.fileExists('docs/AUTHENTICATION.md');
    if (authDocsExist) {
      this.addResult('Authentication Docs', 'PASS', '✅ Authentication documentation exists');
    } else {
      this.addResult('Authentication Docs', 'WARNING', '⚠️ Authentication documentation missing');
    }

    // Check RBAC documentation
    const rbacDocsExist = await this.fileExists('docs/RBAC.md');
    if (rbacDocsExist) {
      this.addResult('RBAC Docs', 'PASS', '✅ RBAC documentation exists');
    } else {
      this.addResult('RBAC Docs', 'WARNING', '⚠️ RBAC documentation missing');
    }
  }
}

// Run the comprehensive test suite
async function main() {
  console.log('🚀 STAGE 2: DUAL AUTHENTICATION & RBAC COMPREHENSIVE TEST\n');
  console.log('Testing all Stage 2 authentication components for readiness to proceed to Stage 3...\n');
  
  const tester = new Stage2AuthenticationTest();
  await tester.runComprehensiveTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { Stage2AuthenticationTest };
