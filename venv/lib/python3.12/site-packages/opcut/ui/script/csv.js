// @ts-ignore
import Papa from 'papaparse';
export async function decode(blob, header) {
    const data = await new Promise(resolve => {
        Papa.parse(blob, {
            header: true,
            complete: (result) => resolve(result.data)
        });
    });
    const decodeElement = (row) => {
        const element = {};
        for (const key in header) {
            if (!(key in row))
                return null;
            element[key] = header[key](row[key]);
        }
        return element;
    };
    const elements = [];
    for (const row of data) {
        const element = decodeElement(row);
        if (!element)
            continue;
        elements.push(element);
    }
    return elements;
}
export function encode(data) {
    const csvData = Papa.unparse(data);
    return new Blob([csvData], { type: 'text/csv' });
}
