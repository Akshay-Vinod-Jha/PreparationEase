import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db, collection, getDocs } from "@/firebaseConfig";
import { addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Colors } from "@/styles/Colors";

// Modified RenderNote component with update/delete functionality
const EnhancedRenderNote = ({ note, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Decide if content should be truncated
  const shouldTruncate = note.noteContent.length > 100;
  const displayContent =
    expanded || !shouldTruncate
      ? note.noteContent
      : note.noteContent.substring(0, 100) + "...";

  return (
    <View style={enhancedStyles.noteContainer}>
      <Text style={enhancedStyles.noteTitle}>{note.noteTitle}</Text>
      <Text style={enhancedStyles.noteDate}>{formatDate(note.timeStamp)}</Text>
      <Text style={enhancedStyles.noteContent}>{displayContent}</Text>

      {shouldTruncate && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={enhancedStyles.showMoreButton}
        >
          <Text style={enhancedStyles.showMoreText}>
            {expanded ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={enhancedStyles.actionButtonsContainer}>
        <TouchableOpacity
          style={[enhancedStyles.actionButton, enhancedStyles.updateButton]}
          onPress={() => onUpdate(note)}
        >
          <Text style={enhancedStyles.actionButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[enhancedStyles.actionButton, enhancedStyles.deleteButton]}
          onPress={() => onDelete(note)}
        >
          <Text style={enhancedStyles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AddNote() {
  const { username } = useLocalSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loadingIntNotes, setLoadingIntNotes] = useState("default"); //default,loading,issue
  const [formStatus, setFormStatus] = useState("default"); //default,success,issue,loading
  const [sortOrder, setSortOrder] = useState("newest"); // newest or oldest

  // New state for delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("default"); // default, loading, success, issue

  // New state for update modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState(null);
  const [updatedNoteTitle, setUpdatedNoteTitle] = useState("");
  const [updatedNoteContent, setUpdatedNoteContent] = useState("");
  const [updateStatus, setUpdateStatus] = useState("default"); // default, loading, success, issue

  const loadNotes = async () => {
    setLoadingIntNotes("loading");
    try {
      const collectionref = collection(db, `users/${username}/notes`);
      const snapshot = await getDocs(collectionref);
      let fetchedNotes = snapshot.docs.map((val) => ({
        id: val.id,
        ...val.data(),
      }));

      // Sort notes by timestamp
      sortNotes(fetchedNotes);

      setLoadingIntNotes("default");
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
      setLoadingIntNotes("issue");
      setTimeout(() => {
        setLoadingIntNotes("default");
      }, 2000);
    }
  };

  // Sort notes function - can be called whenever sorting needs to be updated
  const sortNotes = (notesToSort = notes) => {
    const sortedNotes = [...notesToSort].sort((a, b) => {
      const dateA = new Date(a.timeStamp);
      const dateB = new Date(b.timeStamp);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    setNotes(sortedNotes);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(newSortOrder);
    sortNotes(notes);
  };

  //first time load
  useEffect(() => {
    console.log("username for addnote page is ", username);
    loadNotes();
  }, []);

  // Re-sort notes when sort order changes
  useEffect(() => {
    sortNotes();
  }, [sortOrder]);

  const handleAddNote = async () => {
    setFormStatus("loading");
    console.log("title:-", noteTitle);
    console.log("content:-", noteContent);
    console.log("Timestamp:-", new Date().getTime());
    try {
      const collectionref = collection(db, `users/${username}/notes`);
      const ctimestamp = new Date().toISOString();
      const data = await addDoc(collectionref, {
        noteTitle: noteTitle.trim() ? noteTitle.trim() : "",
        noteContent: noteContent.trim() ? noteContent.trim() : "",
        timeStamp: ctimestamp,
      });
      console.log("note added for ", username, " with the id ", data.id);

      // Reset form fields
      setNoteTitle("");
      setNoteContent("");
      setShowForm(false);
      setFormStatus("success");

      // Refresh notes list
      loadNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      setFormStatus("issue");
    } finally {
      setTimeout(() => {
        setFormStatus("default");
      }, 2000);
    }
  };

  // Handle note deletion
  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setDeleteStatus("loading");
    try {
      const noteRef = doc(db, `users/${username}/notes/${noteToDelete.id}`);
      await deleteDoc(noteRef);

      setDeleteStatus("success");
      setTimeout(() => {
        setDeleteModalVisible(false);
        setNoteToDelete(null);
        setDeleteStatus("default");
        loadNotes();
      }, 1000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setDeleteStatus("issue");
      setTimeout(() => {
        setDeleteStatus("default");
      }, 2000);
    }
  };

  // Handle note update
  const handleUpdateNote = async () => {
    if (!noteToUpdate) return;

    setUpdateStatus("loading");
    try {
      const noteRef = doc(db, `users/${username}/notes/${noteToUpdate.id}`);
      await updateDoc(noteRef, {
        noteTitle: updatedNoteTitle.trim(),
        noteContent: updatedNoteContent.trim(),
        // Keep the original timestamp or update it if needed
        // timeStamp: new Date().toISOString(), // Uncomment to update timestamp
      });

      setUpdateStatus("success");
      setTimeout(() => {
        setUpdateModalVisible(false);
        setNoteToUpdate(null);
        setUpdateStatus("default");
        loadNotes();
      }, 1000);
    } catch (error) {
      console.error("Error updating note:", error);
      setUpdateStatus("issue");
      setTimeout(() => {
        setUpdateStatus("default");
      }, 2000);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (note) => {
    setNoteToDelete(note);
    setDeleteModalVisible(true);
  };

  // Open update modal
  const openUpdateModal = (note) => {
    setNoteToUpdate(note);
    setUpdatedNoteTitle(note.noteTitle);
    setUpdatedNoteContent(note.noteContent);
    setUpdateModalVisible(true);
  };

  const renderFormStatusIndicator = () => {
    switch (formStatus) {
      case "loading":
        return (
          <ActivityIndicator
            size="small"
            color="#6200EE"
            style={styles.statusIndicator}
          />
        );
      case "success":
        return <Text style={styles.successText}>Note added successfully!</Text>;
      case "issue":
        return (
          <Text style={styles.errorText}>
            Failed to add note. Please try again.
          </Text>
        );
      default:
        return null;
    }
  };

  const renderDeleteStatusIndicator = () => {
    switch (deleteStatus) {
      case "loading":
        return (
          <ActivityIndicator
            size="small"
            color="#6200EE"
            style={styles.statusIndicator}
          />
        );
      case "success":
        return (
          <Text style={styles.successText}>Note deleted successfully!</Text>
        );
      case "issue":
        return (
          <Text style={styles.errorText}>
            Failed to delete note. Please try again.
          </Text>
        );
      default:
        return null;
    }
  };

  const renderUpdateStatusIndicator = () => {
    switch (updateStatus) {
      case "loading":
        return (
          <ActivityIndicator
            size="small"
            color="#6200EE"
            style={styles.statusIndicator}
          />
        );
      case "success":
        return (
          <Text style={styles.successText}>Note updated successfully!</Text>
        );
      case "issue":
        return (
          <Text style={styles.errorText}>
            Failed to update note. Please try again.
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {!showForm ? (
        <TouchableOpacity
          style={[styles.getStartedButton, { marginTop: 10 }]}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.getStartedText}>Add New Note</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <Text style={styles.formHeader}>Create New Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Note Title"
            value={noteTitle}
            onChangeText={setNoteTitle}
            placeholderTextColor="#7B1FA2"
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Note Content"
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
            placeholderTextColor="#7B1FA2"
          />
          {renderFormStatusIndicator()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleAddNote}
              disabled={formStatus === "loading"}
            >
              <Text style={styles.getStartedText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loadingIntNotes === "loading" && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      )}

      {loadingIntNotes === "issue" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong loading notes
          </Text>
        </View>
      )}

      {loadingIntNotes === "default" && (
        <View style={styles.notesContainer}>
          <View style={enhancedStyles.notesHeader}>
            <Text style={styles.notesHeaderText}>Your Notes</Text>
            <TouchableOpacity
              style={enhancedStyles.sortButton}
              onPress={toggleSortOrder}
            >
              <Text style={enhancedStyles.sortButtonText}>
                Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EnhancedRenderNote
                note={item}
                onDelete={openDeleteModal}
                onUpdate={openUpdateModal}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyNotesText}>
                No notes found. Create one!
              </Text>
            }
            contentContainerStyle={styles.notesList}
          />
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={enhancedStyles.modalContainer}>
          <View style={enhancedStyles.modalContent}>
            <Text style={enhancedStyles.modalTitle}>Confirm Deletion</Text>

            {noteToDelete && (
              <View style={enhancedStyles.notePreview}>
                <Text style={enhancedStyles.previewLabel}>Title:</Text>
                <Text style={enhancedStyles.previewText}>
                  {noteToDelete.noteTitle}
                </Text>

                <Text style={enhancedStyles.previewLabel}>Content:</Text>
                <ScrollView style={enhancedStyles.contentPreview}>
                  <Text style={enhancedStyles.previewText}>
                    {noteToDelete.noteContent}
                  </Text>
                </ScrollView>
              </View>
            )}

            {renderDeleteStatusIndicator()}

            <View style={enhancedStyles.modalButtonsContainer}>
              <TouchableOpacity
                style={[
                  enhancedStyles.modalButton,
                  enhancedStyles.cancelModalButton,
                ]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={
                  deleteStatus === "loading" || deleteStatus === "success"
                }
              >
                <Text style={enhancedStyles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  enhancedStyles.modalButton,
                  enhancedStyles.confirmModalButton,
                ]}
                onPress={handleDeleteNote}
                disabled={
                  deleteStatus === "loading" || deleteStatus === "success"
                }
              >
                <Text style={enhancedStyles.confirmModalButtonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={enhancedStyles.modalContainer}>
          <View
            style={[
              enhancedStyles.modalContent,
              enhancedStyles.updateModalContent,
            ]}
          >
            <Text style={enhancedStyles.modalTitle}>Update Note</Text>

            <TextInput
              style={enhancedStyles.modalInput}
              placeholder="Note Title"
              value={updatedNoteTitle}
              onChangeText={setUpdatedNoteTitle}
              placeholderTextColor="#7B1FA2"
            />

            <TextInput
              style={[
                enhancedStyles.modalInput,
                enhancedStyles.modalContentInput,
              ]}
              placeholder="Note Content"
              value={updatedNoteContent}
              onChangeText={setUpdatedNoteContent}
              multiline
              placeholderTextColor="#7B1FA2"
            />

            {renderUpdateStatusIndicator()}

            <View style={enhancedStyles.modalButtonsContainer}>
              <TouchableOpacity
                style={[
                  enhancedStyles.modalButton,
                  enhancedStyles.cancelModalButton,
                ]}
                onPress={() => setUpdateModalVisible(false)}
                disabled={
                  updateStatus === "loading" || updateStatus === "success"
                }
              >
                <Text style={enhancedStyles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  enhancedStyles.modalButton,
                  enhancedStyles.updateModalButton,
                ]}
                onPress={handleUpdateNote}
                disabled={
                  updateStatus === "loading" || updateStatus === "success"
                }
              >
                <Text style={enhancedStyles.confirmModalButtonText}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Enhanced styles for the new functionality
const enhancedStyles = StyleSheet.create({
  noteContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 14,
    color: Colors.textDark,
    marginVertical: 8,
    lineHeight: 20,
  },
  noteDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  showMoreButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 12,
  },
  showMoreText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sortButton: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortButtonText: {
    color: "#7B1FA2",
    fontSize: 12,
    fontWeight: "600",
  },
  // New action buttons for note items
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: "#F3E5F5",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  updateModalContent: {
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  notePreview: {
    marginVertical: 12,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 12,
  },
  contentPreview: {
    maxHeight: 150,
    marginBottom: 12,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.48,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  confirmModalButton: {
    backgroundColor: "#D32F2F",
  },
  updateModalButton: {
    backgroundColor: Colors.primary,
  },
  cancelModalButtonText: {
    color: "#757575",
    fontWeight: "bold",
  },
  confirmModalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Modal inputs
  modalInput: {
    borderWidth: 1,
    borderColor: "#D1C4E9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: Colors.primary,
  },
  modalContentInput: {
    height: 150,
    textAlignVertical: "top",
  },
});

// Original styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
  },
  marginbottomapply: {
    marginBottom: 4,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 0,
    marginBottom: 20,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exploreSection: {
    padding: 20,
    flex: 1,
  },
  exploreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  cardsContainer: {
    padding: 10,
  },
  bottomNav: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Colors.primary,
  },
  form: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1C4E9",
    borderRadius: 25,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.primary,
  },
  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    flex: 0.48,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyNotesText: {
    textAlign: "center",
    color: Colors.primary,
    fontStyle: "italic",
    marginTop: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#4A148C",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    textAlign: "center",
  },
  successText: {
    color: "#388E3C",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  statusIndicator: {
    marginBottom: 8,
  },
  notesContainer: {
    flex: 1,
  },
  notesHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A148C",
    marginBottom: 12,
  },
  notesList: {
    paddingBottom: 20,
  },
});
