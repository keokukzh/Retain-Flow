'use client';

import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';

export default function VisualEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesRef = useRef<any>(null);

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
            modalImportContent(editor: any) {
              return `${editor.getHtml()}<style>${editor.getCss()}</style>`;
            },
            filestackOpts: null,
            aviaryOpts: false,
            blocksBasicOpts: {
              blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
              flexGrid: 1,
            },
            customStyleManager: [{
              name: 'General',
              buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
              properties: [{
                type: 'integer',
                name: 'The Width',
                property: 'width',
                units: ['px', '%'],
                defaults: 'auto',
                min: 0,
              }]
            }],
          }
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
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '768px',
            }
          ]
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
                  id: 'show-style',
                  active: true,
                  label: 'Styles',
                  command: 'show-styles',
                  togglable: false,
                },
                {
                  id: 'show-traits',
                  active: true,
                  label: 'Settings',
                  command: 'show-traits',
                  togglable: false,
                }
              ],
            }
          ]
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
            }
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

  const handleSave = () => {
    if (grapesRef.current) {
      const html = grapesRef.current.getHtml();
      const css = grapesRef.current.getCss();
      // Save to localStorage for demo
      localStorage.setItem('retainflow-editor-html', html);
      localStorage.setItem('retainflow-editor-css', css);
      alert('Content saved! Check localStorage for HTML/CSS output.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">RetainFlow Visual Editor</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => grapesRef.current?.runCommand('core:canvas-clear')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="editor-row">
        <div className="editor-canvas">
          <div className="panel__top">
            <div className="panel__basic-actions">
              <button className="btn btn-primary" data-action="undo">Undo</button>
              <button className="btn btn-primary" data-action="redo">Redo</button>
            </div>
            <div className="panel__devices"></div>
          </div>
          <div className="editor-canvas__body">
            <div ref={editorRef}></div>
          </div>
        </div>
        <div className="panel__right">
          <div className="panel__switcher"></div>
          <div className="blocks-container"></div>
          <div className="layers-container"></div>
          <div className="styles-container"></div>
          <div className="traits-container"></div>
        </div>
      </div>

      <style jsx>{`
        .editor-row {
          display: flex;
          height: calc(100vh - 80px);
        }
        .editor-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .panel__top {
          background: #fff;
          border-bottom: 1px solid #ddd;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel__right {
          width: 300px;
          background: #fff;
          border-left: 1px solid #ddd;
          overflow-y: auto;
        }
        .panel__switcher {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .blocks-container,
        .layers-container,
        .styles-container,
        .traits-container {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-primary:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}
