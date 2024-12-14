import { useState } from 'react'
import { Container, Title, Stack, Text } from '@mantine/core'
import VoiceRecorder from './components/VoiceRecorder'
import OutputSection from './components/OutputSection'
import { processWithAI } from './services/ai'

export default function App() {
  const [transcription, setTranscription] = useState('')
  const [summary, setSummary] = useState('')
  const [actions, setActions] = useState('')
  const [email, setEmail] = useState('')
  const apiKey = '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'

  const processTranscription = async (text) => {
    setTranscription(text)
    try {
      const result = await processWithAI(text, apiKey)
      setSummary(result.summary)
      setActions(result.actions)
      setEmail(result.email)
    } catch (error) {
      console.error('Error processing with AI:', error)
      alert('Failed to process with AI. Please try again.')
    }
  }

  const handleCopy = () => {
    // Add any notification or feedback here
  }

  return (
    <Container size="md" py="xl">
      <Stack spacing="xl">
        <Title order={1}>Voice Processing App</Title>
        <Text c="dimmed">
          Record your thoughts and let AI help organize them into actionable items
        </Text>

        <VoiceRecorder onTranscriptionComplete={processTranscription} />

        {transcription && (
          <>
            <OutputSection
              title="Transcription"
              content={transcription}
              onCopy={handleCopy}
              onEdit={setTranscription}
            />
            <OutputSection
              title="Summary"
              content={summary}
              onCopy={handleCopy}
              onEdit={setSummary}
            />
            <OutputSection
              title="Action Items"
              content={actions}
              onCopy={handleCopy}
              onEdit={setActions}
            />
            <OutputSection
              title="Email Draft"
              content={email}
              onCopy={handleCopy}
              onEdit={setEmail}
            />
          </>
        )}
      </Stack>
    </Container>
  )
}
