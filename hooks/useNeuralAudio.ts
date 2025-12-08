
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useRef, useState, useEffect } from 'react';

export const useNeuralAudio = () => {
    const audioCtx = useRef<AudioContext | null>(null);
    const gainNode = useRef<GainNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.15);

    const toggleAudio = () => {
        if (isPlaying) {
            gainNode.current?.disconnect();
            audioCtx.current?.close();
            audioCtx.current = null;
            setIsPlaying(false);
        } else {
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            audioCtx.current = new Ctx();
            
            // Create Brown Noise Buffer
            const bufferSize = 4096;
            const brownNoise = (function() {
                var lastOut = 0;
                var node = audioCtx.current!.createScriptProcessor(bufferSize, 1, 1);
                node.onaudioprocess = function(e) {
                    var output = e.outputBuffer.getChannelData(0);
                    for (var i = 0; i < bufferSize; i++) {
                        var white = Math.random() * 2 - 1;
                        output[i] = (lastOut + (0.02 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.5; // Compensate for gain
                    }
                };
                return node;
            })();

            gainNode.current = audioCtx.current.createGain();
            gainNode.current.gain.value = volume;
            
            brownNoise.connect(gainNode.current);
            gainNode.current.connect(audioCtx.current.destination);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if(gainNode.current) {
            gainNode.current.gain.value = volume;
        }
    }, [volume]);

    return { isPlaying, toggleAudio, volume, setVolume };
};
