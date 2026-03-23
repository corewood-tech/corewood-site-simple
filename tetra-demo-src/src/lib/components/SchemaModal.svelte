<!-- Schema viewer modal with copy-to-clipboard -->
<script lang="ts">
  import { graphClient } from '$lib/api/client';

  let { visible = false, onclose, protocol = 'dql' }: {
    visible: boolean;
    onclose: () => void;
    protocol: 'dql' | 'cypher';
  } = $props();

  let schemaMarkdown = $state('');
  let loading = $state(false);
  let error = $state('');
  let copied = $state(false);
  let collapsed = $state(false);
  let modalEl = $state<HTMLDivElement>(undefined!);

  // Dragging
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let posTop: number | null = $state(null);
  let posLeft: number | null = $state(null);

  function startDrag(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('.modal-btn')) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    if (posTop === null && modalEl) {
      const rect = modalEl.getBoundingClientRect();
      posTop = rect.top;
      posLeft = rect.left;
    }
    const startX = posLeft!;
    const startY = posTop!;
    function onDrag(ev: MouseEvent) {
      posLeft = startX + (ev.clientX - dragStartX);
      posTop = startY + (ev.clientY - dragStartY);
    }
    function stopDrag() {
      dragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    }
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  function getStyle() {
    if (posTop !== null && posLeft !== null) {
      return `top:${posTop}px; left:${posLeft}px;`;
    }
    return 'top: 60px; right: 24px;';
  }

  interface SchemaPredicate {
    predicate: string;
    type: string;
    index?: boolean;
    tokenizer?: string[];
    list?: boolean;
    count?: boolean;
    reverse?: boolean;
    upsert?: boolean;
    lang?: boolean;
  }

  interface SchemaType {
    name: string;
    fields?: { name: string }[];
  }

  function formatSchema(data: any): string {
    const lines: string[] = [];
    const predicates: SchemaPredicate[] = data?.data?.schema || [];
    const types: SchemaType[] = data?.data?.types || [];

    const userPreds = predicates.filter(p => !p.predicate.startsWith('dgraph.'))
      .sort((a, b) => a.predicate.localeCompare(b.predicate));
    const userTypes = (types || []).filter((t: SchemaType) => !t.name.startsWith('dgraph.'))
      .sort((a: SchemaType, b: SchemaType) => a.name.localeCompare(b.name));

    // Summary
    lines.push(`# Database Schema`);
    lines.push('');
    lines.push(`> ${userPreds.length} predicates, ${userTypes.length} types`);
    lines.push('');

    // Predicates table
    if (userPreds.length > 0) {
      lines.push('## Predicates');
      lines.push('');
      lines.push('| Predicate | Type | Directives |');
      lines.push('|-----------|------|------------|');
      for (const p of userPreds) {
        const typeStr = p.list ? `[${p.type}]` : p.type;
        const directives: string[] = [];
        if (p.index && p.tokenizer?.length) directives.push(`@index(${p.tokenizer.join(', ')})`);
        else if (p.index) directives.push('@index');
        if (p.count) directives.push('@count');
        if (p.reverse) directives.push('@reverse');
        if (p.upsert) directives.push('@upsert');
        if (p.lang) directives.push('@lang');
        lines.push(`| \`${p.predicate}\` | \`${typeStr}\` | ${directives.map(d => '`' + d + '`').join(' ') || '--'} |`);
      }
    }

    // Types
    if (userTypes.length > 0) {
      lines.push('');
      lines.push('## Types');
      for (const t of userTypes) {
        lines.push('');
        lines.push(`### ${t.name}`);
        if (t.fields && t.fields.length > 0) {
          const userFields = t.fields.filter((f: {name: string}) => !f.name.startsWith('dgraph.'));
          if (userFields.length > 0) {
            lines.push('');
            for (const f of userFields) {
              // Find predicate info for this field
              const pred = predicates.find(p => p.predicate === f.name);
              const typeStr = pred ? (pred.list ? `[${pred.type}]` : pred.type) : '';
              lines.push(`- \`${f.name}\`${typeStr ? ` : ${typeStr}` : ''}`);
            }
          }
        }
      }
    }

    return lines.join('\n').trim() || '```json\n' + JSON.stringify(data?.data, null, 2) + '\n```';
  }

  function escapeHTML(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function markdownToHTML(md: string): string {
    let html = '';
    let inTable = false;
    const lines = md.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Headings
      if (line.startsWith('### ')) {
        if (inTable) { html += '</table>'; inTable = false; }
        html += `<h4>${escapeHTML(line.slice(4))}</h4>`;
        continue;
      }
      if (line.startsWith('## ')) {
        if (inTable) { html += '</table>'; inTable = false; }
        html += `<h3>${escapeHTML(line.slice(3))}</h3>`;
        continue;
      }
      if (line.startsWith('# ')) {
        if (inTable) { html += '</table>'; inTable = false; }
        html += `<h2>${escapeHTML(line.slice(2))}</h2>`;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        if (inTable) { html += '</table>'; inTable = false; }
        html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`;
        continue;
      }

      // Table separator row — skip
      if (/^\|[-| ]+\|$/.test(line)) continue;

      // Table rows
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.slice(1, -1).split('|').map(c => c.trim());
        if (!inTable) {
          html += '<table><thead><tr>';
          for (const c of cells) html += `<th>${inlineFormat(c)}</th>`;
          html += '</tr></thead><tbody>';
          inTable = true;
          // Skip separator line
          continue;
        }
        html += '<tr>';
        for (const c of cells) html += `<td>${inlineFormat(c)}</td>`;
        html += '</tr>';
        continue;
      }

      if (inTable) { html += '</tbody></table>'; inTable = false; }

      // List items
      if (line.startsWith('- ')) {
        html += `<div class="schema-li">${inlineFormat(line.slice(2))}</div>`;
        continue;
      }

      // Empty line
      if (line.trim() === '') continue;

      // Paragraph
      html += `<p>${inlineFormat(line)}</p>`;
    }

    if (inTable) html += '</tbody></table>';
    return html;
  }

  function inlineFormat(s: string): string {
    // Inline code
    return escapeHTML(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function formatCypherSchema(data: any): string {
    const lines: string[] = [];
    const result = data?.results?.[0];
    if (!result) return '```json\n' + JSON.stringify(data, null, 2) + '\n```';
    const graph = result.data?.[0]?.graph;
    if (!graph) return '```json\n' + JSON.stringify(data, null, 2) + '\n```';
    const nodeLabels = (graph.nodes || []).map((n: any) => ({
      labels: n.labels || [],
      props: Object.keys(n.properties || {})
    }));
    const relTypes = (graph.relationships || []).map((r: any) => r.type).filter(Boolean);
    const uniqueLabels = [...new Set(nodeLabels.flatMap((n: any) => n.labels))].sort();
    const uniqueRels = [...new Set(relTypes)].sort();
    lines.push('# Database Schema (Neo4j)');
    lines.push('');
    lines.push(`> ${uniqueLabels.length} labels, ${uniqueRels.length} relationship types`);
    lines.push('');
    if (uniqueLabels.length > 0) {
      lines.push('## Node Labels');
      lines.push('');
      for (const label of uniqueLabels) {
        lines.push(`- \`${label}\``);
      }
    }
    if (uniqueRels.length > 0) {
      lines.push('');
      lines.push('## Relationship Types');
      lines.push('');
      for (const rel of uniqueRels) {
        lines.push(`- \`${rel}\``);
      }
    }
    return lines.join('\n').trim();
  }

  let schemaHTML = $derived(markdownToHTML(schemaMarkdown));

  async function fetchSchema() {
    loading = true;
    error = '';
    try {
      if (protocol === 'cypher') {
        // Fetch labels and relationship types via RPC
        const [labelsRpc, relsRpc] = await Promise.all([
          graphClient.query({ query: 'CALL db.labels()' }),
          graphClient.query({ query: 'CALL db.relationshipTypes()' }),
        ]);
        const labelsData = JSON.parse(new TextDecoder().decode(labelsRpc.data));
        const relsData = JSON.parse(new TextDecoder().decode(relsRpc.data));
        const labels = (labelsData?.results?.[0]?.data || []).map((d: any) => d.row?.[0]).filter(Boolean);
        const relTypes = (relsData?.results?.[0]?.data || []).map((d: any) => d.row?.[0]).filter(Boolean);
        const lines = ['# Database Schema', '', `> ${labels.length} labels, ${relTypes.length} relationship types`, ''];
        if (labels.length > 0) {
          lines.push('## Node Labels', '');
          for (const l of labels.sort()) lines.push(`- \`${l}\``);
        }
        if (relTypes.length > 0) {
          lines.push('', '## Relationship Types', '');
          for (const r of relTypes.sort()) lines.push(`- \`${r}\``);
        }
        schemaMarkdown = lines.join('\n').trim();
      } else {
        const rpcResp = await graphClient.query({ query: 'schema {}' });
        const data = JSON.parse(new TextDecoder().decode(rpcResp.data));
        if (data.errors) {
          error = data.errors[0]?.message || 'Unknown error';
        } else {
          schemaMarkdown = formatSchema(data);
        }
      }
    } catch (e: any) {
      error = e.message || 'Failed to fetch schema';
    }
    loading = false;
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(schemaMarkdown);
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    } catch {}
  }

  $effect(() => {
    if (visible && !schemaMarkdown && !loading) fetchSchema();
  });
</script>

{#if visible}
<div class="schema-modal" bind:this={modalEl} class:collapsed style={getStyle()}>
  <div class="modal-header" onmousedown={startDrag} role="toolbar" tabindex="0">
    <div class="modal-title-wrap"><h3>Schema</h3></div>
    <button class="modal-btn" onclick={fetchSchema} title="Refresh">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
      </svg>
    </button>
    <button class="modal-btn" onclick={copyToClipboard} title="Copy to clipboard">
      {#if copied}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      {/if}
    </button>
    <button class="modal-btn" class:rotated={collapsed}
      onclick={() => collapsed = !collapsed} title="Collapse">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
    <button class="modal-btn" onclick={onclose} title="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  {#if !collapsed}
    <div class="modal-body">
      {#if loading}
        <div class="schema-loading">Loading schema...</div>
      {:else if error}
        <div class="schema-error">{error}</div>
      {:else}
        <div class="schema-content">{@html schemaHTML}</div>
      {/if}
    </div>
  {/if}
</div>
{/if}

<style>
  .schema-modal {
    position: fixed;
    z-index: 210;
    width: 480px;
    min-width: 300px;
    max-height: 80vh;
    overflow: hidden;
    resize: both;
    background: rgba(11,43,26,0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(250,247,240,0.1);
    border-radius: 12px;
    padding: 16px;
    font-size: 12px;
    color: var(--cream-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 48px rgba(42,149,200,0.06);
    animation: modal-in 0.2s ease-out;
    display: flex;
    flex-direction: column;
  }
  .schema-modal.collapsed {
    height: auto !important;
    min-height: 0;
    resize: none;
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: grab;
    user-select: none;
    flex-shrink: 0;
  }
  .modal-header:active { cursor: grabbing; }
  .modal-title-wrap { flex: 1; min-width: 0; }
  .modal-title-wrap h3 {
    color: var(--morpho-300);
    font-size: 14px;
    font-weight: 700;
    margin: 0;
  }
  .modal-btn {
    background: none;
    border: none;
    color: var(--cream-600);
    cursor: pointer;
    padding: 3px;
    border-radius: 4px;
    transition: all 0.15s;
    line-height: 0;
    flex-shrink: 0;
  }
  .modal-btn:hover {
    color: var(--morpho-400);
    background: rgba(250,247,240,0.06);
  }
  .modal-btn svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    transition: transform 0.2s;
  }
  .modal-btn.rotated svg { transform: rotate(180deg); }

  .modal-body {
    flex: 1;
    margin-top: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .schema-content {
    flex: 1;
    margin: 0;
    padding: 12px 14px;
    background: var(--forest-900);
    border: 1px solid rgba(250,247,240,0.08);
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--cream-200);
    overflow-y: auto;
    max-height: 60vh;
  }
  .schema-content :global(h2) {
    font-size: 15px; font-weight: 700; color: var(--morpho-300);
    margin: 0 0 4px; padding: 0;
  }
  .schema-content :global(h3) {
    font-size: 12px; font-weight: 600; color: var(--morpho-400);
    margin: 12px 0 4px; padding: 0;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .schema-content :global(h4) {
    font-size: 12px; font-weight: 600; color: var(--cream-100);
    margin: 10px 0 2px; padding: 0;
  }
  .schema-content :global(blockquote) {
    margin: 0 0 8px; padding: 6px 10px;
    border-left: 3px solid var(--morpho-400);
    color: var(--cream-400); font-size: 11px;
  }
  .schema-content :global(p) { margin: 4px 0; }
  .schema-content :global(code) {
    font-family: var(--font-code); font-size: 11px;
    background: rgba(250,247,240,0.05); padding: 1px 4px;
    border-radius: 3px; color: var(--cream-100);
  }
  .schema-content :global(table) {
    width: 100%; border-collapse: collapse; margin: 6px 0;
    font-size: 11px;
  }
  .schema-content :global(th) {
    text-align: left; padding: 5px 8px; font-weight: 600;
    color: var(--morpho-300); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.3px;
    border-bottom: 1px solid rgba(42,149,200,0.15);
    background: rgba(42,149,200,0.04);
  }
  .schema-content :global(td) {
    padding: 4px 8px; border-bottom: 1px solid rgba(250,247,240,0.04);
    color: var(--cream-300);
  }
  .schema-content :global(tr:hover td) {
    background: rgba(42,149,200,0.04);
  }
  .schema-content :global(.schema-li) {
    padding: 2px 0 2px 12px; color: var(--cream-300); font-size: 11px;
    border-left: 2px solid rgba(250,247,240,0.06);
    margin: 1px 0;
  }

  .schema-loading {
    padding: 20px;
    text-align: center;
    color: var(--cream-600);
    font-size: 12px;
  }
  .schema-error {
    padding: 10px;
    color: #e15759;
    font-size: 12px;
  }

  @keyframes modal-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
