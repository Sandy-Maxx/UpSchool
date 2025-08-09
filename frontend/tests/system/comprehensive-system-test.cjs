#!/usr/bin/env node
/**
 * COMPREHENSIVE SYSTEM TEST SCRIPT
 * Tests overall system functionality, build process, and project structure
 */

const fs = require('fs').promises
const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')

const execAsync = promisify(exec)

class ComprehensiveSystemTest {
  constructor() {
    this.results = []
    this.criticalFailures = 0
    this.warnings = 0
    this.startTime = Date.now()
  }

  addResult(category, status, message, details = '') {
    this.results.push({ category, status, message, details, timestamp: new Date().toISOString() })
    if (status === 'FAIL') this.criticalFailures++
    if (status === 'WARNING') this.warnings++
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
    console.log(`  ${emoji} ${message}`)
    if (details && status !== 'PASS') {
      console.log(`     Details: ${details}`)
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async runSystemTests() {
    console.log('🚀 Starting Comprehensive System Test Suite\n')

    await this.testProjectStructure()
    await this.testConfiguration()
    await this.testDependencies() 
    await this.testTypeScript()
    await this.testBuildSystem()
    await this.testTestingInfrastructure()
    await this.testSecurityConfiguration()
    await this.testPerformanceSetup()
    
    this.generateReport()
  }

  async testProjectStructure() {
    console.log('📁 Testing Project Structure...')
    
    const requiredDirectories = [
      'src',
      'src/shared',
      'src/saas',
      'src/tenant',
      'tests',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/system',
      'test-utils',
      'test-reports'
    ]

    for (const dir of requiredDirectories) {
      const exists = await this.fileExists(dir)
      if (exists) {
        this.addResult('Project Structure', 'PASS', `Directory exists: ${dir}`)
      } else {
        this.addResult('Project Structure', 'FAIL', `Missing directory: ${dir}`)
      }
    }

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'vitest.config.ts',
      'cypress.config.ts',
      'README.md'
    ]

    for (const file of requiredFiles) {
      const exists = await this.fileExists(file)
      if (exists) {
        this.addResult('Project Structure', 'PASS', `File exists: ${file}`)
      } else {
        this.addResult('Project Structure', 'FAIL', `Missing file: ${file}`)
      }
    }
  }

  async testConfiguration() {
    console.log('⚙️ Testing Configuration Files...')
    
    try {
      // Test package.json
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'))
      
      const requiredScripts = [
        'dev', 'build', 'test', 'test:unit', 'test:integration', 'test:e2e'
      ]
      
      for (const script of requiredScripts) {
        if (packageJson.scripts[script]) {
          this.addResult('Configuration', 'PASS', `Script configured: ${script}`)
        } else {
          this.addResult('Configuration', 'FAIL', `Missing script: ${script}`)
        }
      }

      // Test TypeScript config
      const tsconfigExists = await this.fileExists('tsconfig.json')
      if (tsconfigExists) {
        this.addResult('Configuration', 'PASS', 'TypeScript configuration exists')
      } else {
        this.addResult('Configuration', 'FAIL', 'Missing TypeScript configuration')
      }

    } catch (error) {
      this.addResult('Configuration', 'FAIL', 'Failed to parse configuration files', error.message)
    }
  }

  async testDependencies() {
    console.log('📦 Testing Dependencies...')
    
    try {
      const { stdout } = await execAsync('npm ls --depth=0')
      this.addResult('Dependencies', 'PASS', 'All dependencies installed correctly')
    } catch (error) {
      this.addResult('Dependencies', 'WARNING', 'Some dependency issues detected', error.message)
    }

    // Check for critical dependencies
    const criticalDeps = [
      'react', 'react-dom', '@reduxjs/toolkit', 'react-redux',
      'vitest', 'cypress', '@testing-library/react'
    ]

    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'))
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      for (const dep of criticalDeps) {
        if (allDeps[dep]) {
          this.addResult('Dependencies', 'PASS', `Critical dependency present: ${dep}`)
        } else {
          this.addResult('Dependencies', 'FAIL', `Missing critical dependency: ${dep}`)
        }
      }
    } catch (error) {
      this.addResult('Dependencies', 'FAIL', 'Failed to check dependencies', error.message)
    }
  }

  async testTypeScript() {
    console.log('🔍 Testing TypeScript Configuration...')
    
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit')
      if (stderr && stderr.includes('error')) {
        this.addResult('TypeScript', 'FAIL', 'TypeScript compilation errors detected', stderr)
      } else {
        this.addResult('TypeScript', 'PASS', 'TypeScript compilation successful')
      }
    } catch (error) {
      this.addResult('TypeScript', 'FAIL', 'TypeScript compilation failed', error.message)
    }
  }

  async testBuildSystem() {
    console.log('🔨 Testing Build System...')
    
    try {
      console.log('   Building project...')
      const { stdout, stderr } = await execAsync('npm run build', { timeout: 120000 })
      
      if (stderr && stderr.includes('error')) {
        this.addResult('Build System', 'FAIL', 'Build process failed', stderr)
        return
      }

      // Check if build artifacts exist
      const buildExists = await this.fileExists('dist')
      if (buildExists) {
        this.addResult('Build System', 'PASS', 'Build artifacts created successfully')
      } else {
        this.addResult('Build System', 'FAIL', 'Build artifacts not found')
      }

      // Check for critical build files
      const buildFiles = ['dist/index.html', 'dist/assets']
      for (const file of buildFiles) {
        const exists = await this.fileExists(file)
        if (exists) {
          this.addResult('Build System', 'PASS', `Build file exists: ${file}`)
        } else {
          this.addResult('Build System', 'WARNING', `Build file missing: ${file}`)
        }
      }

    } catch (error) {
      this.addResult('Build System', 'FAIL', 'Build system test failed', error.message)
    }
  }

  async testTestingInfrastructure() {
    console.log('🧪 Testing Testing Infrastructure...')
    
    const testConfigs = [
      'vitest.config.ts',
      'vitest.unit.config.ts',
      'vitest.integration.config.ts',
      'cypress.config.ts',
      'tests/setup/vitest-setup.ts'
    ]

    for (const config of testConfigs) {
      const exists = await this.fileExists(config)
      if (exists) {
        this.addResult('Testing Infrastructure', 'PASS', `Test config exists: ${config}`)
      } else {
        this.addResult('Testing Infrastructure', 'FAIL', `Missing test config: ${config}`)
      }
    }

    // Test if test commands work
    try {
      const { stdout } = await execAsync('npm run test -- --run --reporter=basic', { timeout: 30000 })
      this.addResult('Testing Infrastructure', 'PASS', 'Test runner working correctly')
    } catch (error) {
      this.addResult('Testing Infrastructure', 'WARNING', 'Test runner issues detected', error.message)
    }
  }

  async testSecurityConfiguration() {
    console.log('🔒 Testing Security Configuration...')
    
    try {
      const { stdout } = await execAsync('npm audit --audit-level moderate')
      this.addResult('Security', 'PASS', 'No moderate or high severity vulnerabilities')
    } catch (error) {
      this.addResult('Security', 'WARNING', 'Security vulnerabilities detected', error.message)
    }

    // Check for security-related files
    const securityFiles = ['.env.example', '.gitignore']
    for (const file of securityFiles) {
      const exists = await this.fileExists(file)
      if (exists) {
        this.addResult('Security', 'PASS', `Security file exists: ${file}`)
      } else {
        this.addResult('Security', 'WARNING', `Security file missing: ${file}`)
      }
    }
  }

  async testPerformanceSetup() {
    console.log('⚡ Testing Performance Setup...')
    
    const perfFiles = ['lighthouserc.js']
    for (const file of perfFiles) {
      const exists = await this.fileExists(file)
      if (exists) {
        this.addResult('Performance', 'PASS', `Performance config exists: ${file}`)
      } else {
        this.addResult('Performance', 'WARNING', `Performance config missing: ${file}`)
      }
    }
  }

  generateReport() {
    const duration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const warnings = this.results.filter(r => r.status === 'WARNING').length

    console.log('\n📊 COMPREHENSIVE SYSTEM TEST RESULTS')
    console.log('='.repeat(50))
    
    console.log('\n📈 Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️ Warnings: ${warnings}`)
    console.log(`📊 Total: ${this.results.length}`)
    console.log(`🎯 Success Rate: ${Math.round((passed / this.results.length) * 100)}%`)
    console.log(`⏱️ Duration: ${Math.round(duration / 1000)}s`)

    // Save detailed report
    const reportPath = `test-reports/system-test-${Date.now()}.json`
    fs.writeFile(reportPath, JSON.stringify({
      summary: { passed, failed, warnings, total: this.results.length, duration },
      results: this.results
    }, null, 2)).catch(console.error)

    console.log('\n🎯 SYSTEM READINESS ASSESSMENT')
    console.log('='.repeat(50))
    
    if (this.criticalFailures === 0) {
      console.log('🎉 ✅ SYSTEM IS OPERATIONAL!')
      console.log('🚀 All critical components are working correctly.')
      console.log(`\n🔄 System ready for development and testing.`)
    } else {
      console.log('❌ 🚫 SYSTEM NOT READY')
      console.log(`💥 ${this.criticalFailures} critical issues must be resolved.`)
    }

    if (warnings > 0) {
      console.log(`\n⚠️ Note: ${warnings} warnings detected. Review recommended.`)
    }

    process.exit(this.criticalFailures > 0 ? 1 : 0)
  }
}

// Run the comprehensive system test
if (require.main === module) {
  const test = new ComprehensiveSystemTest()
  test.runSystemTests().catch(error => {
    console.error('System test failed:', error)
    process.exit(1)
  })
}

module.exports = ComprehensiveSystemTest
