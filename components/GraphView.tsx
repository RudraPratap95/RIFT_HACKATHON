import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { AnalysisResult, DetectionType } from '../types';
import { ZoomIn, ZoomOut, Maximize, Layout, Share2 } from 'lucide-react';

interface GraphViewProps {
  data: AnalysisResult | null;
}

const LAYOUTS = [
  { id: 'cose', label: 'Force Directed (Default)' },
  { id: 'breadthfirst', label: 'Hierarchical (Flow)' },
  { id: 'circle', label: 'Circular (Cycles)' },
  { id: 'grid', label: 'Grid (Structured)' },
  { id: 'concentric', label: 'Concentric (Hubs)' }
];

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [currentLayout, setCurrentLayout] = useState<string>('cose');

  // Initialize Graph Instance
  useEffect(() => {
    if (!containerRef.current || !data) return;

    const cyFactory = (cytoscape as any).default || cytoscape;

    if (typeof cyFactory !== 'function') {
        console.error('Cytoscape failed to load correctly.');
        return;
    }

    // Transform data for Cytoscape
    const elements = [
      ...data.nodes.map(node => ({
        data: {
          id: node.account_id,
          score: node.suspicion_score,
          type: node.flags.length > 0 ? node.flags[0] : 'SAFE',
          volume: node.total_volume
        }
      })),
      ...data.edges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.sender_id,
          target: edge.receiver_id,
          amount: edge.amount
        }
      }))
    ];

    try {
      cyRef.current = cyFactory({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(id)',
              'color': '#94a3b8',
              'font-size': '10px',
              'text-valign': 'bottom',
              'text-margin-y': 5,
              'background-color': '#64748b', // Default slate
              'width': 30,
              'height': 30,
              'border-width': 2,
              'border-color': '#1e293b'
            }
          },
          // High Suspicion
          {
            selector: 'node[score > 50]',
            style: {
              'background-color': '#ef4444', // Red
              'border-color': '#7f1d1d',
              'width': 40,
              'height': 40,
              'text-outline-color': '#000',
              'text-outline-width': 2,
              'color': '#fff'
            }
          },
          // Medium Suspicion (Smurf/Shell)
          {
            selector: 'node[score > 20][score <= 50]',
            style: {
              'background-color': '#f59e0b', // Orange
              'border-color': '#78350f'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#334155',
              'target-arrow-color': '#334155',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          },
          {
            selector: 'edge[amount > 10000]',
            style: {
              'width': 4,
              'line-color': '#475569',
              'target-arrow-color': '#475569'
            }
          },
          {
              selector: ':selected',
              style: {
                  'border-width': 4,
                  'border-color': '#10b981' // Green highlight
              }
          }
        ],
        // Initial layout is preset or null, we run the actual layout in the next effect or immediately below
        layout: { name: 'preset' }
      });

      cyRef.current.on('tap', 'node', (evt) => {
        const node = evt.target;
        setSelectedNode(node.data());
      });
      
      cyRef.current.on('tap', (evt) => {
          if(evt.target === cyRef.current) setSelectedNode(null);
      });
      
      // Trigger initial layout
      runLayout(currentLayout);

    } catch (error) {
      console.error("Error initializing graph:", error);
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [data]);

  // Handle Layout Changes
  useEffect(() => {
    runLayout(currentLayout);
  }, [currentLayout]);

  const runLayout = (name: string) => {
    if (!cyRef.current) return;

    let layoutConfig: any = {
      name: name,
      animate: true,
      animationDuration: 500,
      padding: 50
    };

    if (name === 'cose') {
        layoutConfig = {
            ...layoutConfig,
            componentSpacing: 100,
            nodeRepulsion: (node: any) => 400000,
            edgeElasticity: (edge: any) => 100,
            nestingFactor: 5,
        };
    } else if (name === 'breadthfirst') {
        layoutConfig = {
            ...layoutConfig,
            directed: true,
            spacingFactor: 1.5,
            avoidOverlap: true
        };
    } else if (name === 'circle') {
        layoutConfig = {
            ...layoutConfig,
            radius: 200, // fit roughly in view
        };
    } else if (name === 'concentric') {
        layoutConfig = {
            ...layoutConfig,
            minNodeSpacing: 50,
            levelWidth: () => 1
        };
    }

    cyRef.current.layout(layoutConfig).run();
  };

  const handleFit = () => cyRef.current?.fit();
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);

  if (!data) return <div className="h-full w-full flex items-center justify-center text-slate-500">No Graph Data</div>;

  return (
    <div className="relative w-full h-[600px] bg-rift-800 rounded-xl border border-rift-700 overflow-hidden shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-rift-900/80 p-2 rounded-lg border border-rift-700 backdrop-blur-sm flex flex-col gap-2">
            <button onClick={handleFit} className="p-2 hover:bg-rift-700 text-slate-300 rounded" title="Fit View"><Maximize size={18} /></button>
            <button onClick={handleZoomIn} className="p-2 hover:bg-rift-700 text-slate-300 rounded" title="Zoom In"><ZoomIn size={18} /></button>
            <button onClick={handleZoomOut} className="p-2 hover:bg-rift-700 text-slate-300 rounded" title="Zoom Out"><ZoomOut size={18} /></button>
        </div>

        {/* Layout Switcher */}
        <div className="bg-rift-900/80 p-2 rounded-lg border border-rift-700 backdrop-blur-sm flex flex-col gap-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold text-center mb-1 flex items-center justify-center gap-1">
                <Layout size={10} /> Layout
            </div>
            {LAYOUTS.map(layout => (
                <button
                    key={layout.id}
                    onClick={() => setCurrentLayout(layout.id)}
                    className={`text-xs px-2 py-1.5 rounded text-left transition-colors ${currentLayout === layout.id ? 'bg-rift-500 text-rift-900 font-bold' : 'text-slate-400 hover:bg-rift-700 hover:text-white'}`}
                >
                    {layout.label}
                </button>
            ))}
        </div>
      </div>

      {/* Node Tooltip/Inspector */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 w-64 bg-rift-900/90 border border-rift-500 p-4 rounded-lg backdrop-blur-md shadow-lg text-slate-200">
          <h3 className="text-rift-400 font-bold text-lg mb-1">{selectedNode.id}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className={`font-mono font-bold ${selectedNode.score > 50 ? 'text-rift-alert' : 'text-slate-400'}`}>
                {selectedNode.score}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span>Primary Flag:</span>
              <span className="font-mono text-xs bg-rift-700 px-1 rounded">{selectedNode.type}</span>
            </div>
             <div className="flex justify-between">
              <span>Volume:</span>
              <span className="font-mono">${selectedNode.volume.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphView;