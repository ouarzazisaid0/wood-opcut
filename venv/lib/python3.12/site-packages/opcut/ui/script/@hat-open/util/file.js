/**
 * Load file
 */
export function loadFile(ext) {
    const el = document.createElement('input');
    el.style = 'display: none';
    el.type = 'file';
    el.accept = ext;
    document.body.appendChild(el);
    return new Promise(resolve => {
        const listener = (evt) => {
            const f = evt.target.files?.[0] ?? null;
            document.body.removeChild(el);
            resolve(f);
        };
        el.addEventListener('change', listener);
        // TODO blur not fired on close???
        el.addEventListener('blur', listener);
        el.click();
    });
}
/**
 * Save file
 */
export function saveFile(f) {
    const a = document.createElement('a');
    a.download = f.name;
    a.rel = 'noopener';
    a.href = URL.createObjectURL(f);
    setTimeout(() => { URL.revokeObjectURL(a.href); }, 20000);
    setTimeout(() => { a.click(); }, 0);
}
