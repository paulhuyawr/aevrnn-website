export default async (req, context) => {
  const channelId = "UC0GcuqyFmqg5VaWPZzZx9SQ";

  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "YouTube feed failed" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const xml = await response.text();

    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .slice(0, 6)
      .map(match => {
        const item = match[1];

        const get = tag => {
          const m = item.match(
            new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
          );
          return m ? m[1].trim() : "";
        };

        const videoId = get("yt:videoId");
        const title = get("title");
        const published = get("published");

        return {
          videoId,
          title,
          published,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        };
      })
      .filter(video => video.videoId);

    return new Response(JSON.stringify({ videos: entries }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300"
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to load YouTube feed"
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" }
      }
    );
  }
};
