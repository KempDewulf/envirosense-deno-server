export interface View<Data> {
    render(data: Data): string;
}
