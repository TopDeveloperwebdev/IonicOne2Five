/* Just for code completion and compilation - defines
 * the interface of objects stored in the emails table.
 */
export interface IEmailAddress {
    id?: number;
    contactId: number;
    type: string;
    email: string;
}

/* Just for code completion and compilation - defines
 * the interface of objects stored in the phones table.
 */
export interface IPhoneNumber {
    id?: number;
    contactId: number;
    type: string;
    phone: string;
}

/* This is a 'physical' class that is mapped to
 * the contacts table. We can have methods on it that
 * we could call on retrieved database objects.
 */
export class Contact {
    id: number;
    firstName: string;
    lastName: string;
    emails: IEmailAddress[];
    phones: IPhoneNumber[];
    
    constructor(first: string, last: string, id?:number) {
        this.firstName = first;
        this.lastName = last;
        if (id) this.id = id;
        // Define navigation properties.
        // Making them non-enumerable will prevent them from being handled by indexedDB
        // when doing put() or add().
        Object.defineProperties(this, {
            emails: { value: [], enumerable: false, writable: true },
            phones: { value: [], enumerable: false, writable: true }
        });
    }
}
