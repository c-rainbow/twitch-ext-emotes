
export type EmoteSource = 'twitch' | 'bttv' | 'ffz' | '7tv';

export interface Emote {
  source: EmoteSource;  // From which emote provider?
  id: string;  // provider-specific unique ID 
  text: string;  //  text of the emote (ex: "BibleThump")
  url: string;  // Default URL of the emote pic
}

export interface TwitchEmote extends Emote {
  source: 'twitch';
}

export interface BttvEmote extends Emote {
  source: 'bttv';
}


export interface FfzEmote extends Emote {
  source: 'ffz';
}


export interface SevenTvEmote extends Emote {
  source: '7tv';
}


export interface TwitchEmoteTags {
  [emoteId: string]: [string]
}


export interface ChatFragment {
  text: string;
  emote?: Emote;
}
