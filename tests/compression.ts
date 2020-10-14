import { inflate, deflate } from "https://deno.land/x/denoflate/mod.ts";
let textEncoder = new TextEncoder();
let textDecoder = new TextDecoder("utf-8");
let data = textDecoder.decode(deflate(textEncoder.encode("h")))
if (data.endsWith('\x00\x00\xff\xff')) {
    data = textDecoder.decode(inflate(textEncoder.encode(data.toString())))
}
console.log(data)