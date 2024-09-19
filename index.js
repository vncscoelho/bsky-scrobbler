import { AtpAgent } from "@atproto/api";

const BSKY_IDENTIFIER = process.env.BSKY_IDENTIFIER;
const BSKY_PASSWORD = process.env.BSKY_PASSWORD;
const LASTFM_USER = process.env.LASTFM_USER;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

try {
  const agent = new AtpAgent({ service: "https://bsky.social" });

  await agent.login({
    identifier: BSKY_IDENTIFIER,
    password: BSKY_PASSWORD,
  });

  setInterval(track, 1000 * 60 * 2);
} catch (e) {
  console.log(e);
}

async function track() {
  const nowPlaying = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json`
  ).then(({ recenttracks }) => {
    const current = recenttracks.track.find((t) => t?.["@attr"].nowplaying);

    return current
      ? `🎧 ${current.artist["#text"]} - ${current.name}`
      : "viniciuscoelho.com";
  });

  console.log("Tracking: " + nowPlaying);

  await agent.upsertProfile((existingProfile) => {
    console.warn(existingProfile);

    existingProfile.description = nowPlaying;

    return existingProfile;
  });
}
