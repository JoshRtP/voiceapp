import { useState } from 'react'
import { Container, Title, Stack, Textarea, Button, Text } from '@mantine/core'
import VoiceRecorder from './components/VoiceRecorder'

export default function App() {
  const [transcription, setTranscription] = useState('')
  const [summary, setSummary] = useState('')
  const [actions, setActions] = useState('')
  const [email, setEmail] = useState('')

  const handleTranscriptionComplete = (text) => {
    setTranscription(text)
    // Simulate processing the transcription to generate summary, actions, and email
    setSummary(`Summary of: ${text}`);
    setActions(`1. Action item based on: ${text}\n2. Another action item`);
    setEmail(`Dear [Recipient],\n\nThis is an email draft based on: ${text}`);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Title order={1}>Voice Processing App</Title>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />

        <Text>Transcription Output:</Text>
        <Textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          minRows={4}
          autosize
        />
        <Button onClick={() => copyToClipboard(transcription)}>Copy Transcription</Button>

        <Text>Summary:</Text>
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          minRows={4}
          autosize
        />
        <Button onClick={() => copyToClipboard(summary)}>Copy Summary</Button>

        <Text>Action Items:</Text>
        <Textarea
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          minRows={4}
          autosize
        />
        <Button onClick={() => copyToClipboard(actions)}>Copy Actions</Button>

        <Text>Email Draft:</Text>
        <Textarea
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          minRows={4}
          autosize
        />
        <Button onClick={() => copyToClipboard(email)}>Copy Email</Button>
      </Stack>
    </Container>
  )
}
