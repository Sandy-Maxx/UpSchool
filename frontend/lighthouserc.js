module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/', // SaaS Landing Page
        'http://localhost:5173/auth', // SaaS Auth Page
        'http://localhost:5173/register', // SaaS Registration
        'http://localhost:5173/tenant', // Tenant Portal
        'http://localhost:5173/tenant/auth', // Tenant Auth
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready in',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['redirects-http']
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './test-reports/lighthouse'
    }
  }
}
