exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
 
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }
 
  try {
    const body = JSON.parse(event.body);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        system: "You are a JSON generator. You must respond with ONLY valid JSON. No explanation, no markdown, no backticks, no commentary. Just raw JSON.",
        messages: [{ role: "user", content: body.prompt }]
      })
    });
 
    const data = await response.json();
 
    if (data.error) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ content: "AI Error: " + data.error.message })
      };
    }
 
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: data.content[0].text })
    };
 
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: "System Error: " + err.message })
    };
  }
};
