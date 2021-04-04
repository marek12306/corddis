import { Evt } from "../deps.ts"
import { Gateway } from "./client/gateway.ts";
import { User } from './structures/user.ts';

export const Events = new Evt<
    ["DEBUG", string] |
    ["READY", User] |
    ["RAW", string, Gateway]
>()