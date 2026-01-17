const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const os = require('os');

// Skills registry - maps skill names to their paths and metadata
const SKILLS_REGISTRY = {
  // General skills
  'pptx': {
    path: 'general/pptx',
    category: 'general',
    description: 'PowerPoint creation, editing, and OOXML manipulation'
  },
  'doc-coauthoring': {
    path: 'general/doc-coauthoring',
    category: 'general',
    description: 'Structured workflow for collaborative documentation'
  },
  'internal-comms': {
    path: 'general/internal-comms',
    category: 'general',
    description: 'Templates for internal communications'
  },

  // Auth skills
  'better-auth': {
    path: 'auth/skills/better-auth-best-practices',
    category: 'auth',
    description: 'Better Auth framework best practices for TypeScript'
  },
  'create-auth': {
    path: 'auth/skills/create-auth-skill',
    category: 'auth',
    description: 'Create authentication layers using Better Auth'
  },

  // Frontend skills
  'web-design-guidelines': {
    path: 'auth/skills/web-design-guidelines',
    category: 'frontend',
    description: 'UI compliance checker for Web Interface Guidelines'
  },
  'bulletproof-react': {
    path: 'frontend/react-nextjs/skills/bulletproof-react',
    category: 'frontend',
    description: 'Feature-based React architecture patterns'
  },
  'vercel-react': {
    path: 'frontend/react-nextjs/skills/vercel-react-best-practices',
    category: 'frontend',
    description: 'Vercel React performance optimization (45 rules)'
  }
};

// Aliases for common variations
const SKILL_ALIASES = {
  'better-auth-best-practices': 'better-auth',
  'create-auth-skill': 'create-auth',
  'powerpoint': 'pptx',
  'auth': 'better-auth',
  'react': 'bulletproof-react',
  'vercel': 'vercel-react',
  'docs': 'doc-coauthoring',
  'comms': 'internal-comms'
};

function getSkillsRoot() {
  // Get the root of the package (where skills folders are)
  return path.resolve(__dirname, '../..');
}

function resolveSkillName(name) {
  const normalized = name.toLowerCase();
  return SKILL_ALIASES[normalized] || normalized;
}

function getTargetDir(isGlobal) {
  if (isGlobal) {
    return path.join(os.homedir(), '.claude', 'skills');
  }
  return path.join(process.cwd(), '.claude', 'skills');
}

async function installSkill(skillName, options = {}) {
  const resolvedName = resolveSkillName(skillName);
  const skillInfo = SKILLS_REGISTRY[resolvedName];

  if (!skillInfo) {
    console.log(chalk.red(`\n❌ Skill "${skillName}" not found.\n`));
    console.log(chalk.yellow('Available skills:'));
    Object.entries(SKILLS_REGISTRY).forEach(([name, info]) => {
      console.log(chalk.gray(`  • ${name} - ${info.description}`));
    });
    process.exit(1);
  }

  const skillsRoot = getSkillsRoot();
  const sourcePath = path.join(skillsRoot, skillInfo.path);
  const targetDir = getTargetDir(options.global);
  const targetPath = path.join(targetDir, resolvedName);

  // Check if source exists
  if (!await fs.pathExists(sourcePath)) {
    console.log(chalk.red(`\n❌ Skill source not found at: ${sourcePath}`));
    process.exit(1);
  }

  // Check if already installed
  if (await fs.pathExists(targetPath)) {
    if (!options.yes) {
      const { overwrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `Skill "${resolvedName}" already exists. Overwrite?`,
        default: false
      }]);

      if (!overwrite) {
        console.log(chalk.yellow('\n⚠️  Installation cancelled.'));
        return;
      }
    }
    await fs.remove(targetPath);
  }

  const spinner = ora(`Installing ${resolvedName}...`).start();

  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Copy skill
    await fs.copy(sourcePath, targetPath);

    spinner.succeed(chalk.green(`Installed ${resolvedName} to ${targetPath}`));

    console.log(chalk.gray(`\n📁 Location: ${targetPath}`));
    console.log(chalk.gray(`📝 Category: ${skillInfo.category}`));
    console.log(chalk.cyan(`\n✨ Skill "${resolvedName}" is now available in Claude Code!\n`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to install ${resolvedName}`));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function removeSkill(skillName, options = {}) {
  const resolvedName = resolveSkillName(skillName);
  const targetDir = getTargetDir(options.global);
  const targetPath = path.join(targetDir, resolvedName);

  if (!await fs.pathExists(targetPath)) {
    console.log(chalk.yellow(`\n⚠️  Skill "${resolvedName}" is not installed.\n`));
    return;
  }

  if (!options.yes) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Remove skill "${resolvedName}"?`,
      default: false
    }]);

    if (!confirm) {
      console.log(chalk.yellow('\n⚠️  Removal cancelled.'));
      return;
    }
  }

  const spinner = ora(`Removing ${resolvedName}...`).start();

  try {
    await fs.remove(targetPath);
    spinner.succeed(chalk.green(`Removed ${resolvedName}`));
    console.log(chalk.gray(`\n🗑️  Skill "${resolvedName}" has been removed.\n`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to remove ${resolvedName}`));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function updateSkill(skillName, options = {}) {
  console.log(chalk.cyan(`\n🔄 Updating ${skillName}...\n`));

  // Remove and reinstall
  options.yes = true; // Skip confirmation for update
  await removeSkill(skillName, options);
  await installSkill(skillName, options);
}

async function listInstalled(options = {}) {
  const targetDir = getTargetDir(options.global);

  console.log(chalk.white.bold(`\nInstalled Skills (${options.global ? 'global' : 'local'}):\n`));

  if (!await fs.pathExists(targetDir)) {
    console.log(chalk.gray('  No skills installed.\n'));
    return;
  }

  const dirs = await fs.readdir(targetDir);
  const skills = [];

  for (const dir of dirs) {
    const skillPath = path.join(targetDir, dir, 'SKILL.md');
    if (await fs.pathExists(skillPath)) {
      skills.push(dir);
    }
  }

  if (skills.length === 0) {
    console.log(chalk.gray('  No skills installed.\n'));
    return;
  }

  skills.forEach(skill => {
    const info = SKILLS_REGISTRY[skill];
    if (info) {
      console.log(chalk.green(`  ✓ ${skill}`) + chalk.gray(` - ${info.description}`));
    } else {
      console.log(chalk.green(`  ✓ ${skill}`) + chalk.gray(' (custom skill)'));
    }
  });
  console.log();
}

async function listSkills(options = {}) {
  console.log(chalk.white.bold('Available Skills:\n'));

  const categories = {};

  // Group by category
  Object.entries(SKILLS_REGISTRY).forEach(([name, info]) => {
    if (options.category && info.category !== options.category) return;

    if (!categories[info.category]) {
      categories[info.category] = [];
    }
    categories[info.category].push({ name, ...info });
  });

  const categoryIcons = {
    general: '📦',
    auth: '🔐',
    frontend: '🎨'
  };

  // Display by category
  Object.entries(categories).forEach(([category, skills]) => {
    const icon = categoryIcons[category] || '📂';
    console.log(chalk.cyan.bold(`  ${icon} ${category.toUpperCase()}`));
    skills.forEach(skill => {
      console.log(chalk.white(`     • ${chalk.green(skill.name)}`));
      console.log(chalk.gray(`       ${skill.description}`));
    });
    console.log();
  });

  console.log(chalk.gray('─────────────────────────────────────────────────────'));
  console.log(chalk.white('\nUsage:'));
  console.log(chalk.gray('  npx @incmak/curated-skills add <skill>      Install to .claude/skills/'));
  console.log(chalk.gray('  npx @incmak/curated-skills add <skill> -g   Install globally'));
  console.log(chalk.gray('  npx @incmak/curated-skills remove <skill>   Remove a skill'));
  console.log(chalk.gray('  npx @incmak/curated-skills installed        List installed skills'));
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.gray('  npx @incmak/curated-skills add pptx'));
  console.log(chalk.gray('  npx @incmak/curated-skills add better-auth --global'));
  console.log();
}

async function searchSkills(query) {
  const normalizedQuery = query.toLowerCase();
  const results = [];

  Object.entries(SKILLS_REGISTRY).forEach(([name, info]) => {
    if (
      name.includes(normalizedQuery) ||
      info.description.toLowerCase().includes(normalizedQuery) ||
      info.category.includes(normalizedQuery)
    ) {
      results.push({ name, ...info });
    }
  });

  // Also check aliases
  Object.entries(SKILL_ALIASES).forEach(([alias, target]) => {
    if (alias.includes(normalizedQuery) && !results.find(r => r.name === target)) {
      const info = SKILLS_REGISTRY[target];
      if (info) {
        results.push({ name: target, ...info, matchedAlias: alias });
      }
    }
  });

  if (results.length === 0) {
    console.log(chalk.yellow(`\n⚠️  No skills found matching "${query}"\n`));
    console.log(chalk.gray('Try: npx @incmak/curated-skills list'));
    return;
  }

  console.log(chalk.white.bold(`\nFound ${results.length} skill(s) matching "${query}":\n`));

  results.forEach(skill => {
    console.log(chalk.green(`  • ${skill.name}`));
    if (skill.matchedAlias) {
      console.log(chalk.gray(`    (matched alias: ${skill.matchedAlias})`));
    }
    console.log(chalk.gray(`    ${skill.description}`));
    console.log(chalk.gray(`    Category: ${skill.category}`));
    console.log();
  });

  console.log(chalk.gray('Install with: npx @incmak/curated-skills add <skill-name>\n'));
}

module.exports = {
  installSkill,
  removeSkill,
  updateSkill,
  listSkills,
  listInstalled,
  searchSkills,
  SKILLS_REGISTRY,
  SKILL_ALIASES
};
