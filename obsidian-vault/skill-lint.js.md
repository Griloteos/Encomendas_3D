---
source_file: ".claude/skills/agent-skills/scripts/lib/skill-lint.js"
type: "code"
community: "skill-lint.js"
location: "L1"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/skill-lintjs
---

# skill-lint.js

## Connections
- [[DESCRIPTION_TRIGGER_NEGATE_ALL]] - `contains` [EXTRACTED]
- [[REQUIRED_SECTIONS]] - `contains` [EXTRACTED]
- [[SECTION_EXEMPT_SKILLS]] - `contains` [EXTRACTED]
- [[SKILL_REF_PATTERNS]] - `contains` [EXTRACTED]
- [[SPEC_FRONTMATTER_KEYS]] - `contains` [EXTRACTED]
- [[extractSkillReferences()]] - `indirect_call` [INFERRED]
- [[frontmatterYamlErrors()]] - `indirect_call` [INFERRED]
- [[fs]] - `contains` [EXTRACTED]
- [[isEffectivelyEmpty()]] - `contains` [EXTRACTED]
- [[lintPersona()]] - `indirect_call` [INFERRED]
- [[lintPersonaContent()]] - `indirect_call` [INFERRED]
- [[lintSkill()]] - `indirect_call` [INFERRED]
- [[lintSkillContent()]] - `indirect_call` [INFERRED]
- [[lintSkillLayout()]] - `indirect_call` [INFERRED]
- [[parseFrontmatter()]] - `indirect_call` [INFERRED]
- [[path]] - `contains` [EXTRACTED]
- [[ref_fs_2]] - `imports_from` [EXTRACTED]
- [[ref_path_2]] - `imports_from` [EXTRACTED]
- [[run-evals.js_2]] - `imports_from` [EXTRACTED]
- [[skill-lint-test.js]] - `imports_from` [EXTRACTED]
- [[stripFencedCodeBlocks()]] - `indirect_call` [INFERRED]
- [[topLevelFrontmatterKeys()]] - `indirect_call` [INFERRED]
- [[validate-reference-links.js]] - `imports_from` [EXTRACTED]
- [[validate-skills.js]] - `imports_from` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/skill-lintjs