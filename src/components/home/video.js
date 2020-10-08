import React, { useState, useEffect } from 'react'

export function useUserMedia(requestedMedia) {

    const [mediaStream, setMediaStream] = useState(null)

    useEffect(() => {
        async function enableStream() {
            const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
            setMediaStream(stream)
        }

        if (!mediaStream) {
            enableStream()
        }
        else {
            return function cleanup() {
                mediaStream.getTracks.forEach(track => { track.stop() })
            }
        }
    }, [mediaStream, requestedMedia])

    return mediaStream

}