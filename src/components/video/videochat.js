import React, { useEffect, useRef } from 'react'
import io from 'socket.io-client'

let socket = io('http://localhost:3001')

export default function VideoChat(props) {

    const videoRef = useRef()

    useEffect(() => {
        makeCall()
    }, [])

    async function makeCall() {

        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        const peerConnection = new RTCPeerConnection(configuration);
        const remoteStream = new MediaStream();

        peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
                console.log('sending ice candidate')
                socket.emit('new-ice-candidate', event.candidate);
            }
        });
        peerConnection.addEventListener('connectionstatechange', event => {
            if (peerConnection.connectionState === 'connected') {
                console.log('peers connected')
                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
            }
        });
        peerConnection.addEventListener('track', async (event) => {
            remoteStream.addTrack(event.track, remoteStream);
        });

        socket.on('ice-candidate', async message => {
            if (message.iceCandidate) {
                try {
                    await peerConnection.addIceCandidate(message.iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });
        socket.on('answer', async message => {
            if (message.answer) {
                console.log('recieved an answer')
                const remoteDesc = new RTCSessionDescription(message.answer);
                await peerConnection.setRemoteDescription(remoteDesc);
            }
            else {
                console.log('no answer')
            }
        });
        socket.on('offer', async message => {
            if (message.offer) {
                console.log('recieved offer')
                peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('answer', answer)
            }
            else {
                console.log('no offer')
            }
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);

        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: "environment" },
        });

        videoRef.current.srcObject = remoteStream;


    }

    return (
        <div>
            <div>
                VideoChat
            </div>
            <div>
                <video ref={videoRef} autoPlay playsInline controls={false} mute />
            </div>
        </div>
    )
}