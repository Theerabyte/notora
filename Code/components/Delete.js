import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DeleteModal({ showDeleteModal, setShowDeleteModal, description, onDelete }) {
    return (
        <Modal visible={showDeleteModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Datensatz löschen (!)</Text>
                    <Text style={styles.modalText}>{description}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeleteModal(false)}>
                            <Text style={styles.buttonText}>Abbrechen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                            <Text style={styles.buttonText}>Löschen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#ede8d0',
        padding: 20,
        borderRadius: 16,
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#49362c',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Comfortaa',
    },
    modalText: {
        fontSize: 16,
        color: '#49362c',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#49362c',
        padding: 10,
        borderRadius: 100,
        flex: 1,
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#e33',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
    },
})