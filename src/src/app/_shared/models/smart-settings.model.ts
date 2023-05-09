export class SmartSettings {

    mode: 'external';
    actions: {
        position: 'right';
        add: false;
        edit: false;
        delete: false;
    };
    columns: {};

    addColumn(column: ColumnSettings) {
        const cStg: any = {};
        if (column.type === 'string') {
            cStg.type = 'string';
        } else if (column.type === 'date') {

        } else if (column.type === 'bool') {

        } else if (column.type === 'date') {

        }
    }

    setColumns(columns: ColumnSettings[]) {
        columns.forEach(column => {
            this.addColumn(column);
        });
    }
}

export interface ColumnSettings {
    name: string;
    title: string;
    list: any[];
    type: 'bool' | 'string' | 'date';
}
