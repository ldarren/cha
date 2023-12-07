import { defineMock } from 'vite-plugin-mock-dev-server'

const APIP_URL = `${import.meta.env.VITE_APIP_ORIGIN}/authentication-service/v2`
const APIP_KEY = import.meta.env.VITE_APIP_KEY!
const APIP_SECRET = import.meta.env.VITE_APIP_SECRET!
const Authorization = `Basic ${Buffer.from(
  `${APIP_KEY}:${APIP_SECRET}`,
  "ascii",
).toString("base64")}`
const headers = {
  Authorization,
  "Content-Type": "application/x-www-form-urlencoded",
}
const formBody = (body: Record<string, string>) => {
  const form = []
  for (const key in body) {
    form.push(`${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
  }
  return form.join("&")
}

export default defineMock([{
  url: '/api/users/authorize',
  method: 'GET',
  async response(_req, res){
    const ret = await fetch(
      `${APIP_URL}/authorize?${new URLSearchParams({
        response_type: "code",
        client_id: APIP_KEY,
        login_method: "form",
      })}`,
      {
        redirect: "manual",
      },
    )
    if (ret.status === 302) {
      console.info("#####", ret.type, ret.headers.get("location"))
      res.statusCode = 302
      res.setHeader('Location', ret.headers.get("location") || '')
      res.end()
      return
    }
    console.info(ret)
    res.statusCode = 400
    res.end()
  }
}, {
  url: '/api/users/token',
  method: 'POST',
  type: 'json',
  async response(req, res){
    console.info(req.body, formBody(req.body), headers)
    const ret = await fetch(`${APIP_URL}/token`, {
      method: "POST",
      headers,
      body: formBody(req.body),
    })
    const token = await ret.json()
    console.info("token###", token)
    res.end(JSON.stringify(token))
  }
}, {
  url: '/api/users/info',
  method: 'GET',
  async response(_req, res){
    res.end(JSON.stringify({
      divisionName: "Info Technolog",
      divisionId: "Z004",
    }))
  }
}, {
  url: '/api/users/photo',
  method: 'GET',
  async response(_req, res){
    res.statusCode = 404
    res.end(JSON.stringify({
      details: "Photo not found.",
      error: "Not Found.",
    }))
  }
}])