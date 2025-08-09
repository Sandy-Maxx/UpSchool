#!/usr/bin/env node

/**
 * STAGE 1: FRONTEND FOUNDATION COMPREHENSIVE TEST
 * Tests all Stage 1 components and validates readiness for Stage 2
 * 
 * Usage: node tests/system/stage1-comprehensive-test.cjs
 */

const { ComprehensiveStageTestBase } = require('../../test-utils/helpers/ComprehensiveStageTestBase.cjs');

class Stage1ComprehensiveTest extends ComprehensiveStageTestBase {
  constructor() {
    super('Stage 1: Frontend Foundation', 1);
  }

  async testStageSpecificFeatures() {
    console.log('🎯 Testing Stage 1 Specific Features...');
    
    // Stage 1 is focused on foundation - all critical tests are in the base class
    // Additional Stage 1 specific validations
    await this.testPortalAwareArchitecture();
    await this.testReactIntegration();
    await this.testViteBuildSystem();
  }

  async testPortalAwareArchitecture() {
    console.log('  Testing Portal-Aware Architecture...');
    
    // Check for portal-specific directories and structure
    const portalDirs = ['src/saas', 'src/tenant', 'src/shared'];
    let allPortalDirsExist = true;
    
    for (const dir of portalDirs) {
      const exists = await this.fileExists(dir);
      if (!exists) {
        allPortalDirsExist = false;
        break;
      }
    }
    
    if (allPortalDirsExist) {
      this.addResult('Portal Architecture', 'PASS', '✅ Portal-aware directory structure implemented');
    } else {
      this.addResult('Portal Architecture', 'FAIL', '❌ Portal-aware directory structure incomplete');
    }

    // Check for portal detection in API client
    try {
      const apiClientExists = await this.fileExists('src/shared/services/api/client.ts');
      if (apiClientExists) {
        const clientContent = await this.readFile('src/shared/services/api/client.ts');
        
        if (clientContent.includes('detectPortalContext') || clientContent.includes('portalType')) {
          this.addResult('Portal Detection', 'PASS', '✅ Portal detection logic implemented in API client');
        } else {
          this.addResult('Portal Detection', 'WARNING', '⚠️ Portal detection may not be fully implemented');
        }
      }
    } catch (error) {
      this.addResult('Portal Detection', 'WARNING', '⚠️ Could not analyze portal detection logic');
    }
  }

  async testReactIntegration() {
    console.log('  Testing React Integration...');
    
    // Test React 18+ features
    try {
      const mainContent = await this.readFile('src/main.tsx');
      
      // Check for React 18 createRoot
      if (mainContent.includes('createRoot')) {
        this.addResult('React 18', 'PASS', '✅ React 18 createRoot API used');
      } else if (mainContent.includes('ReactDOM.render')) {
        this.addResult('React 18', 'WARNING', '⚠️ Using legacy ReactDOM.render API');
      } else {
        this.addResult('React 18', 'FAIL', '❌ React root mounting not found');
      }

      // Check for StrictMode
      if (mainContent.includes('StrictMode')) {
        this.addResult('React StrictMode', 'PASS', '✅ React.StrictMode enabled');
      } else {
        this.addResult('React StrictMode', 'WARNING', '⚠️ React.StrictMode not enabled');
      }

    } catch (error) {
      this.addResult('React Integration', 'FAIL', `❌ Failed to analyze React integration: ${error.message}`);
    }
  }

  async testViteBuildSystem() {
    console.log('  Testing Vite Build System...');
    
    // Test Vite configuration
    try {
      const viteConfigExists = await this.fileExists('vite.config.ts');
      if (viteConfigExists) {
        const viteConfig = await this.readFile('vite.config.ts');
        
        // Check for essential Vite React plugin
        if (viteConfig.includes('@vitejs/plugin-react')) {
          this.addResult('Vite React Plugin', 'PASS', '✅ Vite React plugin configured');
        } else {
          this.addResult('Vite React Plugin', 'FAIL', '❌ Vite React plugin not found');
        }

        // Check for path aliases
        if (viteConfig.includes('resolve') && viteConfig.includes('alias')) {
          this.addResult('Vite Path Aliases', 'PASS', '✅ Vite path aliases configured');
        } else {
          this.addResult('Vite Path Aliases', 'WARNING', '⚠️ Vite path aliases not configured');
        }

        // Check for development server configuration
        if (viteConfig.includes('server')) {
          this.addResult('Vite Dev Server', 'PASS', '✅ Vite dev server configured');
        } else {
          this.addResult('Vite Dev Server', 'WARNING', '⚠️ Custom dev server config not found');
        }

      } else {
        this.addResult('Vite Configuration', 'FAIL', '❌ vite.config.ts not found');
      }
    } catch (error) {
      this.addResult('Vite Build System', 'FAIL', `❌ Vite analysis failed: ${error.message}`);
    }

    // Test dev server startup (without actually starting it)
    try {
      const packageJson = await this.readJsonFile('package.json');
      
      if (packageJson.scripts?.dev && packageJson.scripts.dev.includes('vite')) {
        this.addResult('Vite Dev Script', 'PASS', '✅ Vite dev script configured');
      } else {
        this.addResult('Vite Dev Script', 'FAIL', '❌ Vite dev script not configured');
      }

      if (packageJson.scripts?.build && packageJson.scripts.build.includes('vite build')) {
        this.addResult('Vite Build Script', 'PASS', '✅ Vite build script configured');
      } else {
        this.addResult('Vite Build Script', 'FAIL', '❌ Vite build script not configured');
      }

    } catch (error) {
      this.addResult('Vite Scripts', 'FAIL', `❌ Script analysis failed: ${error.message}`);
    }
  }

  async readFile(filePath) {
    const fs = require('fs').promises;
    return await fs.readFile(filePath, 'utf-8');
  }

  // Override documentation check for Stage 1 specific docs
  async testDocumentation() {
    console.log('📚 Testing Stage 1 Documentation...');

    const stage1DocFiles = [
      'README.md',
      'STAGE1-COMPLETION-SUMMARY.md',
      'tests/TESTING-GUIDE.md',
      'frontend-development-plan.md'
    ];

    for (const file of stage1DocFiles) {
      const exists = await this.fileExists(file);
      if (exists) {
        this.addResult('Documentation', 'PASS', `✅ ${file} exists`);
      } else {
        this.addResult('Documentation', 'WARNING', `⚠️ ${file} missing`);
      }
    }

    // Check if Stage 1 completion summary exists and has content
    try {
      if (await this.fileExists('STAGE1-COMPLETION-SUMMARY.md')) {
        const summaryContent = await this.readFile('STAGE1-COMPLETION-SUMMARY.md');
        
        if (summaryContent.length > 100 && summaryContent.includes('Stage 1')) {
          this.addResult('Stage 1 Summary', 'PASS', '✅ Stage 1 completion summary has content');
        } else {
          this.addResult('Stage 1 Summary', 'WARNING', '⚠️ Stage 1 completion summary may be incomplete');
        }
      }
    } catch (error) {
      this.addResult('Stage 1 Summary', 'WARNING', '⚠️ Could not analyze Stage 1 completion summary');
    }
  }
}

// Run the comprehensive test suite
async function main() {
  console.log('🚀 STAGE 1: FRONTEND FOUNDATION COMPREHENSIVE TEST\n');
  console.log('Testing all Stage 1 components for readiness to proceed to Stage 2...\n');
  
  const tester = new Stage1ComprehensiveTest();
  await tester.runComprehensiveTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { Stage1ComprehensiveTest };
