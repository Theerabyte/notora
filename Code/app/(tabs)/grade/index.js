import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import DeleteModal from "../../../components/Delete"

const editIcon = require('../../../assets/edit.png');
const deleteIcon = require('../../../assets/delete.png');

const initialGrades = [
    { id: '1', subject: 'Mathematik', theme: 'Geometrie', grade: '5.3', points: '26 / 30', notes: 'Lorem ipsum dolor sit amet...' },
    { id: '2', subject: 'Deutsch', theme: 'Literatur', grade: '5.6', points: '42 / 46', notes: 'Lorem ipsum dolor sit amet...' },
];

export default function GradesScreen() {
    const [grades, setGrades] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [form, setForm] = useState({ subject: '', theme: '', reachedPoints: '', maxPoints: '', grade: '', notes: '' });

    const openDeleteModal = (grade) => {
        setSelectedGrade(grade);
        setShowDeleteModal(true);
    };

    const deleteGrade = () => {
        const updatedGrades = grades.filter(item => item.id !== selectedGrade.id);
        setGrades(updatedGrades);
        saveGrades(updatedGrades);
        setShowDeleteModal(false);
    };


    const openEditModal = (grade = null) => {
        if (grade) {
            const [reached, max] = grade.points.split(' / ');
            setForm({ ...grade, reachedPoints: reached, maxPoints: max });
        } else {
            setForm({ subject: '', theme: '', reachedPoints: '', maxPoints: '', grade: '', notes: '' });
        }
        setShowEditModal(true);
    };

    const calculateGrade = (reached, max) => {
        const reachedNum = parseFloat(reached);
        const maxNum = parseFloat(max);
        if (!isNaN(reachedNum) && !isNaN(maxNum) && maxNum > 0) {
            const grade = 1 + 5 * (reachedNum / maxNum);
            return grade.toFixed(1);
        }
        return '';
    };

    const saveGrade = () => {
        if (!maxPointsConfirmed) {
            alert('Bitte bestätigen Sie die maximale Punktzahl mit OK.');
            return;
        }

        if (!form.subject || !form.theme || !form.reachedPoints || !form.maxPoints) {
            alert('Bitte alle Pflichtfelder ausfüllen!');
            return;
        }

        const reached = parseFloat(form.reachedPoints.replace(',', '.'));
        const max = parseFloat(form.maxPoints.replace(',', '.'));

        const calculatedGrade = calculateGrade(reached.toString(), max.toString());
        const newEntry = {
            ...form,
            grade: calculatedGrade,
            points: `${reached} / ${max}`,
            reachedPoints: reached.toString(),
            maxPoints: max.toString(),
        };

        let updatedGrades;

        if (form.id) {
            updatedGrades = grades.map(g => g.id === form.id ? { ...newEntry, id: form.id } : g);
        } else {
            updatedGrades = [...grades, { ...newEntry, id: Math.random().toString() }];
        }

        setGrades(updatedGrades);
        saveGrades(updatedGrades);

        setShowEditModal(false);
        setMaxPointsConfirmed(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.gradeItem}>
            <View style={styles.headerRow}>
                <Text style={styles.subject}>{item.subject}</Text>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Image source={editIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openDeleteModal(item)}>
                        <Image source={deleteIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.theme}>{item.theme}</Text>
                    <Text style={styles.grade}>{'Note: ' + item.grade}</Text>
                    <Text style={styles.points}>{'Punkte: ' + item.points}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.notesLabel}>Notizen:</Text>
                    <Text style={styles.notes}>{item.notes}</Text>
                </View>
            </View>
        </View>
    );

    const [maxPointsConfirmed, setMaxPointsConfirmed] = useState(false);

    const STORAGE_KEY = '@gradesData';

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                setGrades(JSON.parse(jsonValue));
            } else {
                setGrades(initialGrades);
            }
        } catch (e) {
            console.error('Fehler beim Laden der Noten:', e);
        }
    };

    const saveGrades = async (gradesToSave) => {
        try {
            const jsonValue = JSON.stringify(gradesToSave);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Fehler beim Speichern der Noten:', e);
        }
    };


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Noten", headerTitleAlign: "center", headerStyle: { backgroundColor: "#49362c" }, headerTitleStyle: { color: "#f6f4e9" } }} />
            <FlatList data={grades} renderItem={renderItem} keyExtractor={item => item.id} />
            <TouchableOpacity style={styles.addButton} onPress={() => openEditModal()}>
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>

            <DeleteModal
                showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} description={`Sind Sie sicher, dass Sie  ${selectedGrade?.theme} unwiderruflich löschen möchten?`} onDelete={deleteGrade}
            />

            <Modal visible={showEditModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{form.id ? 'Bearbeiten' : 'Hinzufügen'}</Text>

                        <TextInput
                            placeholder="Fach *"
                            style={styles.input}
                            maxLength={16}
                            value={form.subject}
                            onChangeText={text => setForm({ ...form, subject: text })}
                        />
                        <Text style={styles.charCount}>/{16}</Text>

                        <TextInput
                            placeholder="Thema *"
                            style={styles.input}
                            maxLength={24}
                            value={form.theme}
                            onChangeText={text => setForm({ ...form, theme: text })}
                        />
                        <Text style={styles.charCount}>/{24}</Text>

                        <TextInput
                            placeholder="Erreichte Punkte *"
                            style={styles.input}
                            keyboardType="numeric"
                            value={form.reachedPoints}
                            onChangeText={text => {
                                const regex = /^\d*(\.|,)?([0257]{0,2})?$/;

                                if (text === '' || regex.test(text)) {
                                    let normalized = text.replace(',', '.');

                                    const maxNormalized = form.maxPoints.replace(',', '.');

                                    if (maxNormalized !== '' && parseFloat(normalized) > parseFloat(maxNormalized)) {
                                        normalized = maxNormalized;
                                        text = form.maxPoints;
                                    }

                                    const newGrade = calculateGrade(normalized, maxNormalized);
                                    setForm({ ...form, reachedPoints: text, grade: newGrade });
                                }
                            }}
                        />

                        <TextInput
                            placeholder="Maximale Punkte *"
                            style={styles.input}
                            keyboardType="numeric"
                            value={form.maxPoints}
                            onChangeText={text => {
                                const regex = /^\d*(\.|,)?([0257]{0,2})?$/;

                                if (text === '' || regex.test(text)) {
                                    let normalized = text.replace(',', '.');

                                    if (parseFloat(normalized) > 500) {
                                        normalized = '500';
                                        text = '500';
                                    }

                                    const reachedNormalized = form.reachedPoints.replace(',', '.');
                                    const newGrade = calculateGrade(reachedNormalized, normalized);

                                    setForm({ ...form, maxPoints: text, grade: newGrade });
                                    setMaxPointsConfirmed(false);
                                }
                            }}
                        />

                        <TouchableOpacity
                            style={[styles.okButton, { backgroundColor: '#49362c' }]}
                            onPress={() => {
                                let reached = parseFloat(form.reachedPoints.replace(',', '.'));
                                let max = parseFloat(form.maxPoints.replace(',', '.'));

                                if (isNaN(max) || isNaN(reached)) {
                                    alert('Bitte gültige Zahlen eingeben.');
                                    return;
                                }

                                if (reached > max) {
                                    reached = max;
                                }

                                const newGrade = calculateGrade(reached.toString(), max.toString());

                                setForm(prev => ({
                                    ...prev,
                                    reachedPoints: reached.toString(),
                                    maxPoints: max.toString(),
                                    grade: newGrade,
                                }));

                                setMaxPointsConfirmed(true);
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>OK</Text>
                        </TouchableOpacity>

                        <Text style={{ marginBottom: 10 }}>Note: {form.grade || '-'}</Text>

                        <TextInput
                            placeholder="Notizen"
                            style={styles.input}
                            maxLength={100}
                            multiline
                            value={form.notes}
                            onChangeText={text => setForm({ ...form, notes: text })}
                        />
                        <Text style={styles.charCount}>/{100}</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                                <Text style={styles.buttonText}>Abbrechen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveGrade}>
                                <Text style={styles.buttonText}>Speichern</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f6f4e9' },

    gradeItem: {
        backgroundColor: '#8a7566',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icons: {
        flexDirection: 'row',
    },
    iconImage: {
        width: 24,
        height: 24,
        marginLeft: 12,
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
        marginLeft: 8,
    },

    subject: { fontSize: 18, fontWeight: 'bold', color: '#ede8d0' },
    theme: { fontSize: 16, color: '#ede8d0', marginBottom: 4 },
    grade: { fontSize: 16, color: '#ede8d0', marginBottom: 4 },
    points: { fontSize: 14, color: '#ede8d0' },

    notesLabel: { fontSize: 14, color: '#ede8d0', marginBottom: 2 },
    notes: { fontSize: 14, color: '#ede8d0' },

    addButton: {
        backgroundColor: '#49362c',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    addText: { color: '#ede8d0', fontSize: 32 },

    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#ede8d0', padding: 20, borderRadius: 16, alignItems: 'center', width: 300 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#49362c', marginBottom: 10 },
    modalText: { textAlign: 'center', color: '#49362c', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    cancelButton: { backgroundColor: '#49362c', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
    deleteButton: { backgroundColor: '#e26b5c', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
    saveButton: { backgroundColor: '#079235', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
    buttonText: { color: '#fff', textAlign: 'center' },
    input: { borderBottomWidth: 1, width: '100%', marginBottom: 10 },
    charCount: {
        alignSelf: 'flex-end',
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
    },
    okButton: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'center',
        width: 100,
    },

});
