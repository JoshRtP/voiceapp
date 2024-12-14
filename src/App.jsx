import { useState } from 'react'
import { Container, Title, Stack, Textarea, Button, Text, LoadingOverlay, Paper } from '@mantine/core'
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
    <Container size="lg" py="xl">
      <LoadingOverlay visible={isProcessing} />
      <Stack spacing="xl">
        <Title order={1}>Voice Processing App</Title>
        
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        
        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        {transcription && (
          <>
            <Paper shadow="xs" p="md" withBorder>
              <Stack spacing="md">
                <Text fw={700} size="lg">Raw Transcription:</Text>
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
            </Paper>

            <Paper shadow="xs" p="md" withBorder>
              <Stack spacing="md">
                <Text fw={700} size="lg">Executive Summary:</Text>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  minRows={4}
                  autosize
                  placeholder={isProcessing ? "Processing summary..." : "Summary will appear here"}
                />
                <Button onClick={() => copyToClipboard(summary)}>
                  Copy Summary
                </Button>
              </Stack>
            </Paper>

            <Paper shadow="xs" p="md" withBorder>
              <Stack spacing="md">
                <Text fw={700} size="lg">Action Items:</Text>
                <Textarea
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  minRows={4}
                  autosize
                  placeholder={isProcessing ? "Processing actions..." : "Action items will appear here"}
                />
                <Button onClick={() => copyToClipboard(actions)}>
                  Copy Actions
                </Button>
              </Stack>
            </Paper>

            <Paper shadow="xs" p="md" withBorder>
              <Stack spacing="md">
                <Text fw={700} size="lg">Email Draft:</Text>
                <Textarea
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  minRows={4}
                  autosize
                  placeholder={isProcessing ? "Processing email draft..." : "Email draft will appear here"}
                />
                <Button onClick={() => copyToClipboard(email)}>
                  Copy Email
                </Button>
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </Container>
  )
}
