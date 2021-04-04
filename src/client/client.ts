import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { CacheEnum, CacheType, EntityType, ErrorType, GetGatewayType, Snowflake } from "./../types/utils.ts";
import { Constants } from "./../constants.ts"
import { Me } from "./me.ts";
import { UserType, StatusType } from "./../types/user.ts"
import { GuildType, InviteType } from "./../types/guild.ts"
import { Invite } from "../structures/invite.ts";
import { Gateway } from "./gateway.ts";
import { ApplicationCommandRootType } from "../types/commands.ts"
import { Collector } from "../collector.ts"
import Cache from "../cache.ts"
import { Events } from '../evt.ts'

/** Client which communicates with gateway and manages REST API communication. */
export class Client {
    token: string;
    user: User | null = null;
    gatewayData: GetGatewayType | undefined;
    intents: number[] = []
    sequenceNumber: number | null = null
    _heartbeatTime = -1
    cache: CacheType = {
        guilds: new Cache(500),
        messages: new Cache(500),
        users: new Cache(500),
        other: new Cache(500),
        invites: new Cache(500)
    }
    status: StatusType = { since: null, activities: null, status: "online", afk: false }
    ready = false
    lastReq = 0
    mobile = false
    shardsCount = 1
    shards: Gateway[] = []
    slashCommands: Map<Snowflake, ApplicationCommandRootType> = new Map()
    collectors_id = 0
    collectors: Collector<any>[] = []
    events = Events

    sleep = (t: number) => new Promise(reso => setTimeout(reso, t))

    constructor(token: string = "", ...intents: number[]) {
        this.token = token;
        this.intents = intents;
    }
    /**
     * Adds intents to client
     * @return current client instance
     */
    addIntents(...intent: number[]): Client {
        this.intents.push(...intent);
        return this
    }
    /**
     * Sets selected cache capacity to specifed value.
     * 0 is infinity, -1 and less disables cache entirely.
     */
    setCache(key: CacheEnum, value: number) {
        switch (key) {
            case CacheEnum.GUILDS: this.cache.guilds = value > -1 ? new Cache(value) : undefined; break
            case CacheEnum.INVITES: this.cache.invites = value > -1 ? new Cache(value) : undefined; break
            case CacheEnum.MESSAGES: this.cache.messages = value > -1 ? new Cache(value) : undefined; break
            case CacheEnum.OTHER: this.cache.other = value > -1 ? new Cache(value) : undefined; break
            case CacheEnum.USERS: this.cache.users = value > -1 ? new Cache(value) : undefined; break
        }
        return this
    }
    /** Sets number of shards to spawn. */
    setShards(shards: number) {
        if (shards < 1) throw Error("Must be 1 shard or more")
        this.shardsCount = shards
        return this
    }

    // deno-lint-ignore no-explicit-any
    async _fetch<T>(method: string, path: string, body: string | FormData | null = "", json = true, contentType: string | boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType

        var response = await this._performReq(`${Constants.BASE_URL}/v${Constants.VERSION}/${path}`, {
            method, body, headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": Constants.USER_AGENT,
                ...headers,
            },
        })
        if (response.status >= 400) throw Error((await response.json()).message)

        // deno-lint-ignore no-explicit-any
        let respJson: any
        if (json) {
            respJson = await response.json()
            if ((respJson as ErrorType).message) throw Error((respJson as ErrorType).message)
        } else if (response.status > 299 && response.status < 200) {
            throw Error(await response.text())
        }

        return json ? respJson : response;
    }

    async _performReq(path: string, req: RequestInit): Promise<Response> {
        var resp: Response;
        if (this.lastReq == 0 || (Date.now() - this.lastReq > 250)) {
            this.lastReq = Date.now();
            resp = await fetch(path, req)
        } else {
            await this.sleep(Date.now() - (this.lastReq + 250))
            this.lastReq = Date.now();
            resp = await fetch(path, req);
        }

        if (resp.status == 429) {
            const { retry_after } = await resp.json();
            this.events.post(["DEBUG", `Ratelimit, waiting ${retry_after}`])
            await this.sleep(retry_after ?? 0);
            this.lastReq = Date.now();
            resp = await this._performReq(path, req)
        }

        return resp
    }
    /** Logins with a certain token */
    async login(token: string = this.token): Promise<boolean> {
        if (token.length == 0) throw Error("Invalid token");
        this.gatewayData = await this._fetch<GetGatewayType>("GET", "gateway/bot", null, true)
        for (let i = 0; i < this.shardsCount; i++) {
            const gateway = new Gateway(this, [i, this.shardsCount])
            await gateway.login()
            this.shards.push(gateway)
        }
        return true
    }
    /** Sets game status to all shards. */
    async game(name: string): Promise<StatusType> {
        for (const shard of this.shards) await shard.game(name)
        return this.shards[0].status
    }
    /** Sets custom presence to all shards. */
    async setStatus(status: StatusType): Promise<StatusType> {
        for (const shard of this.shards) await shard.setStatus(status)
        return this.shards[0].status
    }
    /**
     * Fetches entities from Discord API
     *      client.get(EntityType.GUILD, "id") as Guild
     */
    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        switch (entity) {
            // deno-lint-ignore no-case-declarations
            case EntityType.GUILD:
                if (this.cache.guilds?.has(id)) return this.cache.guilds?.get(id) as Guild
                const guild = await this._fetch<GuildType>("GET", `guilds/${id}`, null, true)
                const guildObj = new Guild(guild, this)
                this.cache.guilds?.set(id, guildObj)
                return guildObj
            // deno-lint-ignore no-case-declarations
            case EntityType.USER:
                if (this.cache.users?.has(id)) return this.cache.users?.get(id) as User
                const user = await this._fetch<UserType>("GET", `users/${id}`, null, true)
                const userObj = new User(user, this)
                this.cache.users?.set(id, userObj)
                return userObj
            default:
                throw Error("Wrong EntityType")
        }
    }
    /** Gets current user as Me class */
    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        if (this.cache.users?.has("me")) return this.cache.users.get("me") as Me
        const user = await this._fetch<UserType>("GET", `users/@me`, null, true)
        const userObj = new Me(user, this)
        this.cache.users?.set("me", userObj)
        return userObj;
    }
    /** Fetches invite with a certain id */
    async fetchInvite(id: string): Promise<Invite> {
        if (this.cache.invites?.has(id)) return this.cache.invites.get(id) as Invite
        const invite = await this._fetch<InviteType>("GET", `invites/${id}?with_counts=true`, null, true)
        let guild
        if (invite.guild) guild = await this.get(EntityType.GUILD, invite.guild.id) as Guild
        const inviteObject = new Invite(invite, this, guild)
        this.cache.invites?.set(id, inviteObject)
        return inviteObject
    }
    /** Deletes a invite */
    async deleteInvite(id: string | Invite): Promise<InviteType> {
        if (id instanceof Invite) id = id.data.code
        if (this.cache.invites?.has(id)) this.cache.invites.delete(id)
        return this._fetch<InviteType>("DELETE", `invites/${id}`, null, true)
    }
    /** Registers a slash command. */
    async registerSlashCommand(command: ApplicationCommandRootType, guildID?: Snowflake) {
        return this._fetch<ApplicationCommandRootType>("POST", `applications/${this.user?.data.id}/${guildID ? `guilds/${guildID}/` : ""}commands`, JSON.stringify(command), true)
    }
    /** Overwrites a bunch of slash commands. */
    async registerOverwriteCommandBulk(command: ApplicationCommandRootType[], guildID?: Snowflake) {
        const response = await this._fetch<Response>("PUT", `applications/${this.user?.data.id}/${guildID ? `guilds/${guildID}/` : ""}commands`, JSON.stringify(command), true)
        return response.status == 204
    }
    /** Unregisters a slash command. */
    async unregisterSlashCommand(id: Snowflake, guildID?: Snowflake) {
        const response = await this._fetch<Response>("DELETE", `applications/${this.user?.data.id}/${guildID ? `guilds/${guildID}/` : ""}commands/${id}`, null, false)
        return response.status == 204
    }
    /** Fetches slash commands. */
    async fetchSlashCommands(guildID?: Snowflake): Promise<ApplicationCommandRootType[]> {
        if (!guildID && this.slashCommands.size > 0) return Array.from(this.slashCommands.values())
        const commands = await this._fetch<ApplicationCommandRootType[]>("GET", `applications/${this.user?.data.id}/${guildID ? `guilds/${guildID}/` : ""}commands`, null, true)
        if (!guildID) commands.forEach((data: ApplicationCommandRootType) => {
            if (data.id) this.slashCommands.set(data.id, data)
        })
        return commands
    }

    registerCollector<T>(collector: Collector<T>): Collector<T> {
        collector.id = ++this.collectors_id;
        this.collectors.push(collector);
        return collector;
    }

    removeCollector(id: number, done = false) {
        let temp = this.collectors.findIndex(it => it.id == id);
        if (temp > -1) {
            if (!done) this.collectors[temp].end();
            this.collectors.splice(temp);
        }
    }

    toString() {
        return `Client {"token":"${this.token}","user":{"data":${JSON.stringify(this.user?.data)}}}`
    }
}
