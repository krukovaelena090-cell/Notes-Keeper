import React from 'react'
import { Div } from '@vkontakte/vkui'
import { NoteCard } from './NoteCard'
interface Note {
  id: string
  title: string
  content: string
  created_at: Date
}

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <Div style={{ textAlign: 'center', padding: 20 }}>
        Нет записей. Создайте первую запись!
      </Div>
    )
  }

  return (
    <Div>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Div>
  )
}

export { NoteList }