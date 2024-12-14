import { useState } from 'react'
import { Container, Title, Stack, Textarea } from '@mantine/core'
import VoiceRecorder from './components/VoiceRecorder'

export default function App() {
  const [transcription, setTranscription] = useState('')

  const handleTranscriptionComplete = (text) => {
    setTranscription(text)
  }

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Title order={1}>Voice Processing App</Title>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        <Textarea
          label="Transcription Output"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          minRows={4}
          autosize
        />
      </Stack>
    </Container>
  )
}
