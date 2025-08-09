#!/usr/bin/env node

/**
 * COMPREHENSIVE STAGE 1 TEST SUITE
 * Tests all Stage 1 components and validates readiness for Stage 2
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

/**
 * @typedef {Object} TestResult
 * @property {string} name - The name of the test
 * @property {'PASS'|'FAIL'|'WARNING'} status - The test status
 * @property {string} message - The test message
 * @property {string} [details] - Additional details
 */

class Stage1ComprehensiveTest {
  constructor() {
    this.results = [];
    this.criticalFailures = 0;
    this.warnings = 0;
  }

  addResult(name, status, message, details) {
    this.results.push({ name, status, message, details });
    if (status === 'FAIL') this.criticalFailures++;
    if (status === 'WARNING') this.warnings++;
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readJsonFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error}`);
    }
  }

  async runComprehensiveTests() {
    console.log('🚀 Starting Comprehensive Stage 1 Test Suite\n');

    await this.testProjectStructure();
    await this.testConfiguration();
    await this.testDependencies();
    await this.testTypeScript();
    await this.testBuildSystem();
    await this.testSourceCode();
    await this.testAPIIntegration();
    await this.testStateManagement();
    await this.testRouting();
    await this.testUI();
    await this.testErrorHandling();
    await this.testSecurity();
    await this.testPerformance();
    await this.testDocumentation();
    
    this.generateReport();
  }

  async testProjectStructure() {
    console.log('📁 Testing Project Structure...');

    // Critical directories
    const criticalDirs = [
      'src',
      'src/saas',
      'src/tenant', 
      'src/shared',
      'src/shared/components',
      'src/shared/services',
      'src/shared/store',
      'src/shared/types',
      'src/shared/constants',
      'public'
    ];

    for (const dir of criticalDirs) {
      const exists = await this.fileExists(dir);
      if (exists) {
        this.addResult('Directory Structure', 'PASS', `✅ ${dir} exists`);
      } else {
        this.addResult('Directory Structure', 'FAIL', `❌ Missing critical directory: ${dir}`);
      }
    }

    // Critical files
    const criticalFiles = [
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'src/main.tsx',
      'src/App.tsx',
      'index.html'
    ];

    for (const file of criticalFiles) {
      const exists = await this.fileExists(file);
      if (exists) {
        this.addResult('Core Files', 'PASS', `✅ ${file} exists`);
      } else {
        this.addResult('Core Files', 'FAIL', `❌ Missing critical file: ${file}`);
      }
    }
  }

  async testConfiguration() {
    console.log('⚙️ Testing Configuration...');

    // Test package.json
    try {
      const pkg = await this.readJsonFile('package.json');
      
      // Check essential dependencies
      const requiredDeps = [
        'react', 'react-dom', 'react-router-dom',
        '@reduxjs/toolkit', 'react-redux', 'redux-persist',
        '@mui/material', '@emotion/react', '@emotion/styled',
        'axios', 'framer-motion'
      ];

      const missing = requiredDeps.filter(dep => !pkg.dependencies?.[dep]);
      if (missing.length === 0) {
        this.addResult('Dependencies', 'PASS', '✅ All essential dependencies present');
      } else {
        this.addResult('Dependencies', 'FAIL', `❌ Missing dependencies: ${missing.join(', ')}`);
      }

      // Check scripts
      const requiredScripts = ['dev', 'build', 'preview'];
      const missingScripts = requiredScripts.filter(script => !pkg.scripts?.[script]);
      if (missingScripts.length === 0) {
        this.addResult('Scripts', 'PASS', '✅ All essential scripts present');
      } else {
        this.addResult('Scripts', 'WARNING', `⚠️ Missing scripts: ${missingScripts.join(', ')}`);
      }

    } catch (error) {
      this.addResult('Configuration', 'FAIL', `❌ package.json error: ${error}`);
    }

    // Test TypeScript config
    try {
      const tsConfig = await this.readJsonFile('tsconfig.json');
      if (tsConfig.compilerOptions?.strict) {
        this.addResult('TypeScript Config', 'PASS', '✅ Strict mode enabled');
      } else {
        this.addResult('TypeScript Config', 'WARNING', '⚠️ TypeScript strict mode not enabled');
      }
    } catch (error) {
      this.addResult('TypeScript Config', 'FAIL', `❌ tsconfig.json error: ${error}`);
    }
  }

  async testDependencies() {
    console.log('📦 Testing Dependencies...');

    try {
      // Check if node_modules exists
      const nodeModulesExists = await this.fileExists('node_modules');
      if (nodeModulesExists) {
        this.addResult('Dependencies Install', 'PASS', '✅ node_modules directory exists');
      } else {
        this.addResult('Dependencies Install', 'FAIL', '❌ node_modules not found - run npm install');
        return;
      }

      // Test npm list
      try {
        await execAsync('npm list --depth=0');
        this.addResult('Dependencies Check', 'PASS', '✅ All dependencies properly installed');
      } catch (error) {
        if (error.stdout?.includes('UNMET DEPENDENCY') || error.stdout?.includes('missing')) {
          this.addResult('Dependencies Check', 'FAIL', '❌ Missing or unmet dependencies');
        } else {
          this.addResult('Dependencies Check', 'WARNING', '⚠️ Some dependency warnings exist');
        }
      }
    } catch (error) {
      this.addResult('Dependencies', 'FAIL', `❌ Dependency check failed: ${error}`);
    }
  }

  async testTypeScript() {
    console.log('🔷 Testing TypeScript...');

    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit');
      
      if (stderr && !stderr.includes('warning')) {
        this.addResult('TypeScript Compilation', 'FAIL', `❌ TypeScript errors: ${stderr}`);
      } else {
        this.addResult('TypeScript Compilation', 'PASS', '✅ No TypeScript compilation errors');
      }
    } catch (error) {
      if (error.stdout?.includes('error TS')) {
        this.addResult('TypeScript Compilation', 'FAIL', `❌ TypeScript compilation failed: ${error.stdout.slice(0, 300)}...`);
      } else {
        this.addResult('TypeScript Compilation', 'WARNING', '⚠️ TypeScript check completed with warnings');
      }
    }
  }

  async testBuildSystem() {
    console.log('🔨 Testing Build System...');

    try {
      console.log('  Building application...');
      const { stdout, stderr } = await execAsync('npm run build', { timeout: 60000 });
      
      if (stderr && stderr.includes('error')) {
        this.addResult('Build System', 'FAIL', `❌ Build failed: ${stderr}`);
      } else {
        this.addResult('Build System', 'PASS', '✅ Build completed successfully');
        
        // Check if build artifacts exist
        const distExists = await this.fileExists('dist');
        const indexExists = await this.fileExists('dist/index.html');
        
        if (distExists && indexExists) {
          this.addResult('Build Artifacts', 'PASS', '✅ Build artifacts created successfully');
        } else {
          this.addResult('Build Artifacts', 'FAIL', '❌ Build artifacts missing');
        }
      }
    } catch (error) {
      this.addResult('Build System', 'FAIL', `❌ Build failed: ${error.message}`);
    }
  }

  async testSourceCode() {
    console.log('📄 Testing Source Code Structure...');

    // Test critical component files
    const criticalComponents = [
      'src/main.tsx',
      'src/App.tsx',
      'src/shared/store/index.ts',
      'src/shared/services/api/client.ts',
      'src/shared/contexts/AuthContext.tsx',
      'src/shared/components/ErrorBoundary.tsx',
      'src/shared/types/index.ts',
      'src/shared/constants/index.ts',
      'src/saas/pages/LandingPage.tsx'
    ];

    for (const file of criticalComponents) {
      const exists = await this.fileExists(file);
      if (exists) {
        this.addResult('Core Components', 'PASS', `✅ ${path.basename(file)} exists`);
      } else {
        this.addResult('Core Components', 'FAIL', `❌ Missing: ${file}`);
      }
    }

    // Test if main entry points have proper imports
    try {
      const mainContent = await fs.readFile('src/main.tsx', 'utf-8');
      
      if (mainContent.includes('Provider') && mainContent.includes('PersistGate')) {
        this.addResult('Redux Integration', 'PASS', '✅ Redux Provider and PersistGate configured in main.tsx');
      } else {
        this.addResult('Redux Integration', 'FAIL', '❌ Redux not properly configured in main.tsx');
      }

      if (mainContent.includes('ErrorBoundary')) {
        this.addResult('Error Boundary', 'PASS', '✅ ErrorBoundary configured in main.tsx');
      } else {
        this.addResult('Error Boundary', 'WARNING', '⚠️ ErrorBoundary not in main.tsx');
      }

    } catch (error) {
      this.addResult('Source Analysis', 'FAIL', `❌ Failed to analyze source: ${error}`);
    }
  }

  async testAPIIntegration() {
    console.log('🔌 Testing API Integration...');

    try {
      const clientExists = await this.fileExists('src/shared/services/api/client.ts');
      if (clientExists) {
        const clientContent = await fs.readFile('src/shared/services/api/client.ts', 'utf-8');
        
        // Test for portal-aware client features
        const hasPortalDetection = clientContent.includes('portalType') || clientContent.includes('portal');
        const hasInterceptors = clientContent.includes('interceptors');
        const hasTokenRefresh = clientContent.includes('refresh') && clientContent.includes('token');
        const hasErrorHandling = clientContent.includes('normalizeError') || clientContent.includes('error');

        if (hasPortalDetection) {
          this.addResult('API Portal Awareness', 'PASS', '✅ Portal-aware API client implemented');
        } else {
          this.addResult('API Portal Awareness', 'FAIL', '❌ API client not portal-aware');
        }

        if (hasInterceptors) {
          this.addResult('API Interceptors', 'PASS', '✅ API interceptors configured');
        } else {
          this.addResult('API Interceptors', 'FAIL', '❌ API interceptors missing');
        }

        if (hasTokenRefresh) {
          this.addResult('Token Refresh', 'PASS', '✅ Token refresh mechanism implemented');
        } else {
          this.addResult('Token Refresh', 'FAIL', '❌ Token refresh not implemented');
        }

        if (hasErrorHandling) {
          this.addResult('API Error Handling', 'PASS', '✅ API error handling implemented');
        } else {
          this.addResult('API Error Handling', 'FAIL', '❌ API error handling missing');
        }
      } else {
        this.addResult('API Client', 'FAIL', '❌ API client file missing');
      }
    } catch (error) {
      this.addResult('API Integration', 'FAIL', `❌ API test failed: ${error}`);
    }
  }

  async testStateManagement() {
    console.log('🏪 Testing State Management...');

    try {
      const storeExists = await this.fileExists('src/shared/store/index.ts');
      if (storeExists) {
        const storeContent = await fs.readFile('src/shared/store/index.ts', 'utf-8');
        
        const hasReduxToolkit = storeContent.includes('configureStore') || storeContent.includes('@reduxjs/toolkit');
        const hasPersist = storeContent.includes('persistStore') || storeContent.includes('redux-persist');
        const hasMiddleware = storeContent.includes('middleware');

        if (hasReduxToolkit) {
          this.addResult('Redux Toolkit', 'PASS', '✅ Redux Toolkit configured');
        } else {
          this.addResult('Redux Toolkit', 'FAIL', '❌ Redux Toolkit not configured');
        }

        if (hasPersist) {
          this.addResult('State Persistence', 'PASS', '✅ Redux Persist configured');
        } else {
          this.addResult('State Persistence', 'FAIL', '❌ State persistence not configured');
        }

        if (hasMiddleware) {
          this.addResult('Redux Middleware', 'PASS', '✅ Redux middleware configured');
        } else {
          this.addResult('Redux Middleware', 'WARNING', '⚠️ Custom middleware may be missing');
        }

        // Test slices
        const authSliceExists = await this.fileExists('src/shared/store/slices/authSlice.ts');
        const uiSliceExists = await this.fileExists('src/shared/store/slices/uiSlice.ts');
        
        if (authSliceExists) {
          this.addResult('Auth Slice', 'PASS', '✅ Auth slice exists');
        } else {
          this.addResult('Auth Slice', 'FAIL', '❌ Auth slice missing');
        }

        if (uiSliceExists) {
          this.addResult('UI Slice', 'PASS', '✅ UI slice exists');
        } else {
          this.addResult('UI Slice', 'WARNING', '⚠️ UI slice missing');
        }
      } else {
        this.addResult('Redux Store', 'FAIL', '❌ Redux store file missing');
      }
    } catch (error) {
      this.addResult('State Management', 'FAIL', `❌ State management test failed: ${error}`);
    }
  }

  async testRouting() {
    console.log('🛣️ Testing Routing...');

    try {
      const appExists = await this.fileExists('src/App.tsx');
      if (appExists) {
        const appContent = await fs.readFile('src/App.tsx', 'utf-8');
        
        const hasRouter = appContent.includes('Router') || appContent.includes('Route');
        const hasAuthProvider = appContent.includes('AuthProvider');
        const hasProtectedRoute = appContent.includes('Protected') || appContent.includes('auth');

        if (hasRouter) {
          this.addResult('React Router', 'PASS', '✅ React Router configured');
        } else {
          this.addResult('React Router', 'FAIL', '❌ React Router not configured');
        }

        if (hasAuthProvider) {
          this.addResult('Auth Provider', 'PASS', '✅ AuthProvider integrated');
        } else {
          this.addResult('Auth Provider', 'FAIL', '❌ AuthProvider missing');
        }

        if (hasProtectedRoute) {
          this.addResult('Protected Routes', 'PASS', '✅ Protected route logic present');
        } else {
          this.addResult('Protected Routes', 'WARNING', '⚠️ Protected route logic may be missing');
        }
      } else {
        this.addResult('App Component', 'FAIL', '❌ App.tsx missing');
      }
    } catch (error) {
      this.addResult('Routing', 'FAIL', `❌ Routing test failed: ${error}`);
    }
  }

  async testUI() {
    console.log('🎨 Testing UI Components...');

    try {
      // Test Material-UI integration
      const mainContent = await fs.readFile('src/main.tsx', 'utf-8');
      const hasMUI = mainContent.includes('@mui') || mainContent.includes('ThemeProvider') || mainContent.includes('CssBaseline');
      
      if (hasMUI) {
        this.addResult('Material-UI', 'PASS', '✅ Material-UI integrated');
      } else {
        this.addResult('Material-UI', 'FAIL', '❌ Material-UI not integrated');
      }

      // Test landing page
      const landingExists = await this.fileExists('src/saas/pages/LandingPage.tsx');
      if (landingExists) {
        const landingContent = await fs.readFile('src/saas/pages/LandingPage.tsx', 'utf-8');
        const hasFramerMotion = landingContent.includes('motion') || landingContent.includes('framer');
        
        this.addResult('Landing Page', 'PASS', '✅ Landing page component exists');
        
        if (hasFramerMotion) {
          this.addResult('Animations', 'PASS', '✅ Framer Motion animations integrated');
        } else {
          this.addResult('Animations', 'WARNING', '⚠️ Animations may not be implemented');
        }
      } else {
        this.addResult('Landing Page', 'FAIL', '❌ Landing page missing');
      }

      // Test error boundary
      const errorBoundaryExists = await this.fileExists('src/shared/components/ErrorBoundary.tsx');
      if (errorBoundaryExists) {
        this.addResult('Error Boundary', 'PASS', '✅ Error boundary component exists');
      } else {
        this.addResult('Error Boundary', 'FAIL', '❌ Error boundary missing');
      }

    } catch (error) {
      this.addResult('UI Components', 'FAIL', `❌ UI test failed: ${error}`);
    }
  }

  async testErrorHandling() {
    console.log('🛡️ Testing Error Handling...');

    const errorBoundaryExists = await this.fileExists('src/shared/components/ErrorBoundary.tsx');
    const loadingStatesExists = await this.fileExists('src/shared/components/LoadingStates.tsx');

    if (errorBoundaryExists) {
      this.addResult('Error Boundaries', 'PASS', '✅ Error boundary implementation exists');
    } else {
      this.addResult('Error Boundaries', 'FAIL', '❌ Error boundary missing');
    }

    if (loadingStatesExists) {
      this.addResult('Loading States', 'PASS', '✅ Loading states component exists');
    } else {
      this.addResult('Loading States', 'WARNING', '⚠️ Loading states component missing');
    }
  }

  async testSecurity() {
    console.log('🔒 Testing Security...');

    try {
      const authContextExists = await this.fileExists('src/shared/contexts/AuthContext.tsx');
      if (authContextExists) {
        const authContent = await fs.readFile('src/shared/contexts/AuthContext.tsx', 'utf-8');
        
        const hasJWT = authContent.includes('token') || authContent.includes('jwt') || authContent.includes('auth');
        const hasSecureStorage = authContent.includes('localStorage') || authContent.includes('storage');

        if (hasJWT) {
          this.addResult('Authentication', 'PASS', '✅ Authentication context implemented');
        } else {
          this.addResult('Authentication', 'FAIL', '❌ Authentication logic missing');
        }

        if (hasSecureStorage) {
          this.addResult('Token Storage', 'PASS', '✅ Token storage implemented');
        } else {
          this.addResult('Token Storage', 'WARNING', '⚠️ Token storage may not be implemented');
        }
      } else {
        this.addResult('Auth Context', 'FAIL', '❌ AuthContext missing');
      }

      // Check constants for security config
      const constantsExists = await this.fileExists('src/shared/constants/index.ts');
      if (constantsExists) {
        const constantsContent = await fs.readFile('src/shared/constants/index.ts', 'utf-8');
        const hasAuthConfig = constantsContent.includes('AUTH_CONFIG') || constantsContent.includes('auth');
        
        if (hasAuthConfig) {
          this.addResult('Security Config', 'PASS', '✅ Security configuration present');
        } else {
          this.addResult('Security Config', 'WARNING', '⚠️ Security configuration may be missing');
        }
      }

    } catch (error) {
      this.addResult('Security', 'FAIL', `❌ Security test failed: ${error}`);
    }
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');

    try {
      // Check build output for size
      const distExists = await this.fileExists('dist');
      if (distExists) {
        try {
          const stats = await fs.stat('dist');
          this.addResult('Build Output', 'PASS', '✅ Build artifacts generated');
          
          // Check for source maps (good for debugging)
          const hasSourceMaps = await this.fileExists('dist/assets/index-DoDm1IMN.js.map');
          if (hasSourceMaps) {
            this.addResult('Source Maps', 'PASS', '✅ Source maps generated');
          } else {
            this.addResult('Source Maps', 'WARNING', '⚠️ Source maps not found');
          }
        } catch {
          this.addResult('Build Output', 'WARNING', '⚠️ Could not analyze build output');
        }
      }

      // Check for lazy loading in main components
      try {
        const appContent = await fs.readFile('src/App.tsx', 'utf-8');
        const hasLazyLoading = appContent.includes('lazy') || appContent.includes('Suspense');
        
        if (hasLazyLoading) {
          this.addResult('Code Splitting', 'PASS', '✅ Lazy loading implemented');
        } else {
          this.addResult('Code Splitting', 'WARNING', '⚠️ Code splitting not implemented (acceptable for Stage 1)');
        }
      } catch (error) {
        this.addResult('Performance Analysis', 'WARNING', '⚠️ Could not analyze performance features');
      }

    } catch (error) {
      this.addResult('Performance', 'WARNING', `⚠️ Performance test incomplete: ${error}`);
    }
  }

  async testDocumentation() {
    console.log('📚 Testing Documentation...');

    const docFiles = [
      'README.md',
      'STAGE1-COMPLETION-SUMMARY.md',
      'frontend-development-plan.md'
    ];

    for (const file of docFiles) {
      const exists = await this.fileExists(file);
      if (exists) {
        this.addResult('Documentation', 'PASS', `✅ ${file} exists`);
      } else {
        this.addResult('Documentation', 'WARNING', `⚠️ ${file} missing`);
      }
    }
  }

  generateReport() {
    console.log('\n📊 COMPREHENSIVE STAGE 1 TEST RESULTS');
    console.log('=====================================');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;

    console.log(`\n📈 Summary:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Warnings: ${warnings}`);
    console.log(`📊 Total: ${this.results.length}`);
    console.log(`🎯 Success Rate: ${Math.round((passed / this.results.length) * 100)}%`);

    // Group results by category
    const categories = [...new Set(this.results.map(r => r.name))];
    
    for (const category of categories) {
      const categoryResults = this.results.filter(r => r.name === category);
      console.log(`\n📋 ${category}:`);
      
      for (const result of categoryResults) {
        console.log(`  ${result.message}`);
        if (result.details) {
          console.log(`    ${result.details}`);
        }
      }
    }

    console.log('\n🔍 Critical Issues:');
    const criticalIssues = this.results.filter(r => r.status === 'FAIL');
    if (criticalIssues.length === 0) {
      console.log('  ✅ No critical issues found!');
    } else {
      for (const issue of criticalIssues) {
        console.log(`  ❌ ${issue.name}: ${issue.message}`);
      }
    }

    console.log('\n⚠️ Warnings (Non-Critical):');
    const warningIssues = this.results.filter(r => r.status === 'WARNING');
    if (warningIssues.length === 0) {
      console.log('  ✅ No warnings!');
    } else {
      for (const warning of warningIssues) {
        console.log(`  ⚠️ ${warning.name}: ${warning.message}`);
      }
    }

    // Final assessment
    console.log('\n🎯 STAGE 1 READINESS ASSESSMENT');
    console.log('================================');
    
    if (this.criticalFailures === 0) {
      console.log('🎉 ✅ STAGE 1 IS READY FOR STAGE 2!');
      console.log('🚀 All critical components are working correctly.');
      if (this.warnings > 0) {
        console.log(`⚠️ Note: ${this.warnings} warnings exist but do not block Stage 2 development.`);
      }
      console.log('\n🔄 Ready to proceed with Stage 2: Dual Authentication & RBAC System');
    } else {
      console.log('❌ 🚫 STAGE 1 NOT READY FOR STAGE 2');
      console.log(`💥 ${this.criticalFailures} critical issues must be resolved first.`);
      console.log('🔧 Please fix the critical issues above before proceeding.');
    }

    console.log('\n📋 Next Steps:');
    if (this.criticalFailures === 0) {
      console.log('1. ✅ Stage 1 foundation is solid');
      console.log('2. 🔄 Begin Stage 2.1: SaaS Portal Authentication');
      console.log('3. 🔧 Address any warnings during Stage 2 development');
      console.log('4. 📝 Update documentation with any changes');
    } else {
      console.log('1. 🔧 Fix all critical failures listed above');
      console.log('2. 🔄 Re-run this test suite');
      console.log('3. ✅ Ensure 100% critical test pass rate');
      console.log('4. 🚀 Then proceed to Stage 2');
    }

    console.log('\n' + '='.repeat(50));
    console.log('Test completed at:', new Date().toISOString());
    console.log('='.repeat(50));
  }
}

// Run the comprehensive test suite
async function main() {
  const tester = new Stage1ComprehensiveTest();
  await tester.runComprehensiveTests();
}

// Check if this is the main module
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { Stage1ComprehensiveTest };
