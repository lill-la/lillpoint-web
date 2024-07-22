function strToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

  return parseInt(hex, 16);
}

const webhookUrl = "https://discord.com/api/webhooks/1264905598198218905/l95h9qgUWrP9mI2qTDmITLEuyFgUtvntFj-Wa-IwvcVehF_JKsxe5FXcXL4e42z2k_ty";

export async function sendDiscordMessage(
  title: string,
  fullUrl: string,
  id: string,
  name: string,
  point: string,
  first: string,
  last: string,
  sign: string,
  valid: boolean,
){
  const payload = JSON.stringify({
    content: null,
    embeds: [{
      title: title,
      description: fullUrl,
      color: strToColor(name),
      fields: [
        {
          name: "id",
          value: id,
        },
        {
          name: "name",
          value: name,
        },
        {
          name: "point",
          value: point,
        },
        {
          name: "first",
          value: first,
        },
        {
          name: "last",
          value: last,
        },
        {
          name: "sign",
          value: sign,
        },
        {
          name: "valid",
          value: valid ? "true" : "false",
        }
      ]
    }],
  });

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  });
}
