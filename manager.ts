import { Emote } from "./types";
import { EmoteFetcher } from "./fetcher";




export class EmoteManager {
  private _fetcher: EmoteFetcher;

  // For now, use one repository for all sources of emotes. This design decision may change later.
  private _globalEmotes: Map<string, Emote>;  // emote name to emote object.
  private _channelEmotes: Map<string, Map<string, Emote>>;  // Numeric channel ID to emotes
  private _isGlobalEmotesPopulated: boolean;

  constructor() {
    this._fetcher = new EmoteFetcher();
    this._globalEmotes = new Map<string, Emote>();
    this._channelEmotes = new Map<string, Map<string, Emote>>();
    this._isGlobalEmotesPopulated = false;
  }

  async getEmote(channelId: string, word: string): Promise<Emote | undefined> {
    // First, check for the global emote.
    if (!this._isGlobalEmotesPopulated) {
      await this._populateGlobalEmotes();
    }
    if (this._globalEmotes.has(word)) {
      return this._globalEmotes.get(word);
    }

    // Next, check for the channel emotes from various sources
    if (!this._isPopulated(channelId)) {
      await this._populateEmotes(channelId);
    }
    return this._channelEmotes.get(channelId)?.get(word);
  }

  private async _populateGlobalEmotes() {
    if (this._isGlobalEmotesPopulated) {
      return;
    }
    this._isGlobalEmotesPopulated = true;

    const bttvGlobalEmotes = await this._fetcher.fetchBttvGlobalEmotes();
    const ffzGlobalEmotes = await this._fetcher.fetchFfzGlobalEmotes();
    const sevenTvGlobalEmotes = await this._fetcher.fetch7tvGlobalEmotes();

    bttvGlobalEmotes.forEach(emote => {
      this._globalEmotes.set(emote.text, emote);
    });
    ffzGlobalEmotes.forEach(emote => {
      this._globalEmotes.set(emote.text, emote);
    });
    sevenTvGlobalEmotes.forEach(emote => {
      this._globalEmotes.set(emote.text, emote);
    })
  }

  private async _populateEmotes(channelId: string) {
    if (this._isPopulated(channelId)) {
      return;
    }
    const emoteMap = new Map<string, Emote>();
    this._channelEmotes.set(channelId, emoteMap);

    const bttvEmotes = await this._fetcher.fetchBttvEmotes(channelId);
    const ffzEmotes = await this._fetcher.fetchFfzEmotes(channelId);
    const sevenTvEmotes = await this._fetcher.fetch7tvEmotes(channelId);
    console.log('test')

    bttvEmotes.forEach(emote => {
      emoteMap.set(emote.text, emote);
    });
    ffzEmotes.forEach(emote => {
      emoteMap.set(emote.text, emote);
    });
    sevenTvEmotes.forEach(emote => {
      emoteMap.set(emote.text, emote);
    })
  }

  private _isPopulated(channelId: string): boolean {
    // TODO: add expiration time
    return this._channelEmotes.has(channelId);
  }
}
