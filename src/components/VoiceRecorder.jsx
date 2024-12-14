import { useState, useRef } from 'react'
import { Button, Stack, Text } from '@mantine/core'
import { FaMicrophone, FaStop } from 'react-icons/fa'

export default function VoiceRecorder({ onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      })
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        onTranscriptionComplete("This is a test transcription of what was just recorded. In a real implementation, this would be the actual transcribed text from your voice recording. Please proceed with processing this text using the OpenRouter API.")
      }

      mediaRecorder.current.start(200)
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      if (err.name === 'NotAllowedError') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.')
      } else {
        setError(`Could not access microphone: ${err.message}`)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <Stack align="center" spacing="md">
      {error && <Text color="red">{error}</Text>}
      {!isRecording ? (
        <Button 
          leftSection={<FaMicrophone />}
          onClick={startRecording}
          color="blue"
          size="lg"
        >
          Start Recording
        </Button>
      ) : (
        <Button 
          leftSection={<FaStop />}
          onClick={stopRecording}
          color="red"
          size="lg"
        >
          Stop Recording
        </Button>
      )}
    </Stack>
  )
}
