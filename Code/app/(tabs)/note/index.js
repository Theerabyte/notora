import { StyleSheet, View, FlatList, TouchableOpacity, Text, TextInput, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Stack } from "expo-router"
import DeleteModal from "../../../components/Delete"

export default function Notizen() {

    const STORAGE_KEY = 'myNotes';

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data !== null) { 
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNotes(parsed);
                }
            }
        } catch (e) {
            console.error("Fehler beim Laden der Notizen:", e);
        }
    };

    const saveNotes = async (notesToSave) => {
        try {
            const jsonValue = JSON.stringify(notesToSave);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error("Fehler beim Speichern der Notizen:", e);
        }
    };

    const editIcon = require('../../../assets/edit.png');
    const deleteIcon = require('../../../assets/delete.png');
    const [notes, setNotes] = useState([
        { id: '1', title: 'Modul 347', content: 'Das Modul "Einführung in Cloud-Computing mit Azure und AWS" behandelt die Grundkonzepte und Modelle des Cloud-Computings sowie die Unterschiede zu traditionellen IT-Infrastrukturen. Es stellt die verschiedenen Dienstmodelle wie IaaS, PaaS, SaaS und FaaS vor und erklärt die Deployment-Modelle Public, Private, Hybrid und Multi-Cloud. Ein weiterer Schwerpunkt liegt auf den Sicherheitsaspekten, einschließlich Datenverschlüsselung, Zugriffskontrollen und Compliance. Zudem werden Kostenmanagement-Techniken behandelt, wie Kostenmodelle, Budgetierung und Ressourcenoptimierung. Praktische Anwendungen und Fallstudien helfen, das Gelernte in realen Szenarien anzuwenden. Das Modul schließt mit einem Überblick über die Zukunft der Cloud-Technologie, einschließlich aktueller Trends und Innovationen bei Azure und AWS. penDie Lernziele umfassen das Verständnis der Grundkonzepte und Modelle, die Kenntnis der wichtigsten Dienstleistungen von Azure und AWS, die Bewertung von Sicherheitsaspekten und Kostenmanagement sowie die praktische Anwendung von Cloud-Technologien.' },
    ])

    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null)
    const [form, setForm] = useState({ title: '', content: '', id: null })

    const openAddModal = () => {
        setForm({ title: '', content: '', id: null })
        setShowAddEditModal(true)
    }

    const openEditModal = (note) => {
        setForm(note)
        setShowAddEditModal(true)
    }

    const saveNote = () => {
        let updatedNotes;
        if (form.id) {
            updatedNotes = notes.map(n => (n.id === form.id ? form : n));
        } else {
            updatedNotes = [...notes, { ...form, id: Math.random().toString() }];
        }

        setNotes(updatedNotes);
        saveNotes(updatedNotes);
        setShowAddEditModal(false);
    }

    const openDeleteModal = (note) => {
        setSelectedNote(note)
        setShowDeleteModal(true)
    }

    const deleteNote = () => {
        const updatedNotes = notes.filter(n => n.id !== selectedNote.id);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
        setShowDeleteModal(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.noteItem}>
            <View style={styles.headerRow}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Image source={editIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openDeleteModal(item)}>
                        <Image source={deleteIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.noteContent}>{item.content}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Notizen", headerTitleAlign: "center", headerStyle: { backgroundColor: "#49362c" }, headerTitleStyle: { color: "#f6f4e9" } }} />
            <FlatList data={notes} renderItem={renderItem} />

            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>

            {showAddEditModal && (
                <View style={styles.modalOverlayBackground}>
                    <View style={styles.bottomFlyout}>
                        <View style={styles.topBar} />
                        <Text style={styles.modalTitle}>{form.id ? 'Notiz Bearbeiten' : 'Notiz Erstellen'}</Text>

                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Titel:</Text>
                            <View style={[styles.flexGrow, { position: 'relative' }]}>
                                <TextInput
                                    placeholder="Ihr Titel"
                                    style={[styles.input]}
                                    value={form.title}
                                    onChangeText={(text) => {
                                        if (text.length <= 30) setForm({ ...form, title: text });
                                    }}
                                    maxLength={30}
                                />
                                <Text style={styles.charCounter}>{form.title.length} / 30</Text>
                            </View>
                        </View>

                        <View style={styles.fieldRow}>
                            <Text style={[styles.label, { minHeight: 80, textAlignVertical: 'top' }]}>Inhalt:</Text>
                            <View style={[styles.flexGrow, { position: 'relative' }]}>
                                <TextInput
                                    placeholder="Ihr Inhalt"
                                    style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                                    value={form.content}
                                    onChangeText={(text) => {
                                        if (text.length <= 2000) setForm({ ...form, content: text });
                                    }}
                                    multiline={true}
                                    maxLength={2000}
                                />
                                <Text style={styles.charCounter}>{form.content.length} / 2000</Text>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddEditModal(false)}>
                                <Text style={styles.buttonText}>Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                                <Text style={styles.buttonText}>Speichern</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}


            <DeleteModal
                showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} description={`Sind Sie sicher, dass Sie  ${selectedNote?.title} unwiderruflich löschen möchten?`} onDelete={deleteNote}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f6f4e9'
    },
    noteItem: {
        backgroundColor: '#8a7566',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ede8d0'

    },
    noteContent: {
        fontSize: 14,
        color: '#ede8d0'

    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    icon: {
        fontSize: 20,
        marginHorizontal: 10
    },
    addButton: {
        backgroundColor: '#49362c',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16
    },
    addText: {
        color: '#ede8d0',
        fontSize: 32
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: '#ede8d0',
        padding: 20,
        borderRadius: 16,
        width: 300
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ede8d0',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Comfortaa'
    },
    input: {
        backgroundColor: '#ede8d0',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%'
    },
    cancelButton: {
        backgroundColor: '#49362c',
        padding: 10,
        borderRadius: 100,
        flex: 1,
        marginRight: 70
    },
    saveButton: {
        backgroundColor: '#079235',
        padding: 10,
        borderRadius: 100,
        flex: 1,
        marginLeft: 70
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center'
    },
    deleteButton: {
        backgroundColor: '#e33',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5
    },
    deleteModalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    leftContainer: {
        flex: 1,
    },
    rightContainer: {
        flex: 1,
        paddingLeft: 16,
    },
    bottomFlyout: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#8a7566',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalOverlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 60,
        fontSize: 16,
        color: '#ede8d0',
    },
    flexGrow: {
        flex: 1,
    },
    topBar: {
        height: 5,
        width: 35,
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: '#49362c',
        marginBottom: 8
    }
})
