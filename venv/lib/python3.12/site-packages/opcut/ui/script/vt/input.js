export function text(value, validator, onChange) {
    return ['input', {
            props: {
                type: 'text',
                value: value
            },
            class: {
                invalid: validator && !validator(value)
            },
            on: {
                change: (evt) => onChange(evt.target.value)
            }
        }];
}
export function number(value, validator, onChange) {
    return ['input', {
            props: {
                type: 'number',
                value: value
            },
            class: {
                invalid: validator && !validator(value)
            },
            on: {
                change: (evt) => onChange(evt.target.valueAsNumber)
            }
        }];
}
export function checkbox(label, value, onChange) {
    const input = ['input', {
            props: {
                type: 'checkbox',
                checked: value
            },
            on: {
                change: (evt) => onChange(evt.target.checked)
            }
        }];
    if (!label)
        return input;
    return ['label',
        input,
        ` ${label}`
    ];
}
export function select(selected, values, onChange) {
    return ['select', {
            on: {
                change: (evt) => onChange(evt.target.value)
            }
        },
        values.map(([value, label]) => ['option', {
                props: {
                    selected: value == selected,
                    value: value
                }
            },
            label
        ])];
}
export function color(value, onChange) {
    return ['input', {
            props: {
                type: 'color',
                value: value
            },
            on: {
                change: (evt) => onChange(evt.target.value)
            }
        }];
}
