import { useState, useEffect } from 'react'
import {
  AdaptivityProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Group,
  Header,
  CellButton,
  Div,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Spinner
} from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css'
import { NoteList } from './components/NoteList'
import { NoteForm } from './components/NoteForm'
import { db } from './firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'

interface Note {
  id: string
  title: string
  content: string
  created_at: Date
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    bridge.send('VKWebAppGetUserInfo').then((data) => {
      setUserInfo(data)
    })
  }, [])

  // 🔥 СИНХРОНИЗАЦИЯ: читаем заметки из Firebase в реальном времени
  useEffect(() => {
    const notesCollection = collection(db, 'notes')
    const q = query(notesCollection, orderBy('created_at', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || '',
        content: doc.data().content || '',
        created_at: doc.data().created_at?.toDate() || new Date()
      }))
      setNotes(notesData)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // 📝 Сохранить (добавить или обновить)
  const handleSaveNote = async (title: string, content: string) => {
    try {
      const notesCollection = collection(db, 'notes')
      if (editingNote) {
        const noteRef = doc(db, 'notes', editingNote.id)
        await updateDoc(noteRef, { title, content })
        setEditingNote(null)
      } else {
        await addDoc(notesCollection, {
          title,
          content,
          created_at: new Date()
        })
      }
      setActiveModal(null)
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
      alert('Не удалось сохранить заметку. Проверьте интернет.')
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setActiveModal('note')
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id))
    } catch (error) {
      console.error('Ошибка при удалении:', error)
      alert('Не удалось удалить заметку.')
    }
  }

  const openCreateModal = () => {
    setEditingNote(null)
    setActiveModal('note')
  }

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
      <ModalPage
        id="note"
        header={
          <ModalPageHeader>
            {editingNote ? 'Редактировать запись' : 'Новая запись'}
          </ModalPageHeader>
        }
      >
        <NoteForm
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setActiveModal(null)}
        />
      </ModalPage>
    </ModalRoot>
  )

  if (isLoading) {
    return (
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <View activePanel="main">
                <Panel id="main">
                  <Div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Spinner />
                  </Div>
                </Panel>
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    )
  }

  return (
    <AdaptivityProvider>
      <AppRoot>
        <SplitLayout modal={modal}>
          <SplitCol>
            <View activePanel="main">
              <Panel id="main">
                <PanelHeader>Notes Keeper</PanelHeader>
                {userInfo && (
                  <Group>
                    <Div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={userInfo.photo_100}
                        alt="Avatar"
                        style={{ width: 48, height: 48, borderRadius: '50%' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {userInfo.first_name} {userInfo.last_name}
                        </div>
                        <div style={{ color: 'var(--text_secondary)' }}>Ваши записи</div>
                      </div>
                    </Div>
                  </Group>
                )}
                <Group header={<Header>Заметки</Header>}>
                  <CellButton onClick={openCreateModal}>Создать запись</CellButton>
                </Group>
                <Group>
                  <NoteList
                    notes={notes}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </Group>
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </AdaptivityProvider>
  )
}

export default App