/** Media-kind sniffing shared by server pages and the client player. */
export const AUDIO_RE = /\.(mp3|m4a|ogg|wav)$/i

export function isAudioPath(path: string) {
  return AUDIO_RE.test(path)
}
