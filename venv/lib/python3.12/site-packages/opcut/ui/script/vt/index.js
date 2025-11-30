import r from '@hat-open/renderer';
import * as u from '@hat-open/util';
import * as common from '../common.js';
import * as params from './params.js';
import * as result from './result.js';
import * as settings from './settings.js';
import * as svg from './svg.js';
export function main() {
    const state = common.getState();
    return ['div.main',
        ['div.left-panel', params.main()],
        leftPanelResizer(),
        ['div.center-panel', svg.main()],
        rightPanelResizer(),
        ['div.right-panel', result.main()],
        (state.showSettings ?
            settingsOverlay() :
            [])
    ];
}
function leftPanelResizer() {
    return ['div.panel-resizer', {
            on: {
                mousedown: u.draggerMouseDownHandler(evt => {
                    const panel = evt.target.parentNode?.querySelector('.left-panel');
                    if (panel == null)
                        return () => { }; // eslint-disable-line
                    const width = panel.clientWidth;
                    return (_, dx) => {
                        panel.style.width = `${width + dx}px`;
                    };
                })
            }
        }];
}
function rightPanelResizer() {
    return ['div.panel-resizer', {
            on: {
                mousedown: u.draggerMouseDownHandler(evt => {
                    const panel = evt.target.parentNode?.querySelector('.right-panel');
                    if (panel == null)
                        return () => { }; // eslint-disable-line
                    const width = panel.clientWidth;
                    return (_, dx) => {
                        panel.style.width = `${width - dx}px`;
                    };
                })
            }
        }];
}
function settingsOverlay() {
    return ['div.overlay', {
            on: {
                click: (evt) => {
                    evt.stopPropagation();
                    r.set('showSettings', false);
                }
            }
        },
        settings.main()];
}
