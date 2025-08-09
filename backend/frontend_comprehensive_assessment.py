#!/usr/bin/env python3
"""
Comprehensive Frontend Assessment Script
Evaluates the React/Next.js frontend for production readiness and feature completeness
"""

import os
import json
import re
from pathlib import Path
from collections import defaultdict

def print_header(title, char="=", width=80):
    """Print a formatted header"""
    print(f"\n{char * width}")
    print(f"{title:^{width}}")
    print(f"{char * width}")

def print_section(title, char="-", width=60):
    """Print a formatted section header"""
    print(f"\n{title}")
    print(char * width)

def count_lines_of_code(file_path):
    """Count lines of code in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            # Count non-empty, non-comment lines
            code_lines = 0
            for line in lines:
                stripped = line.strip()
                if stripped and not stripped.startswith('//') and not stripped.startswith('/*'):
                    code_lines += 1
            return len(lines), code_lines
    except:
        return 0, 0

def analyze_package_json():
    """Analyze package.json for dependencies and scripts"""
    frontend_path = Path("frontend")
    package_json_path = frontend_path / "package.json"
    
    if not package_json_path.exists():
        return None
    
    try:
        with open(package_json_path, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
        return package_data
    except:
        return None

def find_files_by_extension(directory, extensions):
    """Find all files with given extensions in directory"""
    files = []
    if not os.path.exists(directory):
        return files
    
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                files.append(os.path.join(root, filename))
    return files

def analyze_component_structure():
    """Analyze React component structure"""
    frontend_path = "frontend"
    if not os.path.exists(frontend_path):
        return {}
    
    # Find all React component files
    react_files = find_files_by_extension(frontend_path, ['.tsx', '.jsx', '.ts', '.js'])
    
    analysis = {
        'components': [],
        'pages': [],
        'hooks': [],
        'utils': [],
        'services': [],
        'context': [],
        'types': [],
        'styles': [],
        'tests': []
    }
    
    total_lines = 0
    total_code_lines = 0
    
    for file_path in react_files:
        rel_path = os.path.relpath(file_path, frontend_path)
        lines, code_lines = count_lines_of_code(file_path)
        total_lines += lines
        total_code_lines += code_lines
        
        file_info = {
            'path': rel_path,
            'lines': lines,
            'code_lines': code_lines
        }
        
        # Categorize files
        if '/components/' in rel_path or rel_path.startswith('components/'):
            analysis['components'].append(file_info)
        elif '/pages/' in rel_path or rel_path.startswith('pages/') or '/app/' in rel_path:
            analysis['pages'].append(file_info)
        elif 'hook' in rel_path.lower() or '/hooks/' in rel_path:
            analysis['hooks'].append(file_info)
        elif '/utils/' in rel_path or '/lib/' in rel_path or '/helpers/' in rel_path:
            analysis['utils'].append(file_info)
        elif '/services/' in rel_path or '/api/' in rel_path:
            analysis['services'].append(file_info)
        elif 'context' in rel_path.lower() or '/store/' in rel_path:
            analysis['context'].append(file_info)
        elif '/types/' in rel_path or rel_path.endswith('.d.ts'):
            analysis['types'].append(file_info)
        elif '.test.' in rel_path or '.spec.' in rel_path or '/tests/' in rel_path:
            analysis['tests'].append(file_info)
    
    # Find CSS/SCSS/styled files
    style_files = find_files_by_extension(frontend_path, ['.css', '.scss', '.sass', '.module.css'])
    for file_path in style_files:
        rel_path = os.path.relpath(file_path, frontend_path)
        lines, code_lines = count_lines_of_code(file_path)
        analysis['styles'].append({
            'path': rel_path,
            'lines': lines,
            'code_lines': code_lines
        })
    
    analysis['total_files'] = len(react_files) + len(style_files)
    analysis['total_lines'] = total_lines
    analysis['total_code_lines'] = total_code_lines
    
    return analysis

def analyze_feature_coverage():
    """Analyze frontend feature coverage based on file structure"""
    frontend_path = "frontend"
    if not os.path.exists(frontend_path):
        return {}
    
    features = {
        'authentication': {'score': 0, 'files': [], 'features': []},
        'dashboard': {'score': 0, 'files': [], 'features': []},
        'student_management': {'score': 0, 'files': [], 'features': []},
        'teacher_management': {'score': 0, 'files': [], 'features': []},
        'academic_management': {'score': 0, 'files': [], 'features': []},
        'financial_management': {'score': 0, 'files': [], 'features': []},
        'communication': {'score': 0, 'files': [], 'features': []},
        'library': {'score': 0, 'files': [], 'features': []},
        'transport': {'score': 0, 'files': [], 'features': []},
        'reports': {'score': 0, 'files': [], 'features': []},
        'settings': {'score': 0, 'files': [], 'features': []},
        'notifications': {'score': 0, 'files': [], 'features': []},
    }
    
    all_files = find_files_by_extension(frontend_path, ['.tsx', '.jsx', '.ts', '.js'])
    
    # Feature detection patterns
    patterns = {
        'authentication': ['login', 'auth', 'signup', 'register', 'password', 'token'],
        'dashboard': ['dashboard', 'overview', 'home', 'main'],
        'student_management': ['student', 'enrollment', 'attendance', 'grade'],
        'teacher_management': ['teacher', 'staff', 'instructor', 'faculty'],
        'academic_management': ['academic', 'class', 'subject', 'course', 'semester', 'year'],
        'financial_management': ['fee', 'payment', 'financial', 'billing', 'invoice'],
        'communication': ['message', 'chat', 'notification', 'announcement', 'mail'],
        'library': ['library', 'book', 'borrow', 'catalog'],
        'transport': ['transport', 'vehicle', 'route', 'driver', 'bus'],
        'reports': ['report', 'analytics', 'chart', 'graph', 'export'],
        'settings': ['setting', 'config', 'preference', 'admin'],
        'notifications': ['notification', 'alert', 'toast', 'popup'],
    }
    
    for file_path in all_files:
        rel_path = os.path.relpath(file_path, frontend_path).lower()
        
        for feature, keywords in patterns.items():
            if any(keyword in rel_path for keyword in keywords):
                features[feature]['files'].append(os.path.relpath(file_path, frontend_path))
                features[feature]['score'] += 1
    
    # Calculate feature scores (0-100)
    for feature in features:
        file_count = len(features[feature]['files'])
        if file_count > 0:
            features[feature]['score'] = min(100, file_count * 10)  # Cap at 100
        
        # Add detected features based on file count
        if file_count >= 10:
            features[feature]['features'].append("Comprehensive implementation")
        elif file_count >= 5:
            features[feature]['features'].append("Good coverage")
        elif file_count >= 2:
            features[feature]['features'].append("Basic implementation")
        elif file_count >= 1:
            features[feature]['features'].append("Minimal implementation")
    
    return features

def analyze_ui_framework():
    """Analyze UI framework and component library usage"""
    package_data = analyze_package_json()
    if not package_data:
        return {}
    
    dependencies = {}
    dependencies.update(package_data.get('dependencies', {}))
    dependencies.update(package_data.get('devDependencies', {}))
    
    ui_frameworks = {
        'Material-UI': ['@mui/material', '@material-ui/core', '@material-ui/icons'],
        'Ant Design': ['antd'],
        'Chakra UI': ['@chakra-ui/react'],
        'React Bootstrap': ['react-bootstrap', 'bootstrap'],
        'Tailwind CSS': ['tailwindcss'],
        'Styled Components': ['styled-components'],
        'Emotion': ['@emotion/react', '@emotion/styled'],
        'React Hook Form': ['react-hook-form'],
        'Formik': ['formik'],
        'React Router': ['react-router-dom'],
        'Next.js Router': ['next'],
        'State Management': ['redux', '@reduxjs/toolkit', 'zustand', 'recoil', 'mobx'],
        'HTTP Client': ['axios', 'fetch', 'swr', 'react-query', '@tanstack/react-query'],
        'Charts': ['recharts', 'chart.js', 'react-chartjs-2', 'victory'],
        'Date/Time': ['date-fns', 'moment', 'dayjs'],
        'Icons': ['react-icons', 'lucide-react', '@heroicons/react'],
        'Testing': ['jest', '@testing-library/react', 'cypress', 'playwright'],
    }
    
    detected_frameworks = {}
    for framework, packages in ui_frameworks.items():
        found_packages = [pkg for pkg in packages if pkg in dependencies]
        if found_packages:
            detected_frameworks[framework] = {
                'packages': found_packages,
                'versions': [dependencies[pkg] for pkg in found_packages]
            }
    
    return detected_frameworks

def assess_code_quality():
    """Assess code quality indicators"""
    frontend_path = "frontend"
    if not os.path.exists(frontend_path):
        return {}
    
    quality_indicators = {
        'typescript_usage': 0,
        'test_coverage': 0,
        'component_modularity': 0,
        'styling_consistency': 0,
        'error_handling': 0,
        'accessibility': 0,
        'performance': 0,
    }
    
    all_files = find_files_by_extension(frontend_path, ['.tsx', '.jsx', '.ts', '.js'])
    
    # TypeScript usage
    ts_files = [f for f in all_files if f.endswith(('.ts', '.tsx'))]
    if all_files:
        quality_indicators['typescript_usage'] = (len(ts_files) / len(all_files)) * 100
    
    # Test files
    test_files = [f for f in all_files if '.test.' in f or '.spec.' in f]
    if all_files:
        quality_indicators['test_coverage'] = (len(test_files) / len(all_files)) * 100
    
    # Component modularity (based on file structure)
    component_files = [f for f in all_files if '/components/' in f]
    if all_files:
        quality_indicators['component_modularity'] = min(100, (len(component_files) / len(all_files)) * 200)
    
    # Check for common quality patterns in files
    error_handling_patterns = ['try', 'catch', 'error', 'ErrorBoundary']
    accessibility_patterns = ['aria-', 'role=', 'alt=', 'tabIndex']
    performance_patterns = ['memo', 'useCallback', 'useMemo', 'lazy', 'Suspense']
    
    files_with_error_handling = 0
    files_with_accessibility = 0
    files_with_performance = 0
    
    for file_path in all_files[:50]:  # Sample first 50 files for performance
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                if any(pattern in content for pattern in error_handling_patterns):
                    files_with_error_handling += 1
                
                if any(pattern in content for pattern in accessibility_patterns):
                    files_with_accessibility += 1
                
                if any(pattern in content for pattern in performance_patterns):
                    files_with_performance += 1
        except:
            continue
    
    sample_size = min(50, len(all_files))
    if sample_size > 0:
        quality_indicators['error_handling'] = (files_with_error_handling / sample_size) * 100
        quality_indicators['accessibility'] = (files_with_accessibility / sample_size) * 100
        quality_indicators['performance'] = (files_with_performance / sample_size) * 100
    
    return quality_indicators

def calculate_overall_score(analysis, features, quality):
    """Calculate overall frontend score"""
    scores = {
        'code_volume': 0,
        'feature_coverage': 0,
        'code_quality': 0,
        'architecture': 0,
    }
    
    # Code volume score (based on lines of code)
    total_code_lines = analysis.get('total_code_lines', 0)
    if total_code_lines > 50000:
        scores['code_volume'] = 100
    elif total_code_lines > 25000:
        scores['code_volume'] = 90
    elif total_code_lines > 10000:
        scores['code_volume'] = 80
    elif total_code_lines > 5000:
        scores['code_volume'] = 70
    elif total_code_lines > 2000:
        scores['code_volume'] = 60
    else:
        scores['code_volume'] = min(60, total_code_lines / 2000 * 60)
    
    # Feature coverage score
    feature_scores = [f['score'] for f in features.values()]
    if feature_scores:
        scores['feature_coverage'] = sum(feature_scores) / len(feature_scores)
    
    # Code quality score
    quality_scores = list(quality.values())
    if quality_scores:
        scores['code_quality'] = sum(quality_scores) / len(quality_scores)
    
    # Architecture score (based on file organization)
    component_count = len(analysis.get('components', []))
    page_count = len(analysis.get('pages', []))
    hook_count = len(analysis.get('hooks', []))
    service_count = len(analysis.get('services', []))
    
    architecture_score = 0
    if component_count > 20:
        architecture_score += 25
    elif component_count > 10:
        architecture_score += 20
    elif component_count > 5:
        architecture_score += 15
    
    if page_count > 10:
        architecture_score += 25
    elif page_count > 5:
        architecture_score += 20
    elif page_count > 2:
        architecture_score += 15
    
    if hook_count > 5:
        architecture_score += 25
    elif hook_count > 2:
        architecture_score += 15
    elif hook_count > 0:
        architecture_score += 10
    
    if service_count > 3:
        architecture_score += 25
    elif service_count > 1:
        architecture_score += 15
    elif service_count > 0:
        architecture_score += 10
    
    scores['architecture'] = architecture_score
    
    # Overall score
    overall = sum(scores.values()) / len(scores)
    
    return scores, overall

def get_grade(score):
    """Convert score to letter grade"""
    if score >= 95:
        return "A+"
    elif score >= 90:
        return "A"
    elif score >= 85:
        return "A-"
    elif score >= 80:
        return "B+"
    elif score >= 75:
        return "B"
    elif score >= 70:
        return "B-"
    elif score >= 65:
        return "C+"
    elif score >= 60:
        return "C"
    else:
        return "F"

def main():
    """Main assessment function"""
    
    print_header("🎯 COMPREHENSIVE FRONTEND ASSESSMENT 🎯", "🎯", 80)
    print("🚀 Analyzing React/Next.js School Management System Frontend")
    
    # Check if frontend directory exists
    if not os.path.exists("frontend"):
        print("\n❌ Frontend directory not found!")
        print("Please ensure you're in the project root directory with 'frontend' folder.")
        return
    
    # Analyze package.json
    print_section("📦 PACKAGE ANALYSIS")
    package_data = analyze_package_json()
    if package_data:
        print(f"✅ Project: {package_data.get('name', 'Unknown')}")
        print(f"✅ Version: {package_data.get('version', 'Unknown')}")
        print(f"✅ Dependencies: {len(package_data.get('dependencies', {}))}")
        print(f"✅ Dev Dependencies: {len(package_data.get('devDependencies', {}))}")
        
        scripts = package_data.get('scripts', {})
        print(f"✅ Build Scripts: {len(scripts)}")
        for script_name in ['build', 'dev', 'start', 'test', 'lint']:
            if script_name in scripts:
                print(f"   ✅ {script_name}: {scripts[script_name]}")
    else:
        print("❌ package.json not found or invalid")
    
    # Analyze component structure
    print_section("🏗️  COMPONENT STRUCTURE ANALYSIS")
    analysis = analyze_component_structure()
    
    print(f"📊 Total Files: {analysis.get('total_files', 0)}")
    print(f"📊 Total Lines: {analysis.get('total_lines', 0):,}")
    print(f"📊 Code Lines: {analysis.get('total_code_lines', 0):,}")
    
    categories = ['components', 'pages', 'hooks', 'utils', 'services', 'context', 'types', 'styles', 'tests']
    for category in categories:
        count = len(analysis.get(category, []))
        if count > 0:
            total_lines = sum(f.get('lines', 0) for f in analysis.get(category, []))
            print(f"   📁 {category.title()}: {count} files, {total_lines:,} lines")
    
    # Analyze UI frameworks
    print_section("🎨 UI FRAMEWORK ANALYSIS")
    frameworks = analyze_ui_framework()
    
    if frameworks:
        for framework, info in frameworks.items():
            packages = ', '.join(info['packages'])
            print(f"✅ {framework}: {packages}")
    else:
        print("⚠️  No major UI frameworks detected")
    
    # Analyze feature coverage
    print_section("🔍 FEATURE COVERAGE ANALYSIS")
    features = analyze_feature_coverage()
    
    for feature_name, feature_data in features.items():
        score = feature_data['score']
        file_count = len(feature_data['files'])
        grade = get_grade(score)
        
        if score > 0:
            print(f"   📋 {feature_name.replace('_', ' ').title()}: {score}/100 ({grade}) - {file_count} files")
            if feature_data['features']:
                print(f"      {', '.join(feature_data['features'])}")
    
    # Assess code quality
    print_section("⭐ CODE QUALITY ASSESSMENT")
    quality = assess_code_quality()
    
    for metric, score in quality.items():
        grade = get_grade(score)
        print(f"   🔍 {metric.replace('_', ' ').title()}: {score:.1f}% ({grade})")
    
    # Calculate overall scores
    print_section("📊 OVERALL SCORING")
    scores, overall_score = calculate_overall_score(analysis, features, quality)
    
    for category, score in scores.items():
        grade = get_grade(score)
        print(f"   📈 {category.replace('_', ' ').title()}: {score:.1f}% ({grade})")
    
    overall_grade = get_grade(overall_score)
    print(f"\n🏆 OVERALL SCORE: {overall_score:.1f}% ({overall_grade})")
    
    # Production readiness assessment
    print_section("🚀 PRODUCTION READINESS")
    
    readiness_score = 0
    readiness_factors = []
    
    # Check critical factors
    if analysis.get('total_code_lines', 0) > 5000:
        readiness_score += 20
        readiness_factors.append("✅ Substantial codebase")
    else:
        readiness_factors.append("⚠️  Limited codebase size")
    
    if len(analysis.get('components', [])) > 10:
        readiness_score += 20
        readiness_factors.append("✅ Good component modularity")
    else:
        readiness_factors.append("⚠️  Limited component structure")
    
    if quality.get('typescript_usage', 0) > 50:
        readiness_score += 15
        readiness_factors.append("✅ TypeScript usage")
    else:
        readiness_factors.append("⚠️  Limited TypeScript adoption")
    
    if quality.get('test_coverage', 0) > 20:
        readiness_score += 15
        readiness_factors.append("✅ Test coverage present")
    else:
        readiness_factors.append("⚠️  Limited test coverage")
    
    if len(frameworks) > 3:
        readiness_score += 15
        readiness_factors.append("✅ Modern tooling stack")
    else:
        readiness_factors.append("⚠️  Basic tooling setup")
    
    if sum(f['score'] for f in features.values()) / len(features) > 30:
        readiness_score += 15
        readiness_factors.append("✅ Good feature coverage")
    else:
        readiness_factors.append("⚠️  Limited feature implementation")
    
    print(f"🎯 Production Readiness Score: {readiness_score}/100")
    
    for factor in readiness_factors:
        print(f"   {factor}")
    
    # Final verdict
    print_header("🎉 FINAL VERDICT", "=", 80)
    
    if overall_score >= 85:
        verdict = "🏆 EXCELLENT - Production Ready"
        description = "Outstanding frontend implementation with comprehensive features"
    elif overall_score >= 75:
        verdict = "🥇 VERY GOOD - Nearly Production Ready"
        description = "Strong frontend with good coverage, minor improvements needed"
    elif overall_score >= 65:
        verdict = "🥈 GOOD - Development Stage"
        description = "Solid foundation with room for enhancement"
    elif overall_score >= 50:
        verdict = "🥉 FAIR - Early Development"
        description = "Basic implementation, requires significant development"
    else:
        verdict = "📝 NEEDS WORK - Early Stage"
        description = "Minimal implementation, extensive development required"
    
    print(f"🎯 {verdict}")
    print(f"📝 {description}")
    
    # Recommendations
    print_section("💡 RECOMMENDATIONS")
    
    recommendations = []
    
    if quality.get('test_coverage', 0) < 50:
        recommendations.append("🧪 Increase test coverage for reliability")
    
    if quality.get('typescript_usage', 0) < 80:
        recommendations.append("📝 Migrate more files to TypeScript")
    
    if len(analysis.get('components', [])) < 20:
        recommendations.append("🧩 Break down into more reusable components")
    
    if quality.get('accessibility', 0) < 60:
        recommendations.append("♿ Improve accessibility compliance")
    
    if quality.get('performance', 0) < 50:
        recommendations.append("⚡ Add performance optimizations")
    
    if not any('Testing' in f for f in frameworks.keys()):
        recommendations.append("🔍 Add comprehensive testing framework")
    
    if sum(f['score'] for f in features.values()) / len(features) < 50:
        recommendations.append("🚀 Implement missing core features")
    
    if recommendations:
        for rec in recommendations:
            print(f"   {rec}")
    else:
        print("   🎉 Excellent work! Frontend is well-implemented.")
    
    print(f"\n{'=' * 80}")

if __name__ == "__main__":
    main()
