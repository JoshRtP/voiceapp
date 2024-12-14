import { useState } from 'react'
import { Container, Title, Stack, Textarea, Button, Text, LoadingOverlay } from '@mantine/core'
import VoiceRecorder from './components/VoiceRecorder'
import { processWithGPT4 } from './services/ai'

export default function App() {
  const [transcription, setTranscription] = useState('')
  const [summary, setSummary] = useState('')
  const [actions, setActions] = useState('')
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleTranscriptionComplete = async (text, apiKey) => {
    setTranscription(text)
    setIsProcessing(true)
    setError(null)

    try {
      const result = await processWithGPT4(text, apiKey)
      setSummary(result.summary || '')
      setActions(result.actions || '')
      setEmail(result.email || '')
    } catch (err) {
      setError('Failed to process transcript: ' + err.message)
      console.error('Processing error:', err)
      // Set empty strings to clear any previous content
      setSummary('')
      setActions('')
      setEmail('')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  return (
    <Container size="md" py="xl">
      <LoadingOverlay visible={isProcessing} />
      <Stack spacing="xl">
        <Title order={1}>Voice Processing App</Title>
        
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        
        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        <Stack spacing="md">
          <Text fw={700}>Raw Transcription:</Text>
          <Textarea
            value={transcription}
            readOnly
            minRows={4}
            autosize
          />
          <Button onClick={() => copyToClipboard(transcription)}>
            Copy Transcription
          </Button>
        </Stack>

        {transcription && (
          <>
            <Stack spacing="md">
              <Text fw={700}>Executive Summary:</Text>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                minRows={4}
                autosize
                placeholder="Processing summary..."
              />
              <Button onClick={() => copyToClipboard(summary)}>
                Copy Summary
              </Button>
            </Stack>

            <Stack spacing="md">
              <Text fw={700}>Action Items:</Text>
              <Textarea
                value={actions}
                onChange={(e) => setActions(e.target.value)}
                minRows={4}
                autosize
                placeholder="Processing actions..."
              />
              <Button onClick={() => copyToClipboard(actions)}>
                Copy Actions
              </Button>
            </Stack>

            <Stack spacing="md">
              <Text fw={700}>Email Draft:</Text>
              <Textarea
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                minRows={4}
                autosize
                placeholder="Processing email draft..."
              />
              <Button onClick={() => copyToClipboard(email)}>
                Copy Email
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  )
}
