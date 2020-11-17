import { randomArrayItem, randomInt } from "./random";
import { createAudioBufferSourceNode } from "./audio";

export async function playDropSound() {
  try {
    const source = randomArrayItem([
      await createAudioBufferSourceNode('./audio/drop_002.ogg'),
      await createAudioBufferSourceNode('./audio/drop_003.ogg'),
    ])
    source.detune.value = randomInt(-1, 2) * 100;
    source.start();
  } catch (error) { }
}

export async function playErrorSound() {
  try {
    const source = await createAudioBufferSourceNode('./audio/error_004.ogg');
    if (source.detune) {
      source.detune.value = randomInt(-1, 2) * 100;
    }
    source.start();

  } catch (error) { }
}

export function playMaximizeSound() {
  const audio = new Audio('./audio/maximize_006.ogg');
  audio.volume = 0.5;

  return audio.play();
}

export function playMinimizeSound() {
  const audio = new Audio('./audio/minimize_006.ogg');
  audio.volume = 0.5;

  return audio.play();
}