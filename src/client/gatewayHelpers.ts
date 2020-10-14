import { Message } from "./../structures/message.ts"

type IntentObjectsType = { [index: string]: any }

const IntentObjects: IntentObjectsType = {
    "MESSAGE_CREATE": Message
}

export { IntentObjects }