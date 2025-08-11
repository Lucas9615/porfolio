// Utilisation du fetch natif de Node.js 18+

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const siteUrl = process.env.URL; // URL fournie par Netlify

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code not provided.' }),
    };
  }

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set.' }),
    };
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: data.error_description || 'Unknown error' }),
      };
    }

    const script = `
      <script>
        (function() {
          const message = {
            token: "${data.access_token}",
            provider: "github"
          };

          const sendMessage = () => {
            // Le message doit être un objet stringifié pour Decap CMS
            const messageString = "authorization:github:success:" + JSON.stringify(message);
            
            // Tenter de communiquer avec la fenêtre parente (opener)
            if (window.opener) {
              window.opener.postMessage(messageString, "${siteUrl}");
            } else {
              console.error("No opener window found to post message to.");
            }
          };

          // Envoyer un message pour indiquer que la fenêtre est prête
          // et que l'authentification peut commencer
          if (window.opener) {
             window.opener.postMessage("authorizing:github", "${siteUrl}");
          }
          
          // Laisser le temps à l'application principale de s'initialiser
          setTimeout(sendMessage, 500);

          // Sécurité : fermer la fenêtre après un court délai
          setTimeout(() => window.close(), 2000);
        })();
      </script>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html><html><head><title>Authenticating...</title></head><body>${script}</body></html>`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error during authentication.' }),
    };
  }
}; 