import r from '@hat-open/renderer';
import * as u from '@hat-open/util';
import * as csv from './csv.js';
import * as i18n from './i18n.js';
export const methods = {
    forward_greedy: 'Forward greedy',
    greedy: 'Greedy',
    forward_greedy_native: 'Forward greedy (native)',
    greedy_native: 'Greedy (native)'
};
export const fontSizes = {
    small: 0.5,
    medium: 1,
    large: 1.5
};
const calculateUrl = String(new URL('./calculate', window.location.href));
const generateUrl = String(new URL('./generate', window.location.href));
let panelCounter = 0;
let itemCounter = 0;
const defaultSettings = {
    lang: 'en',
    colors: {
        cut: '#646464',
        item: '#fafafa',
        selected: '#c88c8c',
        unused: '#eeeeee'
    },
    panel: {
        height: 100,
        width: 100,
        name: 'Panel'
    },
    item: {
        height: 10,
        width: 10,
        name: 'Item',
        canRotate: true
    }
};
export const defaultState = {
    form: {
        method: 'forward_greedy_native',
        cutWidth: 0.3,
        minInitialUsage: true,
        panels: [],
        items: []
    },
    result: null,
    selected: {
        panel: null,
        item: null
    },
    svg: {
        fontSize: 'medium',
        showNames: true,
        showDimensions: false
    },
    calculating: false,
    showSettings: false,
    settings: defaultSettings
};
export function getState() {
    return r.get();
}
export function getDict() {
    const state = getState();
    return i18n.dicts[state.settings.lang];
}
export function loadSettings() {
    const settingsStr = window.localStorage.getItem('opcut');
    const settings = (settingsStr ? JSON.parse(settingsStr) : null);
    const getType = (x) => (x == null ? 'null' : typeof x);
    const merge = (defaultValue, value) => {
        if (getType(defaultValue) != getType(value))
            return defaultValue;
        if (!u.isObject(defaultValue))
            return value;
        return u.map((v, k) => merge(v, value[k]), defaultValue);
    };
    return merge(defaultSettings, settings);
}
export function saveSettings(settings) {
    const settingsStr = JSON.stringify(settings);
    window.localStorage.setItem('opcut', settingsStr);
}
export async function calculate() {
    await r.set('calculating', true);
    try {
        const state = getState();
        const dict = getDict();
        const params = createCalculateParams(state);
        const res = await fetch(`${calculateUrl}?method=${state.form.method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        if (!res.ok) {
            const err = await res.text();
            throw `${dict.server_error}: ${err}`;
        }
        const result = await res.json();
        const selected = {
            panel: Object.keys(result.params.panels)[0],
            item: null
        };
        await r.change(u.pipe(u.set('result', result), u.set('selected', selected)));
    }
    catch (e) {
        notify(String(e));
    }
    finally {
        await r.set('calculating', false);
    }
}
export async function generate() {
    try {
        const state = getState();
        const dict = getDict();
        const res = await fetch(`${generateUrl}?output_format=pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.result)
        });
        if (!res.ok) {
            const err = await res.text();
            throw `${dict.server_error}: ${err}`;
        }
        const blob = await res.blob();
        const f = new File([blob], 'output.pdf');
        u.saveFile(f);
    }
    catch (e) {
        notify(String(e));
    }
}
export async function csvImportPanels() {
    const f = await u.loadFile('.csv');
    if (f == null)
        return;
    const panels = await csv.decode(f, {
        name: String,
        quantity: u.strictParseInt,
        width: u.strictParseFloat,
        height: u.strictParseFloat
    });
    await r.change(['form', 'panels'], x => x.concat(panels));
}
export function csvExportPanels() {
    const state = getState();
    const blob = csv.encode(state.form.panels);
    const f = new File([blob], 'panels.csv');
    u.saveFile(f);
}
export async function csvImportItems() {
    const f = await u.loadFile('.csv');
    if (f == null)
        return;
    const items = await csv.decode(f, {
        name: String,
        quantity: u.strictParseInt,
        width: u.strictParseFloat,
        height: u.strictParseFloat,
        canRotate: u.equals('true')
    });
    r.change(['form', 'items'], x => x.concat(items));
}
export function csvExportItems() {
    const state = getState();
    const blob = csv.encode(state.form.items);
    const f = new File([blob], 'items.csv');
    u.saveFile(f);
}
export function addPanel() {
    const state = getState();
    panelCounter += 1;
    const panel = {
        quantity: 1,
        height: state.settings.panel.height,
        width: state.settings.panel.width,
        name: `${state.settings.panel.name}${panelCounter}`
    };
    r.change(['form', 'panels'], u.append(panel));
}
export function addItem() {
    const state = getState();
    itemCounter += 1;
    const item = {
        quantity: 1,
        height: state.settings.item.height,
        width: state.settings.item.width,
        name: `${state.settings.item.name}${itemCounter}`,
        canRotate: state.settings.item.canRotate
    };
    r.change(['form', 'items'], u.append(item));
}
function createCalculateParams(state) {
    const dict = getDict();
    if (state.form.cutWidth < 0)
        throw dict.invalid_cut_width;
    const panels = {};
    for (const panel of state.form.panels) {
        if (!panel.name)
            throw dict.invalid_panel_name;
        if (panel.quantity < 1)
            throw `${dict.invalid_quantity} (${dict.panel} ${panel.name})`;
        if (panel.height <= 0)
            throw `${dict.invalid_height} (${dict.panel} ${panel.name})`;
        if (panel.width <= 0)
            throw `${dict.invalid_width} (${dict.panel} ${panel.name})`;
        for (let i = 1; i <= panel.quantity; ++i) {
            const name = panel.quantity > 1 ? `${panel.name} ${i}` : panel.name;
            if (name in panels)
                throw `${dict.duplicate_name} (${dict.panel} ${panel.name})`;
            panels[name] = {
                width: panel.width,
                height: panel.height
            };
        }
    }
    if (u.equals(panels, {}))
        throw dict.no_panels_defined;
    const items = {};
    for (const item of state.form.items) {
        if (!item.name)
            throw dict.invalid_item_name;
        if (item.quantity < 1)
            throw `${dict.invalid_quantity} (${dict.item} ${item.name})`;
        if (item.height <= 0)
            throw `${dict.invalid_height} (${dict.item} ${item.name})`;
        if (item.width <= 0)
            throw `${dict.invalid_width} (${dict.item} ${item.name})`;
        for (let i = 1; i <= item.quantity; ++i) {
            const name = item.quantity > 1 ? `${item.name} ${i}` : item.name;
            if (name in items)
                throw `${dict.duplicate_name} (${dict.panel} ${item.name})`;
            items[name] = {
                width: item.width,
                height: item.height,
                can_rotate: item.canRotate
            };
        }
    }
    if (u.equals(items, {}))
        throw dict.no_items_defined;
    return {
        cut_width: state.form.cutWidth,
        min_initial_usage: state.form.minInitialUsage,
        panels: panels,
        items: items
    };
}
function notify(message) {
    let root = document.querySelector('body > .notifications');
    if (!root) {
        root = document.createElement('div');
        root.className = 'notifications';
        document.body.appendChild(root);
    }
    const el = document.createElement('div');
    el.innerText = message;
    root.appendChild(el);
    setTimeout(() => {
        if (!root)
            return;
        root.removeChild(el);
    }, 2000);
}
