# twitch-ext-emotes
Library to fetch emotes from BetterTTV, FrankerFacez, and 7TV, and parse chat messages with them.

The primary goal of this library is to parse a text chat into html with images by checking global and chananel-specific external emotes, therefore it only deals with emotes by these "external" providers.

This approach would not work well for Twitch-provided emotes for two reasons.

1. Twitch already includes its emote data in the chat messages as IRC tags or JSON objects. No need to do additional fetch.
2. Twitch has a more fine-grained permission level for emotes, so the exact same text chat in the same channel may be rendered differently per chatter.

## Install
In package.json
```javascript
"dependencies" {
  // No npm package is published yet, directly add the Git address as dependency.
  "twitch-ext-emotes": "https://github.com/c-rainbow/twitch-emotes.git",
}
```

## Use
```typescript
import { EmoteManager } from 'twitch-ext-emotes';

const manager = new EmoteManager();

/**
 * emote looks like
 * {
 *   source: 'bttv',
 *   id: '55b6f480e66682f576dd94f5',
 *   text: 'Clap',
 *   url: 'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/1x'
 * }
 */
 const emote = await manager.getEmote('149747285', 'Clap');  // 149747285 is channel ID of TwitchPresents.
 
 // noEmote is undefined
 const noEmote = await manager.getEmote('149747285', 'noSuchEmote');

```
