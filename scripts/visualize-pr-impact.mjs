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

    // Write to temp file to avoid maxBuffer issues
    const tempFile = path.join(process.cwd(), '.dependency-graph.json');
    await execAsync(
      `npx depcruise --output-type json --config .dependency-cruiser.cjs src > ${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 } // 50MB buffer
    );

    const content = await fs.readFile(tempFile, 'utf-8');
    await fs.unlink(tempFile); // Clean up temp file

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating dependency graph:', error.message);
    throw error;
  }
}

/**
 * Find files that depend on the changed files (impact analysis)
 */
function findImpactedFiles(changedFiles, dependencyGraph, maxDepth = 3) {
  const impactedFiles = new Set();

  // Build reverse dependency map (use relative paths like dependency-cruiser)
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

  // Find all files impacted by changes (BFS with depth limit)
  const queue = changedFiles.map(file => ({ file, depth: 0 }));
  const visited = new Set(changedFiles);

  while (queue.length > 0) {
    const { file: current, depth } = queue.shift();

    // Stop if we've reached max depth
    if (depth >= maxDepth) continue;

    if (reverseDeps.has(current)) {
      reverseDeps.get(current).forEach(dependent => {
        if (!visited.has(dependent)) {
          visited.add(dependent);
          queue.push({ file: dependent, depth: depth + 1 });
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
  const allFilesSet = new Set(allFiles);

  // Create file to ID mapping
  const fileToId = new Map();
  let idCounter = 0;

  const getFileId = (file) => {
    if (!fileToId.has(file)) {
      fileToId.set(file, `file${idCounter++}`);
    }
    return fileToId.get(file);
  };

  let mermaid = 'graph TD\n';

  // Add nodes
  changedFiles.forEach(file => {
    const id = getFileId(file);
    mermaid += `  ${id}["${file}"]:::changed\n`;
  });

  impactedFiles.forEach(file => {
    const id = getFileId(file);
    mermaid += `  ${id}["${file}"]:::impacted\n`;
  });

  // Add edges
  const addedEdges = new Set();

  dependencyGraph.modules.forEach(module => {
    const moduleSource = module.source;

    if (!allFilesSet.has(moduleSource)) return;

    module.dependencies.forEach(dep => {
      const depSource = dep.resolved;

      if (!allFilesSet.has(depSource)) return;

      const fromId = getFileId(depSource);
      const toId = getFileId(moduleSource);
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
    console.log(`  - ${file}`);
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
- **Analysis depth**: 3 levels (direct + 2 indirect dependencies)

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
${impactedFiles.map(file => `- \`${file}\``).join('\n')}` : ''}
`;

  await fs.writeFile(outputPath, output);
  console.log(`\nImpact visualization saved to: ${outputPath}`);

  // Generate Mermaid diagram image
  try {
    console.log('\nGenerating diagram image...');
    const mermaidFilePath = path.join(process.cwd(), '.pr-impact-diagram.mmd');
    await fs.writeFile(mermaidFilePath, mermaidDiagram);

    const imagePath = path.join(process.cwd(), 'pr-impact-diagram.png');

    // Try to generate image (may fail if mermaid-cli not installed properly)
    await execAsync(
      `npx -y @mermaid-js/mermaid-cli@10.6.1 -i ${mermaidFilePath} -o ${imagePath}`,
      { timeout: 45000 }
    );

    console.log(`Diagram image saved to: ${imagePath}`);

    // Clean up temp mermaid file
    await fs.unlink(mermaidFilePath);
  } catch (error) {
    console.log('\nNote: Could not generate diagram image.');
    console.log('You can view the diagram in GitHub PR comment or pr-impact.md file.');

    // Clean up temp file if it exists
    try {
      await fs.unlink(path.join(process.cwd(), '.pr-impact-diagram.mmd'));
    } catch {}
  }

  // Output for GitHub Actions
  const summary = `### PR Impact Analysis\n- **Changed files**: ${changedFiles.length}\n- **Impacted files**: ${impactedFiles.length}\n- **Total affected files**: ${changedFiles.length + impactedFiles.length}\n- **Analysis depth**: 3 levels`;
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
