#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get changed files from PR
 */
async function getChangedFiles() {
  try {
    // Determine base branch (from env var or default to main)
    const baseBranch = process.env.BASE_BRANCH || 'main';

    console.log(`Comparing against base branch: ${baseBranch}`);

    // Get changed files between base and head
    const { stdout } = await execAsync(
      `git diff --name-only origin/${baseBranch}...HEAD`
    );

    const files = stdout
      .trim()
      .split('\n')
      .filter(file => file.match(/\.(ts|tsx|js|jsx)$/))
      .filter(file => !file.includes('node_modules'))
      .filter(file => !file.includes('.next'))
      .filter(Boolean);

    console.log(`Found ${files.length} changed files:`);
    files.forEach(file => console.log(`  - ${file}`));

    return files;
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    console.error('Make sure you have fetched the base branch:');
    console.error(`  git fetch origin ${process.env.BASE_BRANCH || 'main'}`);
    return [];
  }
}

/**
 * Run dependency-cruiser to get dependency graph
 */
async function getDependencyGraph() {
  try {
    console.log('\nGenerating dependency graph...');
    const { stdout } = await execAsync(
      'npx depcruise --output-type json --config .dependency-cruiser.cjs src'
    );

    return JSON.parse(stdout);
  } catch (error) {
    console.error('Error generating dependency graph:', error.message);
    throw error;
  }
}

/**
 * Find files that depend on the changed files (impact analysis)
 */
function findImpactedFiles(changedFiles, dependencyGraph) {
  const impactedFiles = new Set();
  const normalizedChangedFiles = changedFiles.map(file =>
    path.resolve(process.cwd(), file)
  );

  // Build reverse dependency map
  const reverseDeps = new Map();

  dependencyGraph.modules.forEach(module => {
    module.dependencies.forEach(dep => {
      const depSource = dep.resolved;
      if (!reverseDeps.has(depSource)) {
        reverseDeps.set(depSource, new Set());
      }
      reverseDeps.get(depSource).add(module.source);
    });
  });

  // Find all files impacted by changes (BFS)
  const queue = [...normalizedChangedFiles];
  const visited = new Set(normalizedChangedFiles);

  while (queue.length > 0) {
    const current = queue.shift();

    if (reverseDeps.has(current)) {
      reverseDeps.get(current).forEach(dependent => {
        if (!visited.has(dependent)) {
          visited.add(dependent);
          queue.push(dependent);
          impactedFiles.add(dependent);
        }
      });
    }
  }

  return Array.from(impactedFiles);
}

/**
 * Generate Mermaid diagram
 */
function generateMermaidDiagram(changedFiles, impactedFiles, dependencyGraph) {
  const allFiles = [...changedFiles, ...impactedFiles];
  const normalizedFiles = allFiles.map(file =>
    path.resolve(process.cwd(), file)
  );

  // Create file to ID mapping
  const fileToId = new Map();
  let idCounter = 0;

  const getFileId = (file) => {
    if (!fileToId.has(file)) {
      fileToId.set(file, `file${idCounter++}`);
    }
    return fileToId.get(file);
  };

  const getFileLabel = (file) => {
    return file.replace(process.cwd() + '/', '').replace(/\\/g, '/');
  };

  let mermaid = 'graph TD\n';

  // Add nodes
  changedFiles.forEach(file => {
    const fullPath = path.resolve(process.cwd(), file);
    const id = getFileId(fullPath);
    const label = getFileLabel(fullPath);
    mermaid += `  ${id}["${label}"]:::changed\n`;
  });

  impactedFiles.forEach(file => {
    const id = getFileId(file);
    const label = getFileLabel(file);
    mermaid += `  ${id}["${label}"]:::impacted\n`;
  });

  // Add edges
  const addedEdges = new Set();

  dependencyGraph.modules.forEach(module => {
    const moduleFullPath = module.source;

    if (!normalizedFiles.includes(moduleFullPath)) return;

    module.dependencies.forEach(dep => {
      const depFullPath = dep.resolved;

      if (!normalizedFiles.includes(depFullPath)) return;

      const fromId = getFileId(depFullPath);
      const toId = getFileId(moduleFullPath);
      const edgeKey = `${fromId}->${toId}`;

      if (!addedEdges.has(edgeKey)) {
        mermaid += `  ${fromId} --> ${toId}\n`;
        addedEdges.add(edgeKey);
      }
    });
  });

  // Add styling
  mermaid += '\n  classDef changed fill:#ff9999,stroke:#ff0000,stroke-width:2px\n';
  mermaid += '  classDef impacted fill:#ffeb99,stroke:#ffa500,stroke-width:2px\n';

  return mermaid;
}

/**
 * Main function
 */
async function main() {
  console.log('=== PR Impact Visualization ===\n');

  // Get changed files
  const changedFiles = await getChangedFiles();

  if (changedFiles.length === 0) {
    console.log('\nNo changed files found.');
    return;
  }

  // Get dependency graph
  const dependencyGraph = await getDependencyGraph();

  // Find impacted files
  const impactedFiles = findImpactedFiles(changedFiles, dependencyGraph);

  console.log(`\nFound ${impactedFiles.length} impacted files:`);
  impactedFiles.slice(0, 10).forEach(file => {
    const relativePath = file.replace(process.cwd() + '/', '');
    console.log(`  - ${relativePath}`);
  });

  if (impactedFiles.length > 10) {
    console.log(`  ... and ${impactedFiles.length - 10} more`);
  }

  // Generate Mermaid diagram
  const mermaidDiagram = generateMermaidDiagram(
    changedFiles,
    impactedFiles,
    dependencyGraph
  );

  // Save to file
  const outputPath = path.join(process.cwd(), 'pr-impact.md');
  const output = `# PR Impact Visualization

## Summary
- **Changed files**: ${changedFiles.length}
- **Impacted files**: ${impactedFiles.length}
- **Total affected files**: ${changedFiles.length + impactedFiles.length}

## Impact Graph

\`\`\`mermaid
${mermaidDiagram}
\`\`\`

### Legend
- 🔴 Red nodes: Changed files in this PR
- 🟡 Yellow nodes: Files impacted by the changes
- Arrows show dependency direction (A → B means B depends on A)

## Changed Files
${changedFiles.map(file => `- \`${file}\``).join('\n')}

${impactedFiles.length > 0 ? `## Impacted Files
${impactedFiles.map(file => {
  const relativePath = file.replace(process.cwd() + '/', '');
  return `- \`${relativePath}\``;
}).join('\n')}` : ''}
`;

  await fs.writeFile(outputPath, output);
  console.log(`\nImpact visualization saved to: ${outputPath}`);

  // Output for GitHub Actions
  const summary = `### PR Impact Analysis\n- **Changed files**: ${changedFiles.length}\n- **Impacted files**: ${impactedFiles.length}\n- **Total affected files**: ${changedFiles.length + impactedFiles.length}`;
  console.log(`\n${summary}`);

  // Set output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    await fs.appendFile(
      process.env.GITHUB_OUTPUT,
      `impacted_count=${impactedFiles.length}\n`
    );
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
