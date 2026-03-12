import React, { useState, useEffect } from 'react'
import { Group, FormItem, Input, Textarea, Button, ButtonGroup } from '@vkontakte/vkui'

interface Note {
  id: string
  title: string
  content: string
  created_at: Date
}

interface NoteFormProps {
  note: Note | null
  onSave: (title: string, content: string) => void
  onClose: () => void
}

export const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onSave(title, content)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <FormItem top="Заголовок">
          <Input
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Введите заголовок"
          />
        </FormItem>
        <FormItem top="Содержание">
          <Textarea
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
            placeholder="Введите текст записи"
            rows={5}
          />
        </FormItem>
        <FormItem>
          <ButtonGroup mode="horizontal" gap="m" stretched>
            <Button type="submit" size="l" stretched>
              Сохранить
            </Button>
            <Button size="l" mode="secondary" onClick={onClose} stretched>
              Отмена
            </Button>
          </ButtonGroup>
        </FormItem>
      </Group>
    </form>
  )
}