#!/usr/bin/env node

/**
 * MASTER COMPREHENSIVE TEST RUNNER
 * Runs all stage tests and generates unified reports
 * 
 * Usage: 
 *   node run-comprehensive-tests.cjs                    # Run current stage
 *   node run-comprehensive-tests.cjs --all             # Run all stages
 *   node run-comprehensive-tests.cjs --stage=2         # Run specific stage
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

class MasterTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTests() {
    console.log('🚀 UPSCHOOL FRONTEND - MASTER COMPREHENSIVE TEST RUNNER\n');
    console.log('='.repeat(70));
    console.log('Running comprehensive tests for the UpSchool Frontend Platform');
    console.log('='.repeat(70));

    const args = process.argv.slice(2);
    const runAll = args.includes('--all');
    const stageArg = args.find(arg => arg.startsWith('--stage='));
    const specificStage = stageArg ? parseInt(stageArg.split('=')[1]) : null;

    if (runAll) {
      await this.runAllStages();
    } else if (specificStage) {
      await this.runSpecificStage(specificStage);
    } else {
      await this.runCurrentStage();
    }

    await this.generateMasterReport();
  }

  async runCurrentStage() {
    console.log('\n📋 Running Current Stage Tests...\n');
    
    // Determine current stage based on what's implemented
    const currentStage = await this.determineCurrentStage();
    console.log(`🎯 Detected Current Stage: ${currentStage}\n`);
    
    await this.runSpecificStage(currentStage);
  }

  async runAllStages() {
    console.log('\n📋 Running All Available Stage Tests...\n');
    
    const availableStages = await this.getAvailableStages();
    
    for (const stage of availableStages) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🔄 RUNNING STAGE ${stage} TESTS`);
      console.log(`${'='.repeat(50)}\n`);
      
      await this.runSpecificStage(stage);
      
      // Add separator between stages
      console.log(`\n${'='.repeat(50)}`);
      console.log(`✅ STAGE ${stage} TESTS COMPLETED`);
      console.log(`${'='.repeat(50)}\n`);
    }
  }

  async runSpecificStage(stageNumber) {
    const testFile = `tests/system/stage${stageNumber}-${this.getStageTestFile(stageNumber)}`;
    
    if (await this.fileExists(testFile)) {
      try {
        console.log(`⏳ Running Stage ${stageNumber} tests...`);
        
        const { stdout, stderr } = await execAsync(`node ${testFile}`, { 
          timeout: 120000,  // 2 minute timeout
          cwd: process.cwd()
        });
        
        // Capture the output
        this.results.push({
          stage: stageNumber,
          status: 'COMPLETED',
          output: stdout,
          errors: stderr || null,
          timestamp: new Date().toISOString()
        });
        
        console.log(stdout);
        if (stderr && stderr.trim()) {
          console.error('Warnings/Errors:', stderr);
        }
        
      } catch (error) {
        console.error(`❌ Stage ${stageNumber} tests failed:`, error.message);
        
        this.results.push({
          stage: stageNumber,
          status: 'FAILED',
          output: error.stdout || '',
          errors: error.stderr || error.message,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      console.log(`⚠️ Stage ${stageNumber} test file not found: ${testFile}`);
      console.log(`   This stage may not be implemented yet.`);
      
      this.results.push({
        stage: stageNumber,
        status: 'NOT_FOUND',
        output: '',
        errors: `Test file not found: ${testFile}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  async determineCurrentStage() {
    // Logic to determine current stage based on implemented features
    const stages = [
      {
        stage: 1,
        testFile: 'tests/system/stage1-comprehensive-test.cjs',
        indicators: ['src/main.tsx', 'src/App.tsx', 'src/shared/store/index.ts']
      },
      {
        stage: 2,
        testFile: 'tests/system/stage2-authentication-test.cjs',
        indicators: ['src/shared/services/auth/oauth.ts', 'src/saas/components/auth/LoginForm.tsx']
      },
      {
        stage: 3,
        testFile: 'tests/system/stage3-saas-features-test.cjs',
        indicators: ['src/saas/components/pricing', 'src/saas/components/marketing']
      },
      {
        stage: 4,
        testFile: 'tests/system/stage4-tenant-features-test.cjs',
        indicators: ['src/tenant/components/dashboard', 'src/tenant/components/users']
      },
      {
        stage: 5,
        testFile: 'tests/system/stage5-advanced-features-test.cjs',
        indicators: ['src/shared/services/cdn', 'src/shared/workers']
      }
    ];

    // Check stages in reverse order to find the highest implemented stage
    for (let i = stages.length - 1; i >= 0; i--) {
      const stage = stages[i];
      const hasIndicators = await this.checkStageIndicators(stage.indicators);
      
      if (hasIndicators) {
        return stage.stage;
      }
    }

    // Default to Stage 1 if nothing is detected
    return 1;
  }

  async checkStageIndicators(indicators) {
    for (const indicator of indicators) {
      if (await this.fileExists(indicator)) {
        return true;
      }
    }
    return false;
  }

  async getAvailableStages() {
    const availableStages = [];
    
    for (let stage = 1; stage <= 5; stage++) {
      const testFile = `tests/system/stage${stage}-${this.getStageTestFile(stage)}`;
      if (await this.fileExists(testFile)) {
        availableStages.push(stage);
      }
    }
    
    return availableStages;
  }

  getStageTestFile(stageNumber) {
    const stageFiles = {
      1: 'comprehensive-test.cjs',
      2: 'authentication-test.cjs',
      3: 'saas-features-test.cjs',
      4: 'tenant-features-test.cjs',
      5: 'advanced-features-test.cjs'
    };
    
    return stageFiles[stageNumber] || 'comprehensive-test.cjs';
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async generateMasterReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 MASTER COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(70));
    
    console.log(`\n⏱️ Total Test Duration: ${Math.round(duration / 1000)}s`);
    console.log(`📅 Test Run Date: ${new Date().toISOString()}\n`);
    
    // Summary by stage
    const completedStages = this.results.filter(r => r.status === 'COMPLETED').length;
    const failedStages = this.results.filter(r => r.status === 'FAILED').length;
    const notFoundStages = this.results.filter(r => r.status === 'NOT_FOUND').length;
    
    console.log('📈 Test Summary:');
    console.log(`  ✅ Completed Stages: ${completedStages}`);
    console.log(`  ❌ Failed Stages: ${failedStages}`);
    console.log(`  ⚠️ Not Found/Not Implemented: ${notFoundStages}`);
    console.log(`  📊 Total Stages Tested: ${this.results.length}`);
    
    // Stage-by-stage breakdown
    console.log('\n📋 Stage-by-Stage Results:');
    for (const result of this.results) {
      const icon = result.status === 'COMPLETED' ? '✅' : 
                  result.status === 'FAILED' ? '❌' : '⚠️';
      console.log(`  ${icon} Stage ${result.stage}: ${result.status}`);
      
      if (result.errors && result.status !== 'NOT_FOUND') {
        console.log(`     Error: ${result.errors.split('\n')[0]}`);
      }
    }
    
    // Overall assessment
    console.log('\n🎯 OVERALL ASSESSMENT');
    console.log('-'.repeat(30));
    
    if (failedStages === 0 && completedStages > 0) {
      console.log('🎉 ALL TESTED STAGES PASSED!');
      console.log('✅ Frontend development is on track.');
      
      const highestCompleted = Math.max(...this.results
        .filter(r => r.status === 'COMPLETED')
        .map(r => r.stage));
      
      if (highestCompleted < 5) {
        console.log(`\n🔄 Ready to proceed with Stage ${highestCompleted + 1} development.`);
      } else {
        console.log('\n🎊 ALL STAGES COMPLETE! Ready for production deployment.');
      }
    } else if (failedStages > 0) {
      console.log('❌ SOME STAGES HAVE FAILURES');
      console.log('🔧 Please address failed stage issues before proceeding.');
      
      const failedStageNumbers = this.results
        .filter(r => r.status === 'FAILED')
        .map(r => r.stage);
      console.log(`\n💥 Failed Stages: ${failedStageNumbers.join(', ')}`);
    } else {
      console.log('⚠️ NO STAGES COMPLETED SUCCESSFULLY');
      console.log('🔍 Please check if stage test files exist and are configured correctly.');
    }
    
    // Next steps
    console.log('\n📋 Recommended Next Steps:');
    if (failedStages > 0) {
      console.log('1. 🔧 Fix critical issues in failed stages');
      console.log('2. 🔄 Re-run failed stage tests');
      console.log('3. ✅ Ensure all tests pass before proceeding');
    } else if (completedStages > 0) {
      console.log('1. ✅ Current stage(s) are solid');
      console.log('2. 🚀 Continue with next stage development');
      console.log('3. 📝 Update documentation as needed');
      console.log('4. 🔄 Run tests regularly during development');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('Master test report completed at:', new Date().toISOString());
    console.log('='.repeat(70));
    
    // Write detailed report to file
    await this.writeMasterReportToFile();
  }

  async writeMasterReportToFile() {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.startTime,
        summary: {
          totalStages: this.results.length,
          completed: this.results.filter(r => r.status === 'COMPLETED').length,
          failed: this.results.filter(r => r.status === 'FAILED').length,
          notFound: this.results.filter(r => r.status === 'NOT_FOUND').length
        },
        results: this.results
      };
      
      const fileName = `test-reports/master-report-${Date.now()}.json`;
      await fs.writeFile(fileName, JSON.stringify(reportData, null, 2));
      console.log(`\n📄 Detailed master report saved to: ${fileName}`);
    } catch (error) {
      console.error('Failed to write master report:', error.message);
    }
  }
}

// Run the master test suite
async function main() {
  const runner = new MasterTestRunner();
  await runner.runTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MasterTestRunner };
