/*
 * V2RAY Worker v2.0
 * Copyright 2023 Vahid Farid (https://twitter.com/vahidfarid)
 * Licensed under GPLv3 (https://github.com/vfarid/v2ray-worker/blob/main/Licence.md)
 */

import { VlessOverWSHandler } from "./vless"
import { GetPanel, PostPanel } from "./panel"
import { GetConfigList } from "./collector"
import { ToYamlSubscription } from "./clash"
import { ToBase64Subscription } from "./sub"
import { Env, Config } from "./interfaces"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url: URL = new URL(request.url)
    const path: string = url.pathname.replace(/^\/|\/$/g, "")
    const outputType = path.toLowerCase()
    if (["sub", "clash"].includes(outputType)) {
      const configList: Array<Config> = await GetConfigList(url, env)
      // console.log(JSON.stringify(configList))
      if (outputType == 'clash') {
        return new Response(ToYamlSubscription(configList));
      } else {
        return new Response(ToBase64Subscription(configList));
      }
    } else if (outputType == 'vless-ws') {
      return VlessOverWSHandler(request, env);
    } else if (path) {
      return fetch(new Request(new URL("https://" + path), request))
    } else if (request.method === 'GET') {
      return GetPanel(request, env)
    } else if (request.method === 'POST') {
      return PostPanel(request, env)
    } else {
      return new Response('Invalid request!');
    }
  }
}
