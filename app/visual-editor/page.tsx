'use client';

import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';
import { RetainFlowBlocks } from '@/components/editor/blocks/RetainFlowBlocks';
import { RetainFlowStyles } from '@/components/editor/blocks/RetainFlowStyles';
import EditorToolbar from '@/components/editor/EditorToolbar';
import TemplatesPanel from '@/components/editor/TemplatesPanel';
import ExportPanel from '@/components/editor/ExportPanel';

export default function VisualEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesRef = useRef<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    if (editorRef.current && !grapesRef.current) {
      grapesRef.current = grapesjs.init({
        container: editorRef.current,
        height: '100vh',
        width: '100%',
        plugins: ['gjs-preset-webpage', 'gjs-blocks-basic'],
        pluginsOpts: {
          'gjs-preset-webpage': {
            modalImportTitle: 'Import Template',
            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
            modalImportContent: (editor: any) => `${editor.getHtml()}<style>${editor.getCss()}</style>`,
            filestackOpts: null,
            aviaryOpts: false,
            blocksBasicOpts: {
              blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
              flexGrid: 1,
            },
          },
        },
        storageManager: {
          type: 'local',
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
        },
        deviceManager: {
          devices: [
            {
              id: 'desktop',
              name: 'Desktop',
              width: '',
            },
            {
              id: 'tablet',
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              id: 'mobile',
              name: 'Mobile',
              width: '375px',
              widthMedia: '480px',
            },
          ],
        },
        panels: {
          defaults: [
            {
              id: 'layers',
              el: '.panel__right',
              resizable: {
                maxDim: 350,
                minDim: 200,
                tc: false,
                cl: true,
                cr: false,
                bc: false,
                keyWidth: 'flex-basis',
              },
            },
            {
              id: 'panel-switcher',
              el: '.panel__switcher',
              buttons: [
                {
                  id: 'show-layers',
                  active: true,
                  label: 'Layers',
                  command: 'show-layers',
                  togglable: false,
                },
                {
                  id: 'show-styles',
                  active: true,
                  label: 'Styles',
                  command: 'show-styles',
                  togglable: false,
                },
                {
                  id: 'show-traits',
                  active: true,
                  label: 'Traits',
                  command: 'show-traits',
                  togglable: false,
                },
              ],
            },
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: 'D',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-tablet',
                  label: 'T',
                  command: 'set-device-tablet',
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: 'M',
                  command: 'set-device-mobile',
                  togglable: false,
                },
              ],
            },
          ],
        },
        blockManager: {
          appendTo: '.blocks-container',
          blocks: [
            {
              id: 'section',
              label: '<b>Section</b>',
              attributes: { class: 'gjs-block-section' },
              content: `<section>
                <h1>Put title here</h1>
                <p>Put your text here</p>
              </section>`,
            },
            {
              id: 'text',
              label: 'Text',
              content: '<div data-gjs-type="text">Insert your text here</div>',
            },
            {
              id: 'image',
              label: 'Image',
              select: true,
              content: { type: 'image' },
              activate: true,
            },
            // Add RetainFlow blocks
            ...RetainFlowBlocks.map(block => ({
              id: block.id,
              label: block.label,
              content: block.content,
              category: block.category,
              attributes: block.attributes,
            }))
          ]
        },
        layerManager: {
          appendTo: '.layers-container'
        },
        traitManager: {
          appendTo: '.traits-container',
        },
        selectorManager: {
          appendTo: '.styles-container'
        }
      });

      // Add RetainFlow styles
      const cssComposer = grapesRef.current.CssComposer;
      cssComposer.addRules(RetainFlowStyles);

      grapesRef.current.on('load', () => {
        // Editor loaded
      });

      // Add custom commands
      grapesRef.current.Commands.add('show-layers', {
        getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
        getLayersEl(row: any) { return row.querySelector('.layers-container') },

        run(editor: any) {
          const rowEl = this.getRowEl(editor);
          const layersEl = this.getLayersEl(rowEl);
          layersEl.style.display = '';
        },
        stop(editor: any) {
          const rowEl = this.getRowEl(editor);
          const layersEl = this.getLayersEl(rowEl);
          layersEl.style.display = 'none';
        },
      });

      grapesRef.current.Commands.add('show-styles', {
        getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
        getStyleEl(row: any) { return row.querySelector('.styles-container') },

        run(editor: any) {
          const rowEl = this.getRowEl(editor);
          const styleEl = this.getStyleEl(rowEl);
          styleEl.style.display = '';
        },
        stop(editor: any) {
          const rowEl = this.getRowEl(editor);
          const styleEl = this.getStyleEl(rowEl);
          styleEl.style.display = 'none';
        },
      });

      grapesRef.current.Commands.add('show-traits', {
        getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
        getTraitsEl(row: any) { return row.querySelector('.traits-container') },

        run(editor: any) {
          const rowEl = this.getRowEl(editor);
          const traitsEl = this.getTraitsEl(rowEl);
          traitsEl.style.display = '';
        },
        stop(editor: any) {
          const rowEl = this.getRowEl(editor);
          const traitsEl = this.getTraitsEl(rowEl);
          traitsEl.style.display = 'none';
        },
      });
    }

    return () => {
      if (grapesRef.current) {
        grapesRef.current.destroy();
        grapesRef.current = null;
      }
    };
  }, []);

        // Load templates
        useEffect(() => {
          const loadTemplates = async () => {
            try {
              const response = await fetch('/api/templates.json');
              const data = await response.json();
              if (data.success) {
                setTemplates(data.templates);
              }
            } catch (error) {
              // console.error('Error loading templates:', error);
            }
          };
          loadTemplates();
        }, []);

  const handleSave = async () => {
    if (grapesRef.current) {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();
      
      try {
        // Save to database (demo with mock userId)
        const response = await fetch('/api/editor/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user-id',
            name: `Project ${new Date().toLocaleString()}`,
            html,
            css,
            isPublic: false,
            tags: ['visual-editor'],
          }),
        });

        if (response.ok) {
          alert('Content saved to database!');
        } else {
          // Fallback to localStorage
          localStorage.setItem('retainflow-editor-html', html);
          localStorage.setItem('retainflow-editor-css', css);
          alert('Content saved to localStorage!');
        }
      } catch (error) {
        // Fallback to localStorage
        localStorage.setItem('retainflow-editor-html', html);
        localStorage.setItem('retainflow-editor-css', css);
        alert('Content saved to localStorage!');
      }
    }
  };

  const handleExport = async (format: string) => {
    if (grapesRef.current) {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();

      try {
        const response = await fetch('/api/editor/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html,
            css,
            format,
            componentName: 'CustomComponent',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Download file
          const blob = new Blob([JSON.stringify(data.data, null, 2)], {
            type: 'application/json',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `retainflow-export.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          alert(`Exported as ${format.toUpperCase()}!`);
        }
      } catch (error) {
        // console.error('Export error:', error);
        alert('Export failed!');
      }
    }
  };

        const loadTemplate = async (templateId: string) => {
          try {
            const response = await fetch('/api/templates.json');
            const data = await response.json();
            
            if (data.success && grapesRef.current) {
              const template = data.templates.find((t: any) => t.id === templateId);
              
              if (template) {
                // Clear current content
                grapesRef.current.runCommand('core:canvas-clear');
                
                // Load template HTML
                grapesRef.current.setComponents(template.html);
                
                // Load template CSS
                grapesRef.current.setStyle(template.css);
                
                alert(`Template "${template.name}" loaded!`);
                setShowTemplates(false);
              } else {
                alert('Template not found!');
              }
            }
          } catch (error) {
            // console.error('Error loading template:', error);
            alert('Failed to load template!');
          }
        };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <EditorToolbar
        onTemplatesClick={() => setShowTemplates(!showTemplates)}
        onExportClick={() => setShowExport(!showExport)}
        onSave={handleSave}
        onClear={() => grapesRef.current?.runCommand('core:canvas-clear')}
      />

      {/* Templates Panel */}
      {showTemplates && (
        <TemplatesPanel
          templates={templates}
          onLoadTemplate={loadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Export Panel */}
      {showExport && (
        <ExportPanel
          onExport={handleExport}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Editor Layout */}
      <div className="editor-row">
        <div className="panel__left w-1/5 bg-gray-50 border-r p-4">
          <div className="panel__switcher mb-4"></div>
          <div className="blocks-container mb-4"></div>
          <div className="layers-container mb-4"></div>
          <div className="styles-container mb-4"></div>
          <div className="traits-container mb-4"></div>
        </div>
        <div className="editor-container flex-grow relative">
          <div ref={editorRef} className="h-full w-full"></div>
        </div>
        <div className="panel__right w-1/5 bg-gray-50 border-l p-4">
          {/* Right panel content */}
        </div>
        <div className="panel__devices absolute top-4 right-4 flex space-x-2"></div>
      </div>
    </div>
  );
}