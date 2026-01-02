/**
 * Review Service - Handles PR review logic based on branch naming conventions
 */

class ReviewService {
  /**
   * Analyze code changes and generate feedback based on branch type
   * @param {string} branchName - The name of the branch being reviewed
   * @param {string} codeDiff - The code diff/changes (mocked for now)
   * @returns {Object} - Review result with feedback and status
   */
  analyzeChanges(branchName, codeDiff = '') {
    // Determine branch type
    if (branchName === 'main' || branchName === 'master') {
      return this.reviewMainBranch(branchName, codeDiff);
    } else if (branchName.startsWith('feature/')) {
      return this.reviewFeatureBranch(branchName, codeDiff);
    } else if (branchName.startsWith('hotfix/')) {
      return this.reviewHotfixBranch(branchName, codeDiff);
    } else {
      return this.reviewOtherBranch(branchName, codeDiff);
    }
  }

  /**
   * Review main/master branch - Direct commits should not be allowed
   */
  reviewMainBranch(branchName, codeDiff) {
    const feedback = `
## CRITICAL WARNING: Direct Commit to ${branchName}

### Issue
Direct commits to the ${branchName} branch are not allowed.

### Required Actions
1. Create a feature branch from ${branchName}
2. Make your changes in the feature branch
3. Open a Pull Request for review
4. Only merge to ${branchName} through approved PRs

### Branch Naming Convention
- Feature: \`feature/your-feature-name\`
- Hotfix: \`hotfix/issue-description\`
- Bugfix: \`bugfix/bug-description\`

### Status: REJECTED
    `.trim();

    return {
      status: 'REJECTED',
      feedback,
      severity: 'CRITICAL',
      approved: false
    };
  }

  /**
   * Review feature branch - Check for proper implementation patterns
   */
  reviewFeatureBranch(branchName, codeDiff) {
    const issues = [];
    const suggestions = [];
    const positives = [];

    // Mock: Check if code creates new functions
    const hasNewFunctions = this.detectNewFunctions(codeDiff);
    const hasTests = this.detectTests(codeDiff);
    const hasDocumentation = this.detectDocumentation(codeDiff);
    const linesChanged = this.countLinesChanged(codeDiff);

    // Analyze feature branch
    if (hasNewFunctions) {
      positives.push('New functions detected - good feature implementation');
      
      if (!hasTests) {
        issues.push('New functions added but no test files detected');
        suggestions.push('Add unit tests for the new functions');
      } else {
        positives.push('Test files included - excellent');
      }

      if (!hasDocumentation) {
        suggestions.push('Consider adding JSDoc comments to new functions');
      }
    } else {
      suggestions.push('Consider breaking down changes into smaller, focused features');
    }

    if (linesChanged > 500) {
      issues.push('Large changeset detected (500+ lines)');
      suggestions.push('Consider splitting this into multiple smaller PRs for easier review');
    }

    // Build feedback
    const feedback = this.buildFeedback(branchName, positives, issues, suggestions, 'FEATURE');

    return {
      status: issues.length > 3 ? 'NEEDS_CHANGES' : 'APPROVED',
      feedback,
      severity: issues.length > 3 ? 'MAJOR' : 'MINOR',
      approved: issues.length <= 3
    };
  }

  /**
   * Review hotfix branch - Strict rules for minimal changes
   */
  reviewHotfixBranch(branchName, codeDiff) {
    const issues = [];
    const suggestions = [];
    const positives = [];

    const linesChanged = this.countLinesChanged(codeDiff);
    const hasNewFunctions = this.detectNewFunctions(codeDiff);
    const affectsMultipleFiles = this.detectMultipleFiles(codeDiff);
    const hasTests = this.detectTests(codeDiff);

    // Strict hotfix rules
    if (linesChanged > 100) {
      issues.push('CRITICAL: Hotfix changes exceed 100 lines');
      issues.push('Hotfixes should be minimal and focused on the immediate issue');
      suggestions.push('Consider creating a feature branch for extensive changes');
    } else {
      positives.push('Change scope is appropriately minimal');
    }

    if (hasNewFunctions) {
      issues.push('WARNING: New functions detected in hotfix');
      issues.push('Hotfixes should modify existing code, not add new features');
      suggestions.push('Move new functionality to a feature branch');
    } else {
      positives.push('No new functions - appropriate for hotfix');
    }

    if (affectsMultipleFiles > 5) {
      issues.push('Changes affect multiple files (5+)');
      suggestions.push('Hotfixes should be surgical and focused on specific files');
    } else {
      positives.push('Limited file scope - focused fix');
    }

    if (!hasTests) {
      issues.push('No test updates detected');
      suggestions.push('Add regression tests to prevent this issue from recurring');
    }

    // Build feedback
    const feedback = this.buildFeedback(branchName, positives, issues, suggestions, 'HOTFIX');

    return {
      status: issues.some(i => i.includes('CRITICAL')) ? 'REJECTED' : issues.length > 2 ? 'NEEDS_CHANGES' : 'APPROVED',
      feedback,
      severity: issues.some(i => i.includes('CRITICAL')) ? 'CRITICAL' : 'MAJOR',
      approved: !issues.some(i => i.includes('CRITICAL')) && issues.length <= 2
    };
  }

  /**
   * Review other branches
   */
  reviewOtherBranch(branchName, codeDiff) {
    const feedback = `
## Branch Review: ${branchName}

### Branch Type
Other/Custom

### Recommendation
Consider following standard branch naming conventions:
- \`feature/\` - For new features
- \`hotfix/\` - For urgent production fixes
- \`bugfix/\` - For bug fixes
- \`chore/\` - For maintenance tasks

### Current Assessment
Manual review recommended

### Status: PENDING REVIEW
    `.trim();

    return {
      status: 'PENDING',
      feedback,
      severity: 'INFO',
      approved: false
    };
  }

  // Mock helper functions to detect patterns in code diff

  detectNewFunctions(codeDiff) {
    // Mock: Check for function declarations
    const patterns = [
      /function\s+\w+\s*\(/g,
      /const\s+\w+\s*=\s*\(/g,
      /\w+\s*\(.*\)\s*{/g,
      /async\s+function/g
    ];
    return patterns.some(pattern => pattern.test(codeDiff));
  }

  detectTests(codeDiff) {
    // Mock: Check for test files or test patterns
    return codeDiff.includes('test') || 
           codeDiff.includes('.spec.') || 
           codeDiff.includes('describe(') ||
           codeDiff.includes('it(');
  }

  detectDocumentation(codeDiff) {
    // Mock: Check for documentation
    return codeDiff.includes('/**') || 
           codeDiff.includes('README') ||
           codeDiff.includes('@param') ||
           codeDiff.includes('@returns');
  }

  countLinesChanged(codeDiff) {
    // Mock: Count lines (in real implementation, parse actual diff)
    if (!codeDiff) return 0;
    return codeDiff.split('\n').length;
  }

  detectMultipleFiles(codeDiff) {
    // Mock: Count affected files
    if (!codeDiff) return 0;
    return Math.floor(Math.random() * 10) + 1; // Mock random file count
  }

  buildFeedback(branchName, positives, issues, suggestions, type) {
    let feedback = `## ${type} Branch Review: \`${branchName}\`\n\n`;

    if (positives.length > 0) {
      feedback += '### Strengths\n';
      positives.forEach(item => feedback += `- ${item}\n`);
      feedback += '\n';
    }

    if (issues.length > 0) {
      feedback += '### Issues Found\n';
      issues.forEach(item => feedback += `- ${item}\n`);
      feedback += '\n';
    }

    if (suggestions.length > 0) {
      feedback += '### Suggestions\n';
      suggestions.forEach(item => feedback += `- ${item}\n`);
      feedback += '\n';
    }

    // Overall status
    if (issues.length === 0) {
      feedback += '### Status: APPROVED\n';
      feedback += 'Great work! This PR meets all quality standards.\n';
    } else if (issues.some(i => i.includes('CRITICAL'))) {
      feedback += '### Status: REJECTED\n';
      feedback += 'Critical issues must be resolved before merging.\n';
    } else {
      feedback += '### Status: NEEDS CHANGES\n';
      feedback += 'Please address the issues above before final approval.\n';
    }

    return feedback.trim();
  }
}

module.exports = new ReviewService();
