import { Client } from "./../client/client.ts";

export class Base {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
