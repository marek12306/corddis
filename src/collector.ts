import { EventEmitter } from "../deps.ts";
import { Client } from "../mod.ts";

export interface CollectorOptions {
    max?: Number
}

export class Collector<T> extends EventEmitter {
    collected: T[] = [];
    id: number;
    event: string;
    optionsBase: CollectorOptions;
    working: boolean;
    listener: (event: T) => boolean;
    client: Client;

    constructor(event: string, client: Client, id: number, listener: (entity: T) => boolean, options: CollectorOptions = {}) {
        super();
        this.event = event;
        this.optionsBase = options;
        this.listener = listener;
        this.working = true;
        this.client = client;
        this.id = id;
    }

    get options(): CollectorOptions {
        return { max: this.optionsBase.max ?? -1 }
    }


    collect(...data: T[]) {
        let max = this.options?.max || -1
        let filteredArr = [...data].filter(this.listener)
        let matchesFilter = filteredArr.length > 0;
        let matchesLength = max == -1 || this.collected.length <= max;

        if (matchesFilter && matchesLength && this.working) {
            this.collected.push(...filteredArr)
            filteredArr.forEach(entity => {
                this.emit("collect", entity)
            })
        }

        if (max != -1 && this.working && this.collected.length >= max) this.end()
    }

    end() {
        this.working = false;
        this.client.removeCollector(this.id, true);
        this.emit("end", this.collected);
    }
}