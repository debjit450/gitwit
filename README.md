# gitwit 🤖

> AI-powered commit message generator that creates conventional commit messages from your staged git changes

[![npm version](https://badge.fury.io/js/gitwit.svg)](https://www.npmjs.com/package/gitwit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **One command**: `npx gitwit`
- 🎯 **Smart analysis**: Reads your `git diff --cached` and understands what changed
- 📝 **Conventional commits**: Generates messages following [Conventional Commits](https://conventionalcommits.org/) standard
- ⚡ **Auto-commit**: Optional `--commit` flag to automatically commit with the generated message
- 🎨 **Beautiful output**: Colorful, informative CLI interface
- 🔒 **Secure**: Uses your OpenAI API key, no data stored

## Installation

### Global Installation (Recommended)
```bash
npm install -g gitwit
```

### One-time Usage
```bash
npx gitwit
```

## Setup

You need an OpenAI API key to use this tool:

1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Set it as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Or add it to your shell profile (`.bashrc`, `.zshrc`, etc.):
```bash
echo 'export OPENAI_API_KEY=your_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

## Usage

### Basic Usage

1. Stage your changes:
```bash
git add .
```

2. Generate commit message:
```bash
gitwit
```

Example output:
```
✅ Git repository found
✅ Staged changes found  
✅ Commit message generated

🚀 Generated commit message:
"feat(auth): add OAuth login support"

💡 To commit with this message, run:
git commit -m "feat(auth): add OAuth login support"
```

### Auto-commit

Generate and automatically commit in one step:

```bash
git add .
gitwit --commit
```

Or use the short flag:
```bash
git add . && gitwit -c
```

### Complete Workflow

```bash
# Make your changes
echo "console.log('hello world')" > hello.js

# Stage changes  
git add hello.js

# Generate and commit automatically
gitwit --commit
```

## Command Line Options

```
Usage: gitwit [options]

Options:
  -c, --commit    Auto-commit with the generated message
  -h, --help      Show help message

Examples:
  gitwit                    # Generate commit message only
  gitwit --commit           # Generate and auto-commit
  git add . && gitwit -c    # Stage changes and auto-commit
```

## Example Generated Messages

gitwit follows [Conventional Commits](https://conventionalcommits.org/) format:

- `feat(api): add user authentication endpoint`
- `fix(ui): resolve button alignment issue`  
- `docs(readme): update installation instructions`
- `refactor(utils): simplify date formatting logic`
- `test(auth): add login validation tests`
- `chore(deps): update dependencies to latest`

## Requirements

- **Node.js**: Version 16 or higher
- **Git**: Must be run in a git repository
- **OpenAI API Key**: Required for AI-powered generation
- **Staged Changes**: Run `git add` before using gitwit

## Error Handling

gitwit provides helpful error messages:

- ❌ **Not in git repo**: "Not a git repository"
- ❌ **No staged changes**: "No staged changes found" + helpful tip
- ❌ **Missing API key**: Instructions to set `OPENAI_API_KEY`
- ❌ **API issues**: Clear error messages for quota/auth problems

## Configuration

### API Model

By default, gitwit uses `gpt-4o-mini` for fast, cost-effective generation. The model is optimized for:
- Understanding code diffs
- Following conventional commit standards  
- Generating concise, descriptive messages

### Diff Size Limits

Large diffs are automatically truncated to stay within API token limits while preserving the most important changes.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT © [Debjit Dey]

## Changelog

### v1.0.2
- Initial release
- Basic commit message generation
- Auto-commit functionality
- Conventional commits support
- Error handling and validation

---

**Made with ❤️**

If you find this tool useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📢 Sharing with your team