const CHANNEL_ID = "UC0GcuqyFmqg5VaWPZzZx9SQ";

export default async function () {
  try {
    const rssUrl =
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 AEVRNN-Website"
      }
    });

    if (!response.ok) {
      throw new Error(`YouTube RSS returned ${response.status}`);
    }

    const xml = await response.text();

    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .slice(0, 6)
      .map(match => {
        const entry = match[1];

        const get = tag => {
          const m = entry.match(
            new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
          );
          return m ? m[1].trim() : "";
        };

        const videoId = get("yt:videoId");
        const title = get("title")
          .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");

        const published = get("published");

        return {
          id: videoId,
          title,
          published,
          thumbnail:
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url:
            `https://www.youtube.com/watch?v=${videoId}`
        };
      })
      .filter(video => video.id);

    return new Response(
      JSON.stringify({
        success: true,
        channel: "@aevrnnvfx",
        videos: entries
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=900, s-maxage=900"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
