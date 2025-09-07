#!/usr/bin/env node

import { generateCommitMessage, commitChanges, checkGitRepo, checkStagedChanges } from "../src/generate.js";
import chalk from "chalk";
import ora from "ora";

const args = process.argv.slice(2);
const autoCommit = args.includes('--commit') || args.includes('-c');
const help = args.includes('--help') || args.includes('-h');

if (help) {
    console.log(`
${chalk.bold('commit-gpt')} - AI-powered commit message generator

${chalk.bold('Usage:')}
  npx commit-gpt [options]

${chalk.bold('Options:')}
  -c, --commit    Auto-commit with the generated message
  -h, --help      Show this help message

${chalk.bold('Examples:')}
  npx commit-gpt                    # Generate commit message
  npx commit-gpt --commit           # Generate and auto-commit
  git add . && npx commit-gpt -c    # Stage changes and auto-commit

${chalk.bold('Requirements:')}
  - Git repository with staged changes
  - OPENAI_API_KEY environment variable

${chalk.bold('Environment:')}
  Set your OpenAI API key:
  export OPENAI_API_KEY=your_api_key_here
`);
    process.exit(0);
}

(async () => {
    try {
        // Check if we're in a git repository
        const spinner = ora('Checking git repository...').start();
        await checkGitRepo();
        spinner.succeed('Git repository found');

        // Check if there are staged changes
        spinner.start('Checking staged changes...');
        const hasStagedChanges = await checkStagedChanges();

        if (!hasStagedChanges) {
            spinner.fail('No staged changes found');
            console.log(chalk.yellow('\n💡 Tip: Stage your changes first with ') + chalk.bold('git add .'));
            process.exit(1);
        }
        spinner.succeed('Staged changes found');

        // Generate commit message
        spinner.start('Generating commit message...');
        const message = await generateCommitMessage();
        spinner.succeed('Commit message generated');

        console.log(chalk.bold('\n🚀 Generated commit message:'));
        console.log(chalk.green(`"${message}"`));

        if (autoCommit) {
            console.log(chalk.yellow('\n⚡ Auto-committing...'));
            await commitChanges(message);
            console.log(chalk.green('✅ Changes committed successfully!'));
        } else {
            console.log(chalk.cyan('\n💡 To commit with this message, run:'));
            console.log(chalk.bold(`git commit -m "${message}"`));
            console.log(chalk.dim('\nOr use --commit flag to auto-commit next time'));
        }

    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);

        if (error.message.includes('API key')) {
            console.log(chalk.yellow('\n💡 Set your OpenAI API key:'));
            console.log(chalk.bold('export OPENAI_API_KEY=your_api_key_here'));
        }

        process.exit(1);
    }
})();