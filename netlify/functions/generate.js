exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "OK" };

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
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
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

    const text = data?.content?.[0]?.text || "No response text found";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: text })
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: "System Error: " + err.message })
    };
  }
};
