import { useState, useEffect } from "react"
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, TextInput, Image, Modal } from "react-native"
import { Stack } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeleteModal from "../../../components/Delete"


export default function Timetable() {
    const editIcon = require('../../../assets/edit.png')
    const deleteIcon = require('../../../assets/delete.png')

    const [lessons, setLessons] = useState([
        { id: '1', day: 'Mo', startTime: '08:00', endTime: '09:30', title: 'Sport', prof: 'ovt', room: 'Halle F' },
        { id: '2', day: 'Mo', startTime: '09:55', endTime: '10:40', title: 'Math', prof: 'wym', room: '201' },
        { id: '3', day: 'Mo', startTime: '10:50', endTime: '12:30', title: 'TU', prof: 'cot', room: '210' },
        { id: '4', day: 'Mo', startTime: '13:25', endTime: '15:05', title: 'FRW', prof: 'hus', room: '219' },
        { id: '5', day: 'Mo', startTime: '15:15', endTime: '16:00', title: 'WR', prof: 'mep', room: '103' },
        { id: '6', day: 'Di', startTime: '09:55', endTime: '10:40', title: 'Math', prof: 'wym', room: '201' },
        { id: '7', day: 'Di', startTime: '10:50', endTime: '11:35', title: 'Englisch', prof: 'wep', room: '108' },
        { id: '8', day: 'Di', startTime: '11:45', endTime: '12:30', title: 'TU', prof: 'cot', room: '210' },
        { id: '9', day: 'Di', startTime: '13:25', endTime: '15:05', title: 'Deutsch', prof: 'kök', room: '122' },
        { id: '10', day: 'Di', startTime: '15:15', endTime: '16:45', title: 'WR', prof: 'mep', room: '103' },
        { id: '11', day: 'Mi', startTime: '08:55', endTime: '09:40', title: 'Deutsch', prof: 'kök', room: '122' },
        { id: '12', day: 'Mi', startTime: '09:55', endTime: '10:40', title: 'WR', prof: 'mep', room: '103' },
        { id: '13', day: 'Mi', startTime: '10:50', endTime: '11:35', title: 'GP', prof: 'zas', room: '109' },
        { id: '14', day: 'Mi', startTime: '11:45', endTime: '12:30', title: 'Franz', prof: 'raa', room: '111' },
        { id: '15', day: 'Mi', startTime: '13:25', endTime: '15:05', title: 'Englisch', prof: 'wep', room: '108' },
        { id: '16', day: 'Do', startTime: '08:00', endTime: '09:30', title: 'm 347', prof: 'ans', room: '107' },
        { id: '17', day: 'Do', startTime: '10:00', endTime: '11:30', title: 'm 426', prof: 'ans', room: '107' },
        { id: '18', day: 'Do', startTime: '12:30', endTime: '14:00', title: 'm 165', prof: 'abk', room: '207' },
        { id: '19', day: 'Do', startTime: '14:15', endTime: '15:45', title: 'm 254', prof: 'abk', room: '207' },
        { id: '20', day: 'Fr', startTime: '08:00', endTime: '09:30', title: 'praxistraining', prof: 'jäk', room: '203' },
        { id: '21', day: 'Fr', startTime: '10:00', endTime: '11:30', title: 'praxistraining', prof: 'jäk', room: '203' },
        { id: '22', day: 'Fr', startTime: '13:25', endTime: '14:10', title: 'GP', prof: 'zas', room: '109' },
        { id: '23', day: 'Fr', startTime: '14:20', endTime: '16:00', title: 'Franz', prof: 'raa', room: '111' }
    ])

    useEffect(() => {
        const loadLessons = async () => {
            try {
                const savedLessons = await AsyncStorage.getItem('lessons')
                if (savedLessons !== null) {
                    setLessons(JSON.parse(savedLessons))
                }
            } catch (e) {
                console.error('Fehler beim Laden der Lektionen', e)
            }
        }
        loadLessons()
    }, [])

    useEffect(() => {
        const saveLessons = async () => {
            try {
                await AsyncStorage.setItem('lessons', JSON.stringify(lessons))
            } catch (e) {
                console.error('Fehler beim Speichern der Lektionen', e)
            }
        }
        saveLessons()
    }, [lessons])

    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr']
    const times = [
        '08:00', '08:15', '08:30', '08:45',
        '09:00', '09:15', '09:30', '09:45',
        '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15', '11:30', '11:45',
        '12:00', '12:15', '12:30', '12:45',
        '13:00', '13:15', '13:30', '13:45',
        '14:00', '14:15', '14:30', '14:45',
        '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45',
        '17:00', '17:15', '17:30', '17:45'
    ]
    const fullHours = times.filter(time => time.endsWith(':00'))

    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showFlyout, setShowFlyout] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [lessonForm, setLessonForm] = useState({ title: '', room: '', prof: '', day: days[0], startTime: times[0], endTime: times[1], id: null })
    const [validationMessage, setValidationMessage] = useState('')

    const openAddModal = () => {
        setLessonForm({ title: '', room: '', prof: '', day: days[0], startTime: times[0], endTime: times[1], id: null })
        setValidationMessage('')
        setShowAddEditModal(true)
    }

    const openEditModal = (lesson) => {
        setLessonForm({ ...lesson })
        setShowAddEditModal(true)
    }

    const saveLesson = () => {
        if (!lessonForm.title || !lessonForm.room || !lessonForm.prof || !lessonForm.day || !lessonForm.startTime || !lessonForm.endTime) {
            setValidationMessage('Bitte füllen Sie alle Felder aus')
            return
        }
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(lessonForm.startTime) || !timeRegex.test(lessonForm.endTime)) {
            setValidationMessage('Bitte geben Sie Zeiten im Format HH:mm ein')
            return
        }
        const startMinutes = timeToMinutes(lessonForm.startTime)
        const endMinutes = timeToMinutes(lessonForm.endTime)
        if (endMinutes <= startMinutes) {
            setValidationMessage('Endzeit muss nach Startzeit liegen')
            return
        }
        setValidationMessage('')
        if (lessonForm.id) {
            setLessons(prev => prev.map(n => (n.id === lessonForm.id ? lessonForm : n)))
        } else {
            setLessons(prev => [...prev, { ...lessonForm, id: Math.random().toString() }])
        }
        setShowAddEditModal(false)
    }

    const handleCellPress = (day, time) => {
        const lesson = lessons.find(l => l.day === day && timeToMinutes(time) >= timeToMinutes(l.startTime) && timeToMinutes(time) < timeToMinutes(l.endTime))
        setSelectedLesson(lesson || null)
        if (lesson) {
            setShowFlyout(true)
        } else {
            setLessonForm({
                title: '',
                room: '',
                prof: '',
                day,
                startTime: time,
                endTime: times[times.indexOf(time) + 1] || times[0],
                id: null
            })
            setValidationMessage('')
            setShowAddEditModal(true)
        }
    }

    const openLessonOptions = () => {
        if (selectedLesson) {
            setShowFlyout(false)
            openEditModal(selectedLesson)
        }
    }

    const openDeleteModal = () => {
        setShowFlyout(false)
        setShowDeleteModal(true)
    }

    const deleteLesson = () => {
        setLessons(prev => prev.filter(l => l.id !== selectedLesson.id))
        setShowDeleteModal(false)
    }

    const timeToMinutes = (t) => {
        const [h, m] = t.split(':').map(Number)
        return h * 60 + m
    }

    const getLessonHeightAndOffset = (startTime, endTime, cellStartTime) => {
        const start = timeToMinutes(startTime)
        const end = timeToMinutes(endTime)
        const cellStart = timeToMinutes(cellStartTime)
        const durationMinutes = end - start
        const height = Math.max(durationMinutes * (60 / 60), 15)
        const offset = (start - cellStart) * (60 / 60)
        return { height, offset }
    }

    const generateSchedule = () => {
        return (
            <View style={styles.scheduleContainer}>
                {fullHours.map((hour, index) => (
                    <View key={hour} style={styles.timeRow}>
                        <View style={styles.timeCell}>
                            <Text style={styles.timeText}>{hour}</Text>
                        </View>
                        <View style={styles.row}>
                            {days.map(day => {
                                const lessonsInHour = lessons.filter(l =>
                                    l.day === day &&
                                    timeToMinutes(l.startTime) < timeToMinutes(fullHours[index + 1] || '18:00') &&
                                    timeToMinutes(l.endTime) > timeToMinutes(hour)
                                )
                                return (
                                    <TouchableOpacity
                                        key={`${day}-${hour}`}
                                        style={styles.cell}
                                        onPress={() => handleCellPress(day, hour)}
                                    >
                                        {lessonsInHour.map(lesson => {
                                            const { height, offset } = getLessonHeightAndOffset(lesson.startTime, lesson.endTime, hour)
                                            return (
                                                <View
                                                    key={lesson.id}
                                                    style={[styles.lessonBox, {
                                                        height,
                                                        top: offset,
                                                        opacity: timeToMinutes(hour) <= timeToMinutes(lesson.startTime) && timeToMinutes(lesson.startTime) < timeToMinutes(fullHours[index + 1] || '18:00') ? 1 : 0.3
                                                    }]}
                                                >
                                                    {timeToMinutes(hour) <= timeToMinutes(lesson.startTime) && timeToMinutes(lesson.startTime) < timeToMinutes(fullHours[index + 1] || '18:00') && (
                                                        <>
                                                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                                            <Text style={styles.lessonDetails}>{lesson.prof} | {lesson.room}</Text>
                                                            <Text style={styles.lessonTime}>{lesson.startTime} – {lesson.endTime}</Text>
                                                        </>
                                                    )}
                                                </View>
                                            )
                                        })}
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Stundenplan", headerTitleAlign: "center", headerStyle: { backgroundColor: "#49362c" }, headerTitleStyle: { color: "#f6f4e9" } }} />

            <View style={styles.headerRow}>
                <View style={styles.timeCellHeader} />
                {days.map(day => (
                    <View key={day} style={styles.dayHeader}>
                        <Text style={styles.headerText}>{day}</Text>
                    </View>
                ))}
            </View>

            <ScrollView horizontal>
                <ScrollView>
                    <View>{generateSchedule()}</View>
                </ScrollView>
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <Modal visible={showFlyout && !!selectedLesson} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedLesson?.title}</Text>
                        <Text style={styles.lessonDetails}>{selectedLesson?.prof} | {selectedLesson?.room}</Text>
                        <Text style={styles.lessonTime}>{selectedLesson?.startTime} – {selectedLesson?.endTime}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowFlyout(false)}>
                                <Text style={styles.buttonText}>Abbrechen</Text>
                            </TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity style={styles.iconButton} onPress={openLessonOptions}>
                                    <Image source={editIcon} style={styles.iconImage} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={openDeleteModal}>
                                    <Image source={deleteIcon} style={styles.iconImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {showAddEditModal && (
                <View style={styles.modalOverlayBackground}>
                    <View style={styles.bottomFlyout}>
                        <View style={styles.topBar} />
                        <Text style={styles.modalTitle}>{lessonForm.id ? 'Lektion Bearbeiten' : 'Lektion Erstellen'}</Text>
                        {validationMessage ? <Text style={styles.validationText}>{validationMessage}</Text> : null}
                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput placeholder="Lektionname" style={[styles.input, styles.flexGrow]} value={lessonForm.title} onChangeText={(text) => setLessonForm({ ...lessonForm, title: text })} />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Lehrperson:</Text>
                            <TextInput placeholder="Lehrpersonkürzel" style={[styles.input, styles.flexGrow]} value={lessonForm.prof} onChangeText={(text) => setLessonForm({ ...lessonForm, prof: text })} />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Zimmer:</Text>
                            <TextInput placeholder="Zimmernummer" style={[styles.input, styles.flexGrow]} value={lessonForm.room} onChangeText={(text) => setLessonForm({ ...lessonForm, room: text })} />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Lektionbeginn:</Text>
                            <TextInput placeholder="Startzeit (HH:mm)" style={[styles.input, styles.flexGrow]} value={lessonForm.startTime} onChangeText={(text) => setLessonForm({ ...lessonForm, startTime: text })} />
                        </View>
                        <View style={styles.fieldRow}>
                            <Text style={styles.label}>Lektionende:</Text>
                            <TextInput placeholder="Endzeit (HH:mm)" style={[styles.input, styles.flexGrow]} value={lessonForm.endTime} onChangeText={(text) => setLessonForm({ ...lessonForm, endTime: text })} />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddEditModal(false)}>
                                <Text style={styles.buttonText}>Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveLesson}>
                                <Text style={styles.buttonText}>Speichern</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <DeleteModal
                showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} description={`Sind Sie sicher, dass Sie  ${selectedLesson?.title} unwiderruflich löschen möchten?`} onDelete={deleteLesson}
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

    // Header
    headerRow: { flexDirection: 'row', marginBottom: 2 },
    timeCellHeader: { width: 50 },
    dayHeader: { width: 60, alignItems: 'center' },
    headerText: { fontWeight: 'bold' },

    // Schedule
    timeRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    timeCell: { width: 60, height: 60, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 8 },
    timeText: { fontSize: 12 },
    row: { flexDirection: 'row' },
    cell: { width: 60, height: 60, borderWidth: 0.5, borderColor: '#999', justifyContent: 'center', alignItems: 'center' },
    lessonBox: { backgroundColor: '#8a7566', borderRadius: 8, padding: 4, width: '90%', alignItems: 'center' },
    lessonTitle: { fontSize: 12, color: '#f6f4e9' },
    lessonDetails: { fontSize: 10 },
    lessonTime: { fontSize: 10, color: '#eee' },
    emptyCell: { width: '100%', height: '100%' },

    //Button
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
    addButtonText: {
        color: '#ede8d0',
        fontSize: 32
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center'
    },

    // Modal
    modalOverlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: '#8a7566',
        padding: 20,
        borderRadius: 16,
        width: 300,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f6f4e9',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Comfortaa'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%'
    },
    input: {
        backgroundColor: '#ede8d0',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10
    },

    //Flyout
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
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 60,
        fontSize: 16,
        color: '#f6f4e9',
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
    },

    // Buttons
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
    deleteButton: {
        backgroundColor: '#e33',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5
    },

    // Icons
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    iconImage: {
        width: 20,
        height: 20
    },

    //Validation
    validationText: {
        color: '#49362c',
        backgroundColor: '#d43f4a',
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    }
})
