// experience-graph.js — D3 force graph + Alpine.js state for /about/mickey/
(function () {
  'use strict';

  // ── Color palette ──
  var NODE_COLORS = {
    role:       '#2D7A4A',
    skill:      '#2A95C8',
    project:    '#8B6914',
    philosophy: '#E85A48',
    influence:  '#C4B899',
    education:  '#A67BC5'
  };

  // ── Node radius by type ──
  var NODE_RADIUS = {
    role: 22,
    skill: 16,
    project: 20,
    philosophy: 16,
    influence: 14,
    education: 14
  };

  // ── Type labels for filter pills ──
  var NODE_TYPE_LABELS = [
    { type: 'role',       label: 'Roles' },
    { type: 'skill',      label: 'Skills' },
    { type: 'project',    label: 'Projects' },
    { type: 'philosophy', label: 'Philosophies' },
    { type: 'influence',  label: 'Influences' },
    { type: 'education',  label: 'Education' }
  ];

  // ── Edge type display names ──
  var EDGE_LABELS = {
    learned_at:      { outgoing: 'learned at',      incoming: 'taught' },
    led_to:          { outgoing: 'led to',           incoming: 'led from' },
    reinforced_by:   { outgoing: 'reinforced at',    incoming: 'reinforced' },
    originated_from: { outgoing: 'originated from',  incoming: 'origin of' },
    applied_at:      { outgoing: 'applied at',       incoming: 'applies' },
    mentored_by:     { outgoing: 'mentored by',      incoming: 'mentored' },
    inspired_by:     { outgoing: 'inspired by',      incoming: 'inspired' },
    evolved_into:    { outgoing: 'evolved into',     incoming: 'evolved from' },
    enabled:         { outgoing: 'enabled',          incoming: 'enabled by' },
    chose_over:      { outgoing: 'chose over',       incoming: 'chose over by' }
  };

  // ── Hex polygon points ──
  function hexPoints(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i - Math.PI / 2;
      pts.push((cx + r * Math.cos(angle)).toFixed(2) + ',' + (cy + r * Math.sin(angle)).toFixed(2));
    }
    return pts.join(' ');
  }

  // ── Truncate label ──
  function truncateLabel(text, maxLen) {
    if (!text) return '';
    return text.length > maxLen ? text.slice(0, maxLen - 1) + '\u2026' : text;
  }

  // ── Alpine component ──
  window.experienceGraph = function () {
    return {
      // State
      nodes: [],
      edges: [],
      selectedNode: null,
      connectedEdges: [],
      activeFilters: [],
      nodeTypes: NODE_TYPE_LABELS,
      _simulation: null,
      _svg: null,
      _g: null,
      _zoom: null,
      _nodeMap: {},

      // ── Init ──
      init: function () {
        var raw = JSON.parse(document.getElementById('graph-data').textContent);
        this.nodes = raw.nodes;
        this.edges = raw.edges;
        this.activeFilters = NODE_TYPE_LABELS.map(function (t) { return t.type; });

        // Build node lookup
        var self = this;
        this.nodes.forEach(function (n) { self._nodeMap[n.id] = n; });

        // Wait for DOM + D3
        this.$nextTick(function () {
          self.buildGraph();
        });
      },

      // ── Build D3 graph ──
      buildGraph: function () {
        var self = this;
        var svg = d3.select('#graph-svg');

        // Prevent double-init: stop old simulation and clear SVG
        if (this._simulation) {
          this._simulation.stop();
          this._simulation = null;
        }
        svg.selectAll('*').remove();

        this._svg = svg;

        var svgNode = svg.node();
        var width = svgNode.clientWidth || svgNode.parentElement.clientWidth;
        var height = svgNode.clientHeight || svgNode.parentElement.clientHeight;

        // Defs for glow filter
        var defs = svg.append('defs');
        var glowFilter = defs.append('filter')
          .attr('id', 'glow')
          .attr('x', '-50%').attr('y', '-50%')
          .attr('width', '200%').attr('height', '200%');
        glowFilter.append('feGaussianBlur')
          .attr('stdDeviation', '4')
          .attr('result', 'coloredBlur');
        var merge = glowFilter.append('feMerge');
        merge.append('feMergeNode').attr('in', 'coloredBlur');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Main group for zoom/pan
        var g = svg.append('g');
        this._g = g;

        // Zoom behavior — extent clamped after simulation settles
        var zoom = d3.zoom()
          .scaleExtent([0.5, 2.5])
          .on('zoom', function (event) {
            g.attr('transform', event.transform);
          });
        svg.call(zoom);
        this._zoom = zoom;

        // Prepare edge data — resolve node references
        var edgeData = this.edges.filter(function (e) {
          return self._nodeMap[e.source] && self._nodeMap[e.target];
        }).map(function (e) {
          return Object.assign({}, e, {
            source: e.source,
            target: e.target
          });
        });

        // Force simulation
        var simulation = d3.forceSimulation(this.nodes)
          .force('link', d3.forceLink(edgeData)
            .id(function (d) { return d.id; })
            .distance(120)
            .strength(0.3))
          .force('charge', d3.forceManyBody()
            .strength(-250)
            .distanceMax(350))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collide', d3.forceCollide()
            .radius(function (d) { return (NODE_RADIUS[d.type] || 16) + 8; }))
          .force('x', d3.forceX(width / 2).strength(0.04))
          .force('y', d3.forceY(height / 2).strength(0.04));

        this._simulation = simulation;

        // ── Edges ──
        var linkGroup = g.append('g').attr('class', 'graph-edges');
        var links = linkGroup.selectAll('line')
          .data(edgeData)
          .enter().append('line')
          .attr('class', 'graph-edge')
          .attr('stroke', 'rgba(245, 240, 230, 0.08)')
          .attr('stroke-width', 1);

        // ── Nodes ──
        var nodeGroup = g.append('g').attr('class', 'graph-nodes');
        var nodeElements = nodeGroup.selectAll('g')
          .data(this.nodes)
          .enter().append('g')
          .attr('class', 'graph-node')
          .attr('cursor', 'pointer')
          .call(d3.drag()
            .on('start', function (event, d) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', function (event, d) {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', function (event, d) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
          );

        // Hexagon polygons
        nodeElements.append('polygon')
          .attr('points', function (d) {
            var r = NODE_RADIUS[d.type] || 16;
            return hexPoints(0, 0, r);
          })
          .attr('fill', function (d) { return NODE_COLORS[d.type] || '#666'; })
          .attr('stroke', function (d) { return NODE_COLORS[d.type] || '#666'; })
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.6)
          .attr('fill-opacity', 0.85);

        // Labels
        nodeElements.append('text')
          .text(function (d) { return truncateLabel(d.name, 18); })
          .attr('text-anchor', 'middle')
          .attr('dy', function (d) { return (NODE_RADIUS[d.type] || 16) + 13; })
          .attr('fill', '#A69E86')
          .attr('font-size', '10px')
          .attr('font-family', 'HK Grotesk Pro, system-ui, sans-serif')
          .attr('pointer-events', 'none');

        // ── Interactions ──
        nodeElements
          .on('click', function (event, d) {
            event.stopPropagation();
            self.selectNode(d);
          })
          .on('mouseenter', function (event, d) {
            if (self.selectedNode) return;
            // Highlight this node
            d3.select(this).select('polygon')
              .attr('filter', 'url(#glow)')
              .transition().duration(150)
              .attr('fill-opacity', 1)
              .attr('transform', 'scale(1.1)');

            // Highlight connected edges
            var connectedIds = new Set();
            links.each(function (e) {
              var sid = typeof e.source === 'object' ? e.source.id : e.source;
              var tid = typeof e.target === 'object' ? e.target.id : e.target;
              if (sid === d.id || tid === d.id) {
                connectedIds.add(sid);
                connectedIds.add(tid);
                d3.select(this)
                  .attr('stroke', 'rgba(42, 149, 200, 0.4)')
                  .attr('stroke-width', 2);
              }
            });
          })
          .on('mouseleave', function (event, d) {
            if (self.selectedNode) return;
            d3.select(this).select('polygon')
              .attr('filter', null)
              .transition().duration(150)
              .attr('fill-opacity', 0.85)
              .attr('transform', null);

            links
              .attr('stroke', 'rgba(245, 240, 230, 0.08)')
              .attr('stroke-width', 1);
          });

        // ── Tick ──
        simulation.on('tick', function () {
          links
            .attr('x1', function (d) { return d.source.x; })
            .attr('y1', function (d) { return d.source.y; })
            .attr('x2', function (d) { return d.target.x; })
            .attr('y2', function (d) { return d.target.y; });

          nodeElements
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
        });

        // Store references for later
        this._links = links;
        this._nodeElements = nodeElements;

        // Click background to deselect
        svg.on('click', function () {
          self.deselectNode();
        });

        // Fit graph initially after simulation settles, then clamp zoom to data bounds
        setTimeout(function () {
          self._clampZoomToData();
          self.resetView();
        }, 2000);
      },

      // ── Select node ──
      selectNode: function (d) {
        var self = this;
        this.selectedNode = d;

        // Build connected edges list for panel
        var connected = [];
        this.edges.forEach(function (e) {
          var sid = typeof e.source === 'object' ? e.source.id : e.source;
          var tid = typeof e.target === 'object' ? e.target.id : e.target;
          if (sid === d.id) {
            var other = self._nodeMap[tid];
            if (other) {
              connected.push(Object.assign({}, e, {
                otherId: tid,
                otherName: other.name,
                otherType: other.type,
                direction: 'outgoing'
              }));
            }
          } else if (tid === d.id) {
            var other2 = self._nodeMap[sid];
            if (other2) {
              connected.push(Object.assign({}, e, {
                otherId: sid,
                otherName: other2.name,
                otherType: other2.type,
                direction: 'incoming'
              }));
            }
          }
        });
        this.connectedEdges = connected;

        // Visual: dim non-connected, highlight connected
        var connectedIds = new Set([d.id]);
        connected.forEach(function (e) { connectedIds.add(e.otherId); });

        this._nodeElements.each(function (n) {
          var el = d3.select(this);
          if (connectedIds.has(n.id)) {
            el.select('polygon')
              .attr('fill-opacity', 1)
              .attr('filter', n.id === d.id ? 'url(#glow)' : null);
            el.select('text').attr('fill-opacity', 1);
            el.attr('pointer-events', 'auto');
          } else {
            el.select('polygon').attr('fill-opacity', 0.12).attr('filter', null);
            el.select('text').attr('fill-opacity', 0.15);
            el.attr('pointer-events', 'none');
          }
        });

        this._links.each(function (e) {
          var sid = typeof e.source === 'object' ? e.source.id : e.source;
          var tid = typeof e.target === 'object' ? e.target.id : e.target;
          if (sid === d.id || tid === d.id) {
            d3.select(this)
              .attr('stroke', 'rgba(42, 149, 200, 0.5)')
              .attr('stroke-width', 2);
          } else {
            d3.select(this)
              .attr('stroke', 'rgba(245, 240, 230, 0.03)')
              .attr('stroke-width', 0.5);
          }
        });
      },

      // ── Deselect ──
      deselectNode: function () {
        this.selectedNode = null;
        this.connectedEdges = [];

        if (this._nodeElements) {
          this._nodeElements.each(function () {
            var el = d3.select(this);
            el.select('polygon')
              .attr('fill-opacity', 0.85)
              .attr('filter', null);
            el.select('text').attr('fill-opacity', 1);
            el.attr('pointer-events', 'auto');
          });
        }

        if (this._links) {
          this._links
            .attr('stroke', 'rgba(245, 240, 230, 0.08)')
            .attr('stroke-width', 1);
        }
      },

      // ── Navigate to connected node ──
      navigateToNode: function (nodeId) {
        var node = this._nodeMap[nodeId];
        if (!node) return;
        this.selectNode(node);

        // Pan to the node, preserving current zoom scale
        if (node.x !== undefined && node.y !== undefined) {
          var svg = this._svg.node();
          var width = svg.clientWidth;
          var height = svg.clientHeight;
          // Get current zoom scale, default to 1
          var currentTransform = d3.zoomTransform(svg);
          var scale = currentTransform.k || 1;
          // Offset left to account for detail panel on desktop
          var offsetX = window.innerWidth >= 768 ? -140 : 0;
          var transform = d3.zoomIdentity
            .translate(width / 2 + offsetX - node.x * scale, height / 2 - node.y * scale)
            .scale(scale);
          this._svg.transition().duration(500).call(this._zoom.transform, transform);
        }
      },

      // ── Filter toggles ──
      toggleFilter: function (type) {
        var idx = this.activeFilters.indexOf(type);
        if (idx > -1) {
          // Don't allow filtering out all types
          if (this.activeFilters.length <= 1) return;
          this.activeFilters.splice(idx, 1);
        } else {
          this.activeFilters.push(type);
        }
        this._applyFilters();
      },

      resetFilters: function () {
        this.activeFilters = NODE_TYPE_LABELS.map(function (t) { return t.type; });
        this._applyFilters();
      },

      _applyFilters: function () {
        var active = this.activeFilters;
        if (this._nodeElements) {
          this._nodeElements.each(function (d) {
            var el = d3.select(this);
            var visible = active.indexOf(d.type) > -1;
            el.select('polygon').attr('fill-opacity', visible ? 0.85 : 0.06);
            el.select('text').attr('fill-opacity', visible ? 1 : 0.06);
            el.attr('pointer-events', visible ? 'auto' : 'none');
          });
        }
        if (this._links) {
          var nodeMap = this._nodeMap;
          this._links.each(function (e) {
            var sid = typeof e.source === 'object' ? e.source.id : e.source;
            var tid = typeof e.target === 'object' ? e.target.id : e.target;
            var sNode = nodeMap[sid];
            var tNode = nodeMap[tid];
            var visible = sNode && tNode &&
              active.indexOf(sNode.type) > -1 &&
              active.indexOf(tNode.type) > -1;
            d3.select(this)
              .attr('stroke-opacity', visible ? 1 : 0.05);
          });
        }
      },

      // ── Zoom controls ──
      zoomIn: function () {
        this._svg.transition().duration(300).call(this._zoom.scaleBy, 1.4);
      },
      zoomOut: function () {
        this._svg.transition().duration(300).call(this._zoom.scaleBy, 0.7);
      },
      resetView: function () {
        var svg = this._svg.node();
        if (!svg) return;
        var width = svg.clientWidth;
        var height = svg.clientHeight;

        // Compute bounds of all nodes
        var xExtent = d3.extent(this.nodes, function (d) { return d.x; });
        var yExtent = d3.extent(this.nodes, function (d) { return d.y; });
        if (xExtent[0] == null) return;

        var graphWidth = xExtent[1] - xExtent[0] + 100;
        var graphHeight = yExtent[1] - yExtent[0] + 100;
        var scale = Math.min(
          width / graphWidth,
          height / graphHeight,
          1.5
        ) * 0.85;
        var cx = (xExtent[0] + xExtent[1]) / 2;
        var cy = (yExtent[0] + yExtent[1]) / 2;

        var transform = d3.zoomIdentity
          .translate(width / 2 - cx * scale, height / 2 - cy * scale)
          .scale(scale);
        this._svg.transition().duration(600).call(this._zoom.transform, transform);
      },

      // ── Clamp zoom + pan to data bounds ──
      _clampZoomToData: function () {
        var svg = this._svg.node();
        if (!svg) return;
        var width = svg.clientWidth;
        var height = svg.clientHeight;

        var xExtent = d3.extent(this.nodes, function (d) { return d.x; });
        var yExtent = d3.extent(this.nodes, function (d) { return d.y; });
        if (xExtent[0] == null) return;

        var padding = 150;

        // Minimum scale = the scale that fits all data in view
        var graphWidth = xExtent[1] - xExtent[0] + padding * 2;
        var graphHeight = yExtent[1] - yExtent[0] + padding * 2;
        var minScale = Math.min(width / graphWidth, height / graphHeight) * 0.85;
        minScale = Math.max(minScale, 0.3);

        this._zoom
          .scaleExtent([minScale, 2.5])
          .translateExtent([
            [xExtent[0] - padding, yExtent[0] - padding],
            [xExtent[1] + padding, yExtent[1] + padding]
          ]);
      },

      // ── Helpers ──
      getNodeColor: function (type) {
        return NODE_COLORS[type] || '#666';
      },

      formatEdgeType: function (type, direction) {
        var labels = EDGE_LABELS[type];
        if (!labels) return type.replace(/_/g, ' ');
        return labels[direction] || type.replace(/_/g, ' ');
      }
    };
  };
})();
