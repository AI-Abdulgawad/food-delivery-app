
export class Permission {
    id?: number;
    resource:string
    action:string

    constructor(data:Partial<Permission>) {
        this.id = data.id!
        this.resource = data.resource!
        this.action = data.action!
    }

    toRow() {
        return {
            id: this.id,
            resource: this.resource,
            action: this.action,

        }
    }
    static toEntity(row:any) {
        return new Permission(row);
    }
}