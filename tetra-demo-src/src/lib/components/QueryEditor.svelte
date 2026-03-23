<!-- Source: 0x2730 DQL/Cypher Highlighting + 0x2731 Query Editor + 0x2737 Auto-Refresh
     Floating draggable modal matching dgraph_viewer #query-modal -->
<script lang="ts">
  let { onquery, visible = false, onclose, protocol = 'dql' }: {
    onquery: (q: string) => void;
    visible: boolean;
    onclose: () => void;
    protocol: 'dql' | 'cypher';
  } = $props();

  const DQL_DEFAULT = '{ all(func: has(name), first: 100) {\n  uid\n  dgraph.type\n  expand(_all_) {\n    uid\n    dgraph.type\n    expand(_all_)\n  }\n} }';
  const CYPHER_DEFAULT = 'MATCH (n)-[r]->(m)\nRETURN n, r, m\nLIMIT 500';

  // svelte-ignore state_referenced_locally
  let query = $state(protocol === 'cypher' ? CYPHER_DEFAULT : DQL_DEFAULT);
  // svelte-ignore state_referenced_locally
  let lastProtocol = protocol;

  $effect(() => {
    if (protocol !== lastProtocol) {
      query = protocol === 'cypher' ? CYPHER_DEFAULT : DQL_DEFAULT;
      lastProtocol = protocol;
    }
  });

  let collapsed = $state(false);
  let modalEl = $state<HTMLDivElement>(undefined!);
  let textareaEl = $state<HTMLTextAreaElement>(undefined!);
  let preEl = $state<HTMLPreElement>(undefined!);

  // ── DQL Tokenizer ───────────────────────────────────────────────────
  const DQL_KEYWORDS = new Set([
    'query', 'mutation', 'fragment', 'func', 'type', 'as', 'val', 'uid',
    'first', 'offset', 'after', 'orderasc', 'orderdesc', 'filter',
    'and', 'or', 'not', 'var', 'cascade', 'normalize', 'groupby',
    'count', 'sum', 'avg', 'min', 'max', 'shortest', 'from', 'to',
    'recurse', 'depth', 'loop', 'ignorereflex', 'facets'
  ]);

  const DQL_FUNCTIONS = new Set([
    'has', 'eq', 'ge', 'gt', 'le', 'lt', 'between', 'allofterms',
    'anyofterms', 'alloftext', 'anyoftext', 'regexp', 'match', 'near',
    'within', 'contains', 'intersects', 'exact', 'term', 'fulltext',
    'trigram', 'hash', 'type', 'expand', 'uid_in', 'checkpwd',
    'math', 'ceil', 'floor', 'ln', 'exp', 'sqrt', 'since', 'pow',
    'logbase', 'cond', 'len', 'substr', 'lower', 'upper'
  ]);

  // ── Cypher Tokenizer ────────────────────────────────────────────────
  const CYPHER_KEYWORDS = new Set([
    'match', 'optional', 'where', 'return', 'with', 'order', 'by',
    'skip', 'limit', 'union', 'unwind', 'as', 'distinct', 'case',
    'when', 'then', 'else', 'end', 'and', 'or', 'not', 'xor', 'in',
    'is', 'null', 'true', 'false', 'exists', 'call', 'yield',
    'asc', 'ascending', 'desc', 'descending', 'on', 'foreach'
  ]);

  const CYPHER_FUNCTIONS = new Set([
    'count', 'collect', 'sum', 'avg', 'min', 'max', 'size', 'length',
    'type', 'id', 'labels', 'keys', 'properties', 'nodes', 'relationships',
    'head', 'last', 'tail', 'range', 'reduce', 'tostring', 'tointeger',
    'tofloat', 'toboolean', 'coalesce', 'timestamp', 'startnode', 'endnode',
    'abs', 'ceil', 'floor', 'round', 'sign', 'rand', 'log', 'log10',
    'exp', 'sqrt', 'trim', 'ltrim', 'rtrim', 'replace', 'substring',
    'tolower', 'toupper', 'split', 'reverse', 'left', 'right'
  ]);

  interface Token { type: string; value: string; }

  function tokenizeDQL(text: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const len = text.length;
    while (i < len) {
      const ch = text[i];
      if (ch === '#') {
        let end = text.indexOf('\n', i);
        if (end === -1) end = len;
        tokens.push({ type: 'comment', value: text.substring(i, end) });
        i = end; continue;
      }
      if (ch === '"') {
        let j = i + 1;
        while (j < len && text[j] !== '"') { if (text[j] === '\\') j++; j++; }
        if (j < len) j++;
        tokens.push({ type: 'string', value: text.substring(i, j) });
        i = j; continue;
      }
      if (ch === '@') {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_]/.test(text[j])) j++;
        tokens.push({ type: 'directive', value: text.substring(i, j) });
        i = j; continue;
      }
      if (ch === '$') {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_]/.test(text[j])) j++;
        tokens.push({ type: 'variable', value: text.substring(i, j) });
        i = j; continue;
      }
      if (/[0-9]/.test(ch) || (ch === '-' && i + 1 < len && /[0-9]/.test(text[i + 1]))) {
        let j = i; if (ch === '-') j++;
        while (j < len && /[0-9.]/.test(text[j])) j++;
        if (j > i + (ch === '-' ? 1 : 0)) {
          tokens.push({ type: 'number', value: text.substring(i, j) });
          i = j; continue;
        }
      }
      if (/[a-zA-Z_]/.test(ch)) {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_.]/.test(text[j])) j++;
        const word = text.substring(i, j);
        const lower = word.toLowerCase();
        let nextNonSpace = j;
        while (nextNonSpace < len && text[nextNonSpace] === ' ') nextNonSpace++;
        if (DQL_FUNCTIONS.has(lower) || (nextNonSpace < len && text[nextNonSpace] === '(' && !DQL_KEYWORDS.has(lower))) {
          tokens.push({ type: 'function', value: word });
        } else if (DQL_KEYWORDS.has(lower)) {
          tokens.push({ type: 'keyword', value: word });
        } else {
          tokens.push({ type: 'default', value: word });
        }
        i = j; continue;
      }
      if (ch === '{' || ch === '}' || ch === '(' || ch === ')') {
        tokens.push({ type: 'brace', value: ch }); i++; continue;
      }
      if (/\s/.test(ch)) {
        let j = i + 1;
        while (j < len && /\s/.test(text[j])) j++;
        tokens.push({ type: 'ws', value: text.substring(i, j) });
        i = j; continue;
      }
      tokens.push({ type: 'default', value: ch }); i++;
    }
    return tokens;
  }

  function tokenizeCypher(text: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const len = text.length;
    while (i < len) {
      const ch = text[i];
      // Line comment
      if (ch === '/' && i + 1 < len && text[i + 1] === '/') {
        let end = text.indexOf('\n', i);
        if (end === -1) end = len;
        tokens.push({ type: 'comment', value: text.substring(i, end) });
        i = end; continue;
      }
      // String (single or double)
      if (ch === "'" || ch === '"') {
        let j = i + 1;
        while (j < len && text[j] !== ch) { if (text[j] === '\\') j++; j++; }
        if (j < len) j++;
        tokens.push({ type: 'string', value: text.substring(i, j) });
        i = j; continue;
      }
      // Label :Foo
      if (ch === ':' && i + 1 < len && /[A-Z]/.test(text[i + 1])) {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_]/.test(text[j])) j++;
        tokens.push({ type: 'directive', value: text.substring(i, j) });
        i = j; continue;
      }
      // Parameter $var
      if (ch === '$') {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_]/.test(text[j])) j++;
        tokens.push({ type: 'variable', value: text.substring(i, j) });
        i = j; continue;
      }
      // Number
      if (/[0-9]/.test(ch)) {
        let j = i;
        while (j < len && /[0-9.]/.test(text[j])) j++;
        tokens.push({ type: 'number', value: text.substring(i, j) });
        i = j; continue;
      }
      // Arrow operators
      if ((ch === '-' && i + 1 < len && text[i + 1] === '>') ||
          (ch === '<' && i + 1 < len && text[i + 1] === '-')) {
        tokens.push({ type: 'brace', value: text.substring(i, i + 2) });
        i += 2; continue;
      }
      if (ch === '-' && i + 1 < len && text[i + 1] === '-') {
        tokens.push({ type: 'brace', value: '--' });
        i += 2; continue;
      }
      // Word
      if (/[a-zA-Z_]/.test(ch)) {
        let j = i + 1;
        while (j < len && /[a-zA-Z0-9_.]/.test(text[j])) j++;
        const word = text.substring(i, j);
        const lower = word.toLowerCase();
        let nextNonSpace = j;
        while (nextNonSpace < len && text[nextNonSpace] === ' ') nextNonSpace++;
        if (CYPHER_FUNCTIONS.has(lower) || (nextNonSpace < len && text[nextNonSpace] === '(')) {
          tokens.push({ type: 'function', value: word });
        } else if (CYPHER_KEYWORDS.has(lower)) {
          tokens.push({ type: 'keyword', value: word });
        } else {
          tokens.push({ type: 'default', value: word });
        }
        i = j; continue;
      }
      // Parens / brackets
      if ('{}()[]'.includes(ch)) {
        tokens.push({ type: 'brace', value: ch }); i++; continue;
      }
      // Whitespace
      if (/\s/.test(ch)) {
        let j = i + 1;
        while (j < len && /\s/.test(text[j])) j++;
        tokens.push({ type: 'ws', value: text.substring(i, j) });
        i = j; continue;
      }
      tokens.push({ type: 'default', value: ch }); i++;
    }
    return tokens;
  }

  function escapeHTML(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  let highlightedHTML = $derived.by(() => {
    const text = query;
    if (!text) return '';
    const tokens = protocol === 'cypher' ? tokenizeCypher(text) : tokenizeDQL(text);
    const prefix = protocol === 'cypher' ? 'cql' : 'dql';
    let html = '';
    for (const t of tokens) {
      const escaped = escapeHTML(t.value);
      if (t.type === 'ws' || t.type === 'default') {
        html += escaped;
      } else {
        html += `<span class="${prefix}-${t.type}">${escaped}</span>`;
      }
    }
    if (text.charAt(text.length - 1) === '\n') html += ' ';
    return html;
  });

  function syncScroll() {
    if (preEl && textareaEl) {
      preEl.scrollTop = textareaEl.scrollTop;
      preEl.scrollLeft = textareaEl.scrollLeft;
    }
  }

  // Dragging
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let posBottom = 24;
  let posRight = 24;
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

  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onquery(query);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target as HTMLTextAreaElement;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      query = query.substring(0, start) + '  ' + query.substring(end);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }

  function runAll() {
    onquery('MATCH (n)-[r]->(m) RETURN n, r, m');
  }

  function getStyle() {
    if (posTop !== null && posLeft !== null) {
      return `top:${posTop}px; left:${posLeft}px;`;
    }
    return `bottom:${posBottom}px; right:${posRight}px;`;
  }
</script>

{#if visible}
<div class="query-modal" bind:this={modalEl} class:collapsed style={getStyle()}>
  <div class="modal-header" onmousedown={startDrag} role="toolbar" tabindex="0">
    <div class="modal-title-wrap"><h3>Query Editor <span class="proto-badge">{protocol.toUpperCase()}</span></h3></div>
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
      <div class="query-editor-wrap" class:hl-active={query.length > 0}>
        <pre class="query-highlight" bind:this={preEl} aria-hidden="true"><code>{@html highlightedHTML}</code></pre>
        <textarea
          bind:this={textareaEl}
          bind:value={query}
          onkeydown={handleKeydown}
          onscroll={syncScroll}
          spellcheck="false"
          placeholder={protocol === 'cypher' ? 'Enter Cypher query...' : 'Enter DQL query...'}
        ></textarea>
      </div>
      <div class="query-actions">
        <button class="btn btn-primary" onclick={() => onquery(query)}>
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run
        </button>
        <button class="btn" onclick={runAll}>All</button>
        <span class="query-hint">Ctrl+Enter to run</span>
      </div>
    </div>
  {/if}
</div>
{/if}

<style>
  .proto-badge {
    font-size: 9px;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 3px;
    background: rgba(42,149,200,0.15);
    color: var(--morpho-400);
    margin-left: 6px;
    vertical-align: middle;
    letter-spacing: 0.5px;
  }
  .query-modal {
    position: fixed;
    z-index: 210;
    width: 520px;
    min-width: 320px;
    max-height: 80vh;
    overflow: hidden;
    resize: both;
    background: rgba(10, 35, 20, 0.6);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid rgba(42, 149, 200, 0.15);
    border-radius: 12px;
    padding: 16px;
    font-size: 12px;
    color: var(--cream-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 60px rgba(42,149,200,0.08), inset 0 0 40px rgba(42,149,200,0.03);
    animation: modal-in 0.2s ease-out;
    display: flex;
    flex-direction: column;
  }
  .query-modal.collapsed {
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .query-editor-wrap {
    flex: 1;
    position: relative;
    min-height: 140px;
    background: var(--forest-900);
    border: 1px solid rgba(250,247,240,0.08);
    border-radius: 8px;
    overflow: hidden;
  }
  .query-editor-wrap:focus-within {
    border-color: var(--morpho-400);
    box-shadow: 0 0 0 2px rgba(42,149,200,0.15);
  }

  .query-highlight {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    margin: 0;
    padding: 10px;
    font-family: var(--font-code);
    font-size: 13px;
    line-height: 1.5;
    tab-size: 2;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
    pointer-events: none;
    color: var(--cream-100);
  }
  .query-highlight code { font-family: inherit; font-size: inherit; }

  textarea {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    margin: 0; padding: 10px;
    background: transparent;
    color: var(--cream-100);
    border: none;
    font-family: var(--font-code);
    font-size: 13px;
    line-height: 1.5;
    resize: none;
    tab-size: 2;
    caret-color: var(--cream-100);
    outline: none;
    overflow: auto;
  }
  .query-editor-wrap.hl-active textarea { color: transparent; }

  /* DQL syntax token colors */
  .query-highlight :global(.dql-keyword) { color: var(--morpho-400); font-weight: 600; }
  .query-highlight :global(.dql-function) { color: var(--morpho-300); }
  .query-highlight :global(.dql-directive) { color: var(--forest-300); font-weight: 500; }
  .query-highlight :global(.dql-string) { color: var(--cream-300); }
  .query-highlight :global(.dql-number) { color: #edc948; }
  .query-highlight :global(.dql-comment) { color: var(--cream-700); font-style: italic; }
  .query-highlight :global(.dql-variable) { color: var(--morpho-glow); }
  .query-highlight :global(.dql-brace) { color: var(--cream-600); }

  /* Cypher syntax token colors */
  .query-highlight :global(.cql-keyword) { color: var(--morpho-400); font-weight: 600; }
  .query-highlight :global(.cql-function) { color: var(--morpho-300); }
  .query-highlight :global(.cql-directive) { color: #76b7b2; font-weight: 500; }
  .query-highlight :global(.cql-string) { color: var(--cream-300); }
  .query-highlight :global(.cql-number) { color: #edc948; }
  .query-highlight :global(.cql-comment) { color: var(--cream-700); font-style: italic; }
  .query-highlight :global(.cql-variable) { color: var(--morpho-glow); }
  .query-highlight :global(.cql-brace) { color: var(--cream-600); }

  .query-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .query-hint {
    font-size: 11px;
    color: var(--cream-700);
    margin-left: auto;
  }

  .btn {
    padding: 8px 14px;
    border: 1px solid rgba(250,247,240,0.08);
    border-radius: 8px;
    background: var(--forest-700);
    color: var(--cream-200);
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .btn svg {
    width: 14px; height: 14px;
    stroke: currentColor; stroke-width: 2; fill: none;
  }
  .btn:hover {
    background: var(--forest-600);
    border-color: var(--morpho-400);
    color: var(--morpho-300);
  }
  .btn-primary {
    background: var(--forest-500);
    border-color: var(--forest-400);
    color: var(--cream-50);
  }
  .btn-primary:hover {
    background: var(--morpho-deep);
    border-color: var(--morpho-400);
    box-shadow: 0 2px 12px rgba(42,149,200,0.2);
  }

  @keyframes modal-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
