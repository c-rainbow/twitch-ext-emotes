import { EmoteManager } from "./manager";
import { ChatFragment, TwitchEmote, TwitchEmoteTags } from './types';


function populuateTwitchEmotesFromTags(
    message: string, twitchEmoteTags: TwitchEmoteTags): Map<string, TwitchEmote> {
  const twitchEmotes = new Map<string, TwitchEmote>();  // name to ID
  for(const [emoteId, ranges] of Object.entries(twitchEmoteTags)) {
    const splitted = ranges[0].split('-');
    const startIndex = parseInt(splitted[0]);
    const endIndex = parseInt(splitted[1]);
    const name = message.substring(startIndex, endIndex + 1);

    twitchEmotes.set(name, {
      source: 'twitch',
      id: emoteId,
      text: name,
      url: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1`
    });
  }

  return twitchEmotes;
}


export class EmoteParser {
  private _manager: EmoteManager;

  constructor() {
    this._manager = new EmoteManager();
  }

  async parse(
      channelId: string, message: string, emoteTags: TwitchEmoteTags = {}): Promise<ChatFragment[]> {
    // Parse twitch emotes first
    const twitchEmotes = populuateTwitchEmotesFromTags(message, emoteTags);

    // Split and sanitize texts.
    // This is an additional safety check. Twitch already trims extra spaces in the message.
    const words = message.split(' ').map(word => word.trim()).filter(word => word !== '');

    const fragments: ChatFragment[] = [];
    let tempWords: string[] = [];
    for (const word of words) {
      const emote = twitchEmotes.get(word) || await this._manager.getEmote(channelId, word);
      // If the word is an emote, the previous non-emote words should be a text in a fragment.
      if (emote) {
        // Clear tempWords array
        const prevText = tempWords.join(' ');
        tempWords = [];

        fragments.push({text: prevText});
        fragments.push({text: word, emote});
      }
      // Otherwise, keep adding to the text buffer.
      else {
        tempWords.push(word);
      }
    }
    if (tempWords.length) {
      fragments.push({text: tempWords.join(' ')});
    }

    return fragments;
  }
}
