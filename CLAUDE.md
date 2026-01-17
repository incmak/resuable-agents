# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a collection of **reusable skills** for AI agents. Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized workflows, domain expertise, and bundled resources. Think of them as "onboarding guides" that transform Claude from a general-purpose agent into a specialized assistant.

## Directory Structure

```tree
resuable-agents/
├── frontend/
│   ├── react-nextjs/skills/       # React/Next.js specific skills
│   │   ├── bulletproof-react/     # Feature-based architecture patterns
│   │   └── vercel-react-best-practices/  # Performance optimization (45 rules)
│   └── skills/
│       └── web-design-guidelines/ # Web Interface Guidelines compliance
└── general/
    ├── doc-coauthoring/           # Structured document co-authoring workflow
    ├── internal-comms/            # Internal communications templates
    └── skill-creator/             # Meta-skill for creating new skills
        └── scripts/               # Utility scripts for skill management
```

## Skill Anatomy

Every skill follows this structure:

```tree
skill-name/
├── SKILL.md           (required) Core instructions with YAML frontmatter
├── scripts/           (optional) Executable code (Python/Bash)
├── references/        (optional) Documentation loaded on-demand
└── assets/            (optional) Files used in output (templates, icons)
```

### SKILL.md Requirements

- **Frontmatter**: Must include `name` and `description` fields
- **Description**: Primary trigger mechanism - include what the skill does AND when to use it
- **Body**: Only loaded after skill triggers; keep under 500 lines

## Key Commands

### Creating a New Skill

```bash
python general/skill-creator/scripts/init_skill.py <skill-name> --path <output-directory>
```

### Validating a Skill

```bash
python general/skill-creator/scripts/quick_validate.py <path/to/skill-folder>
```

### Packaging a Skill

```bash
python general/skill-creator/scripts/package_skill.py <path/to/skill-folder> [output-directory]
```

Creates a `.skill` file (zip archive) for distribution.

## Core Principles

1. **Context is precious** - Only include information Claude doesn't already have. Challenge each piece: "Does this justify its token cost?"

2. **Progressive disclosure** - Metadata always in context (~100 words), SKILL.md body on trigger (<5k words), references loaded as-needed

3. **Degrees of freedom** - Match specificity to task fragility: high freedom for flexible tasks, low freedom for error-prone operations

4. **No extraneous files** - Skills should NOT contain README.md, CHANGELOG.md, or auxiliary documentation. Only files needed for execution.

## Reference Documentation Patterns

When skills support multiple variants/frameworks:

- Keep core workflow in SKILL.md
- Move variant-specific details to `references/` files
- Reference files should be one level deep from SKILL.md
- Files >100 lines should include a table of contents
