export class tableHeaderDto {
    columnIndex?: number;
    title: string;
    value: string;
    sortable: boolean;
    visible?: boolean = true;
    type?:string = 'text';
}
