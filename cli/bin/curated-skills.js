#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { installSkill, removeSkill, updateSkill, listSkills, listInstalled, searchSkills } = require('../src/index');
const pkg = require('../../package.json');

function showBanner() {
  console.log(chalk.cyan('═══════════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('  🎯 Curated Skills for Claude Code'));
  console.log(chalk.gray(`                                       v${pkg.version}`));
  console.log(chalk.cyan('═══════════════════════════════════════════════════\n'));
}

program
  .name('curated-skills')
  .description('Install curated AI agent skills for Claude Code')
  .version(pkg.version);

program
  .command('add <skill>')
  .alias('install')
  .alias('i')
  .description('Install a skill (e.g., pptx, better-auth)')
  .option('-g, --global', 'Install globally to ~/.claude/skills/')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (skill, options) => {
    showBanner();
    await installSkill(skill, options);
  });

program
  .command('remove <skill>')
  .alias('rm')
  .alias('uninstall')
  .description('Remove an installed skill')
  .option('-g, --global', 'Remove from ~/.claude/skills/')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (skill, options) => {
    showBanner();
    await removeSkill(skill, options);
  });

program
  .command('update <skill>')
  .alias('up')
  .description('Update a skill to the latest version')
  .option('-g, --global', 'Update in ~/.claude/skills/')
  .action(async (skill, options) => {
    showBanner();
    await updateSkill(skill, options);
  });

program
  .command('list')
  .alias('ls')
  .description('List all available skills')
  .option('-c, --category <category>', 'Filter by category (general, auth, frontend)')
  .action(async (options) => {
    showBanner();
    await listSkills(options);
  });

program
  .command('installed')
  .description('List installed skills')
  .option('-g, --global', 'List globally installed skills')
  .action(async (options) => {
    showBanner();
    await listInstalled(options);
  });

program
  .command('search <query>')
  .description('Search for skills')
  .action(async (query) => {
    showBanner();
    await searchSkills(query);
  });

// Default action when no command specified
program
  .action(() => {
    showBanner();
    listSkills({});
  });

program.parse(process.argv);
