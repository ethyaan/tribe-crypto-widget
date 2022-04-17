import { TribeClient } from "@tribeplatform/gql-client";
import { CLIENT_ID, CLIENT_SECRET, GRAPHQL_URL, NETWORK_ID, MEMBER_ID } from "@config";


class GqlClient {
    client: TribeClient;

    constructor() {
        if (!this.client) {
            this.initiate();
        }
    }

    /**
     * initiate graphql connection setup & token
     */
    private async initiate() {
        let client = new TribeClient({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            graphqlUrl: GRAPHQL_URL,
        });
        let token = await this.generateToken();
        client.setToken(token);
        this.client = client;
    }

    /**
     * generate token and return a promise
     */
    private async generateToken() {
        return this.client.generateToken({
            networkId: NETWORK_ID,
            memberId: MEMBER_ID,
        })
    }

    /**
     * get client as Singleton
     */
    public async getClient() {
        if (!this.client) {
            await this.initiate();
        }
        return this.client;
    }
}

export const gClient = new GqlClient();