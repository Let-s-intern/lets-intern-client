![](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6903d22b8840b2f6f9a40fe0_8925ac952fa2cb8eb5e845b2e44f3e71b33fd695-1000x1000.svg)

#

Claude

Code

power

user

customization:

How

to

configure

hooks

Learn

how

to

configure

Claude

Code

hooks

to

automate

repetitive

tasks,

enforce

project

rules,

and

inject

dynamic

context

into

your

coding

sessions.

[](#)

[](#)

- Category

  [Claude Code](https://claude.com/blog/category/claude-code)

- Product

  Claude Code

- Date

  December 11, 2025

- Reading time

  5

  min

- Share

  [Copy link](#)

Even a smooth [Claude Code](https://www.claude.com/product/claude-code) workflow accumulates friction points over time. Every time Claude writes a file, [Prettier](https://prettier.io/) needs to run manually. Every time it runs npm test, the same permission prompt appears. Every session starts with pasting the same boilerplate project context into the first message.

The good news? [Hooks](https://code.claude.com/docs/en/hooks-guide) eliminate these friction points. They act as triggers you can configure to fire before or after certain actions, allowing you to inject custom logic, scripts, and commands directly into Claude's operations. 

This article covers advanced configuration for developers already familiar with Claude Code basics. By the end of this article, you'll understand the eight hook types, when to use each one, how to configure them, and how to debug them when things go wrong.

Let’s dive in.

## **What is a hook?**

A hook is a custom shell command that you create to execute automatically when a targeted event occurs in your Claude Code session, such as when Claude is about to write a file or when you submit a prompt. You can designate hooks for a huge range of things: intercepting actions before they execute, injecting agent context, automating approvals, or blocking operations before they happen.

Hooks are configured in your settings files using a JSON structure with event names, matchers (to filter which tools trigger the hook), and the commands to run. They execute in your local environment with your user permissions, receiving information about the triggering event via stdin and communicating back through exit codes and stdout. This gives you precise control over Claude Code behavior without modifying the tool itself.

## **Why use hooks in Claude Code?**

Hooks solve three categories of problems.

First, **they eliminate repetitive manual steps**. Instead of running your formatter after every file change, a PostToolUse hook handles it automatically. Instead of approving npm test for the hundredth time, a PermissionRequest hook auto-approves it.

Second, **hooks enforce project-specific rules automatically**. You can block dangerous commands before they execute, validate file paths before writes, or ensure naming conventions are followed. These guardrails run every time, not only when you remember to check.

Third, **hooks inject dynamic context without manual effort.** A SessionStart hook can feed Claude your current git status and TODO list. A UserPromptSubmit hook can append your sprint priorities to every request. Claude stays informed without you repeating yourself.

## **Claude Code hook types and when to use them**

Claude Code provides eight hook events that cover the full lifecycle of a session, from startup through tool execution to completion. Each fires at a specific moment, giving you precise control over when your automation runs. Choosing the right hook depends on what you want to accomplish.

**Hooks at a glance**

### **PreToolUse**

This is the most commonly used hook, firing after Claude chooses a tool to use but before the tool actually executes. Your script can inspect the planned action and approve it, block it, request user confirmation, or modify the parameters, using a matcher to filter which tools trigger this hook.

This PreToolUse hook example evaluates file writes before they execute. Claude reviews the planned action against the specified criteria and can approve, block, or flag concerns based on the prompt logic.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/validate-file-path.sh"
          }
        ]
      }
    ]
  }
}
```

When to use PreToolUse:

- Blocking dangerous Bash commands like rm -rf or force pushes
- Auto-approving safe, repetitive operations to reduce prompt fatigue
- Validating file paths before writes to prevent accidental overwrites
- Modifying tool inputs to inject project-specific defaults

### **PermissionRequest**

This hook fires when Claude would normally show a permission dialog. This hook intercepts the moment before you would see a confirmation prompt, letting your script decide whether to allow, deny, or still ask the user.

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "Bash(npm test*)",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/validate-test-command.sh"
          }
        ]
      }
    ]
  }
}
```

This example auto-approves any Bash command starting with npm test. The matcher pattern can include arguments for finer control.

When to use PermissionRequest:

- Auto-approving test commands you run dozens of times per session
- Blocking write access to production configuration files
- Allowing read operations on specific directories without prompts
- Denying any command that matches a dangerous pattern

### **PostToolUse**

Fires immediately after a tool completes successfully. Your script receives information about what happened, including the tool output, using matchers to filter which tools trigger it.

This example of PostToolUse runs Prettier on any file Claude writes or edits. The pipe syntax in the matcher means it triggers for both Write and Edit tools.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

When to use PostToolUse:

- Running Prettier, Black, or gofmt after every file write to enforce formatting
- Logging all file modifications to an audit trail
- Triggering linters and showing warnings after code changes
- Sending notifications when certain operations complete

### **PreCompact**

Fires before Claude compacts the conversation context to free up space. Compaction summarizes older parts of the conversation, which means some details get lost. This hook gives you a chance to preserve information before that happens.

This PreCompact example backs up the transcript before automatic compaction. The matcher can be "auto" or "manual" so you can distinguish between automatic compaction and user-triggered compaction events.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/backup-transcript.sh"
          }
        ]
      }
    ]
  }
}
```

When to use PreCompact:

- Backing up the full transcript to a file before summarization
- Extracting and saving important decisions or code snippets
- Logging session milestones for later review

### **SessionStart**

Fires when Claude Code starts a new session or resumes an existing one. Whatever your script outputs gets added to the conversation context, so Claude starts with that information already loaded.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git status --short && echo '---' && cat TODO.md"
          }
        ]
      }
    ]
  }
}
```

Every session starts with Claude knowing your current git status and TODO list. Stdout automatically becomes context.

When to use SessionStart:

- Feeding Claude your current git branch and recent commits
- Loading the contents of your TODO list or sprint backlog
- Injecting environment-specific configuration details

### **Stop**

Fires when Claude finishes responding and would normally wait for your next input. Your script can inspect what Claude produced and decide whether the task is truly complete.

The script can return JSON with "continue": true to make Claude continue working, which is useful for multi-step workflows:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review whether the task is complete. If all requirements are met, respond with 'complete'. If work remains, respond with 'continue' and specify what still needs to be done."
          }
        ]
      }
    ]
  }
}
```

When to use Stop:

- Forcing Claude to continue until all items in a checklist are done
- Verifying that tests pass before considering a task complete
- Triggering summary generation at the end of a session
- Checking that generated code compiles before stopping

### **SubagentStop**

This hook fires whenever a subagent created via the Task tool finishes. Works the same way as Stop, but triggers specifically when a subagent completes its action (rather than the main agent). The configuration of SubagentStop mirrors the Stop hook structure:

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate the subagent's output. Verify the task was completed correctly and the results meet quality standards. If the output is satisfactory, respond with 'accept'. If issues exist, respond with 'reject' and explain what needs to be fixed."
          }
        ]
      }
    ]
  }
}
```

When to use SubagentStop:

- Validating that subagent output meets quality criteria
- Triggering follow-up actions based on subagent results
- Logging subagent activity for debugging or auditing

### **UserPromptSubmit**

Fires when you submit a prompt, before Claude processes it. Whatever your script outputs via stdout gets added to Claude's context along with your prompt, which makes UserPromptSubmit useful for dynamically injecting information that Claude should consider.

In this example, every time you submit a prompt, Claude receives the contents of your sprint context file. This keeps Claude informed about current priorities without you needing to restate them.

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat ./current-sprint-context.md"
          }
        ]
      }
    ]
  }
}
```

When to use UserPromptSubmit:

- Injecting current sprint context or project priorities with every prompt
- Validating prompts before they reach Claude
- Blocking certain types of requests based on content
- Adding dynamic context like recent error logs or test results

## **Configuration and file locations**

Hooks live in JSON settings files at three levels. Project-level hooks go in .claude/settings.json within your repository, making them shareable with your team. User-level hooks go in ~/.claude/settings.json and apply across all your projects. Local project hooks go in .claude/settings.local.json for personal configuration you don't want to commit.

Project-level settings take precedence over user-level settings. There are also enterprise-managed policy settings available for organizational control. For complete details, see the Claude Code settings information.

**Pro tip:** This is the same file where you can set granular permissions for Claude actions, at the project, user, or local levels. For example, you can explicitly allow Claude to read all files in a directory so that you don't have to approve it every time, or block any modification of sensitive files.

## **Matcher syntax**

Matchers are how you filter which tools can trigger your hook. They only apply to PreToolUse, PostToolUse, and PermissionRequest hooks.

Simple string matching works exactly as you'd expect: "Write" matches only the Write tool.

For example:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

The pipe syntax lets you match multiple tools: "Write|Edit" triggers for either, whereas wildcards match everything: "\*" or an empty string matches all tools.

**Note:** Matchers are case sensitive, so "bash" won't be matched to the Bash tool.

For finer control, argument patterns like "Bash(npm test\*)" can match specific command arguments. MCP tool patterns follow the format "mcp\_\_memory\_\_.\*" for Model Context Protocol tools.

## **Input, output, and structured responses**

### **What hooks receive**

All hooks receive JSON via stdin containing session information and event-specific data. Common fields include: session_id, transcript_path, cwd, permission_mode, and hook_event_name.

Additionally, tool-related hooks also receive tool_name and tool_input. This data lets your scripts make informed decisions about how to respond.

### **How hooks respond**

Exit codes determine the basic outcome. Exit code 0 means success, and stdout either gets processed for JSON or added to context. Exit code 2 means a blocking error: stderr becomes the error message and the action gets prevented.

Other exit codes indicate non-blocking errors, with stderr shown in verbose mode.

Beyond exit codes, hooks can return structured JSON for more control. Fields include: decision (approve, block, allow, or deny), reason (explanation shown to Claude), continue (for Stop hooks to force continuation), and updatedInput (to modify tool parameters before execution).

## **Environment and execution**

Hooks have access to environment variables, including: CLAUDE_PROJECT_DIR for the project root path, CLAUDE_CODE_REMOTE which is true for web environments, and CLAUDE_ENV_FILE for SessionStart hooks to persist variables. Standard environment variables from your shell are also accessible.

Also of note: Hooks have a 60-second default timeout, configurable per hook. When multiple hooks match an event, they run in parallel. Identical commands are automatically deduplicated.

## **Security considerations**

Hooks execute arbitrary shell commands with your user permissions. Claude Code includes a safeguard: direct edits to hook configuration files require review in the /hooks menu before taking effect. This prevents malicious code from silently adding hooks to your configuration.

However, if you configure and approve hooks, they will execute at your permission levels.

**Pro tip:** Before you run any commands in an environment, consider the risks. If you're going to run commands with hooks, consider good practices like: validating and sanitizing inputs from stdin, quoting shell variables to prevent injection, using absolute paths for scripts, and avoiding processing sensitive files like .env or credentials.

## **Debugging and testing**

Claude Code logs everything to transcript files, which provides visibility into tool calls and responses without any setup. Every hook receives a transcript_path field pointing to a JSONL file containing the full session history. You can use a SessionStart hook to log where each transcript lives:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"Session: \" + .transcript_path' >> ~/.claude/sessions.log"
          }
        ]
      }
    ]
  }
}
```

Then tail that transcript to watch Claude work in real time: `tail -f /path/to/transcript.jsonl | jq` .

### **Hook-specific debugging**

For hook-specific debugging, add logging to your hook scripts. The transcript files will show what Claude did, but not why your hook took the action to approve or block something.

With a little extra effort you can add a small bash script that will wrap your tools and log the additional information. For example, log-wrapper.sh:

```bash
#!/bin/bash
LOG=~/.claude/hooks.log
INPUT=$(cat)

TOOL=$(echo "$INPUT" |
 jq -r '.tool_name // "n/a"')
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "n/a"')

echo "=== $(date) | $EVENT | $TOOL ===" >> "$LOG"

echo "$INPUT" | "$1"
CODE=$?

echo "Exit: $CODE" >> "$LOG"
exit $CODE
```

This small wrapper script captures stdin into a variable, logs the timestamp and tool name, then pipes the input to your actual tool.

Once you have log-wrapper.sh written, you would then prepend it to the tool call in the hook:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "log-wrapper.sh your-tool-command.py"
          }
        ]
      }
    ]
  }
}
```

**Pro tip:** For more debugging tips, check out the Claude Code debugging documentation.

## **Building your own hooks**

Start with one simple hook that solves an actual friction point in your workflow. The PostToolUse formatter hook is a good first choice since the feedback is immediate and visible. Once that works, expand based on what you learn.

For complete reference documentation including all available fields and advanced patterns, see the official hooks documentation.

Hooks let you shape Claude Code to match your workflow rather than adapting your workflow to the tool. When you invest in configuring hooks, it pays off every session.

_Start using hooks to customize your_ [_Claude Code_](https://www.claude.com/product/claude-code) _workflows today._

No items found.

[Prev](#)Prev

0/5

[Next](#)Next

Get Claude Code

curl -fsSL https://claude.ai/install.sh | bash

Copy command to clipboard

irm https://claude.ai/install.ps1 | iex

Copy command to clipboard

Or read the [documentation](https://code.claude.com/docs/en/overview)

Try Claude Code

[Try Claude Code](https://claude.ai/redirect/claudedotcom.v1.963c3b6a-2202-41ac-949e-b42df9205c3d/code)Try Claude Code

Developer docs

[Developer docs](https://code.claude.com/docs/en/overview)Developer docs

eBook

[](#)

![](https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6889473610b50328dbb70b58_placeholder.svg)

![](https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6889473610b50328dbb70b58_placeholder.svg)![](https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6889473610b50328dbb70b58_placeholder.svg)

FAQ

No items found.

[](#)

## Related posts

Explore more product news and best practices for teams building with Claude.

![](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6903d2287f90c57df4c9dd97_c1ef4c0b6882dfe985555b52999d370ea88a3c50-1000x1000.svg)

Mar 19, 2026

### Product management on the AI exponential

Claude Code

[Product management on the AI exponential](#) Product management on the AI exponential

[Product management on the AI exponential](/blog/product-management-on-the-ai-exponential) Product management on the AI exponential

![](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6903d225c16d1b0cc3b1ded5_6457c34fbcb012acf0f27f15a6006f700d0f50de-1000x1000.svg)

Mar 24, 2026

### Auto mode for Claude Code

Claude Code

[Auto mode for Claude Code](#)Auto mode for Claude Code

[Auto mode for Claude Code](/blog/auto-mode)Auto mode for Claude Code

![](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6903d22b2403b092e0358cbd_5f455d24ea80569b34eb4347f06152d8a5508722-1000x1000.svg)

Mar 18, 2026

### Code with Claude comes to San Francisco, London, and Tokyo

Claude Code

[Code with Claude comes to San Francisco, London, and Tokyo](#)Code with Claude comes to San Francisco, London, and Tokyo

[Code with Claude comes to San Francisco, London, and Tokyo](/blog/code-with-claude-san-francisco-london-tokyo)Code with Claude comes to San Francisco, London, and Tokyo

![](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/692f76874e94e489958af8ba_Object-CodeMagnifier.svg)

Mar 9, 2026

### Bringing Code Review to Claude Code

Claude Code

[Bringing Code Review to Claude Code](#)Bringing Code Review to Claude Code

[Bringing Code Review to Claude Code](/blog/code-review)Bringing Code Review to Claude Code

## Transform how your organization operates with Claude

See pricing

[See pricing](https://claude.com/pricing#api)See pricing

Contact sales

[Contact sales](https://claude.com/contact-sales)Contact sales

Get the developer newsletter

Product updates, how-tos, community spotlights, and more. Delivered monthly to your inbox.

[Subscribe](#)Subscribe

Please provide your email address if you'd like to receive our monthly developer newsletter. You can unsubscribe at any time.

Thank you! You’re subscribed.

Sorry, there was a problem with your submission, please try again later.
