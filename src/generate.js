import { execa } from "execa";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function checkGitRepo() {
    try {
        await execa("git", ["rev-parse", "--git-dir"]);
    } catch (error) {
        throw new Error("Not a git repository. Please run this command in a git repository.");
    }
}

export async function checkStagedChanges() {
    try {
        const { stdout } = await execa("git", ["diff", "--cached", "--name-only"]);
        return stdout.trim().length > 0;
    } catch (error) {
        return false;
    }
}

export async function generateCommitMessage() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is required");
    }

    try {
        // Get staged diff
        const { stdout: diff } = await execa("git", ["diff", "--cached"]);

        if (!diff.trim()) {
            throw new Error("No staged changes found");
        }

        // Limit diff size to avoid token limits
        const maxDiffLength = 8000;
        const truncatedDiff = diff.length > maxDiffLength
            ? diff.substring(0, maxDiffLength) + "\n\n... (diff truncated)"
            : diff;

        // Generate commit message with OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert git commit message generator. Analyze the git diff and create a concise, clear commit message following Conventional Commits format.

Rules:
- Use format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build
- Keep under 50 characters for the subject line
- Be specific about what changed
- Use imperative mood (e.g., "add" not "added")
- No period at the end

Examples:
- feat(auth): add OAuth login support
- fix(api): handle null user validation
- docs(readme): update installation guide
- refactor(utils): simplify date formatting`
                },
                {
                    role: "user",
                    content: `Generate a commit message for these changes:\n\n${truncatedDiff}`
                }
            ],
            max_tokens: 100,
            temperature: 0.7
        });

        const message = completion.choices[0].message.content.trim();

        // Remove quotes if AI added them
        return message.replace(/^["']|["']$/g, '');

    } catch (error) {
        if (error.code === 'insufficient_quota') {
            throw new Error("OpenAI API quota exceeded. Please check your billing.");
        }
        if (error.code === 'invalid_api_key') {
            throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.");
        }
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}

export async function commitChanges(message) {
    try {
        await execa("git", ["commit", "-m", message]);
    } catch (error) {
        throw new Error(`Failed to commit changes: ${error.message}`);
    }
}