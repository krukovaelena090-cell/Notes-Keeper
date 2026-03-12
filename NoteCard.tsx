import React from 'react'
import { Card, Div, Text, Title, ButtonGroup, Button, Subhead } from '@vkontakte/vkui'
import { Icon28DeleteOutline, Icon28EditOutline } from '@vkontakte/icons'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Note {
  id: string
  title: string
  content: string
  created_at: Date
}

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formattedDate = format(new Date(note.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })

  return (
    <Card mode="shadow" style={{ marginBottom: 12 }}>
      <Div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Title level="3" height="medium">{note.title}</Title>
          <Subhead style={{ color: 'var(--text_secondary)' }}>{formattedDate}</Subhead>
        </div>
        <Text style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>{note.content}</Text>
        <ButtonGroup mode="horizontal" gap="m" stretched>
          <Button 
            size="s" 
            mode="secondary" 
            before={<Icon28EditOutline />}
            onClick={() => onEdit(note)}
            stretched
          >
            Редактировать
          </Button>
          <Button 
            size="s" 
            mode="secondary" 
            appearance="negative"
            before={<Icon28DeleteOutline />}
            onClick={() => onDelete(note.id)}
            stretched
          >
            Удалить
          </Button>
        </ButtonGroup>
      </Div>
    </Card>
  )
}