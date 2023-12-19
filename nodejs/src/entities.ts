import { request } from "http";
import NewClient, {IClientResponse} from "./client";

class Entitlement {
    private client: NewClient;
    private entityId: string;
    private entitlementId: string;

    constructor(client: NewClient, entityId: string, entitlementId: string) {
        this.client = client;
        this.entityId = entityId;
        this.entitlementId = entitlementId;
    }

    private checkPayloadEntitlementType(entitlement: string | string[]) {
        if(typeof entitlement === "string") {
            return [entitlement]
        }
        return entitlement
    }

    async Has(entitlement: string | string[]): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}/entitlements/${this.entitlementId}/check`, "POST", {
            entitlements: this.checkPayloadEntitlementType(entitlement)
        })
        return Request
    }
    async Create(entitlement: string | string[]): Promise<IClientResponse> {
        return this.Set(entitlement)
    }
    async Set(entitlement: string | string[]): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}/modify/entitlements`, "PATCH", {
            entitlement_id: String(this.entitlementId),
            entitlements: this.checkPayloadEntitlementType(entitlement),
            operation: "set"
        })
        return Request
    }
    async Add(entitlement: string | string[]): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}/modify/entitlements`, "PATCH", {
            entitlement_id: String(this.entitlementId),
            entitlements: this.checkPayloadEntitlementType(entitlement),
            operation: "add"
        })
        return Request
    }
    async Remove(entitlement: string | string[]): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}/modify/entitlements`, "PATCH", {
            entitlement_id: String(this.entitlementId),
            entitlements: this.checkPayloadEntitlementType(entitlement),
            operation: "remove"
        })
        return Request
    }
}

export default class Entities {
    private client: NewClient;
    private entityId: string;

    constructor(client: NewClient, entityId: string) {
        this.client = client;
        this.entityId = entityId;
    }

    Entitlement(entitlementId: string): Entitlement {
        return new Entitlement(this.client, this.entityId, entitlementId);
    }

    async Create(referenceId: string): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/create`, "POST", {
            reference_id: String(referenceId)
        })
        return Request 
    }
        
    async Get(): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}`, "GET")
        return Request
    }

    async Delete(): Promise<IClientResponse> {
        const Request = await this.client.MakeRequest(`/teams/${this.client.config.team_id}/entities/${this.entityId}`, "DELETE")
        return Request
    } 

}