import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import RenderNote from "@/components/RenderNote";
import { db, collection, getDocs } from "@/firebaseConfig";
import { addDoc } from "firebase/firestore";

export default function AddNote() {
  const { username } = useLocalSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loadingIntNotes, setLoadingIntNotes] = useState("default"); //default,loading,issue
  const [formStatus, setFormStatus] = useState("default"); //default,success,issue,loading

  const loadNotes = async () => {
    setLoadingIntNotes("loading");
    try {
      const collectionref = collection(db, `users/${username}/notes`);
      const snapshot = await getDocs(collectionref);
      setNotes(() => {
        return snapshot.docs.map((val) => ({
          id: val.id,
          ...val.data(),
        }));
      });
      setLoadingIntNotes("default");
    } catch (error) {
      setNotes([]);
      setLoadingIntNotes("issue");
      setTimeout(() => {
        setLoadingIntNotes("default");
      }, 2000);
    }
  };

  //first time load
  useEffect(() => {
    console.log("username for addnote page is ", username);
    loadNotes();
  }, []);

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

      // Properly update notes state with the new note
      setNotes((alldata) => [
        ...alldata,
        {
          id: data.id,
          noteTitle: noteTitle.trim() ? noteTitle.trim() : "",
          noteContent: noteContent.trim() ? noteContent.trim() : "",
          timeStamp: ctimestamp,
        },
      ]);

      // Reset form fields
      setNoteTitle("");
      setNoteContent("");
      setShowForm(false);
      setFormStatus("success");

      // Refresh notes list
      loadNotes();
    } catch (error) {
      setFormStatus("issue");
    } finally {
      setTimeout(() => {
        setFormStatus("default");
      }, 2000);
    }
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
          <Text style={styles.notesHeaderText}>Your Notes</Text>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RenderNote note={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyNotesText}>
                No notes found. Create one!
              </Text>
            }
            contentContainerStyle={styles.notesList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E0FF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  prepEaseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A148C",
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D1C4E9",
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A148C",
  },
  nameText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A148C",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4A148C",
    marginBottom: 20,
  },
  marginbottomapply: {
    marginBottom: 4,
  },
  getStartedButton: {
    backgroundColor: "#7B1FA2",
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
    color: "#4A148C",
    marginBottom: 10,
  },
  cardsContainer: {
    padding: 10,
  },
  bottomNav: {
    height: 60,
    backgroundColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
  },
  homeIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#D1C4E9",
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
    color: "#4A148C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1C4E9",
    borderRadius: 25,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#4A148C",
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
    backgroundColor: "#7B1FA2",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#7B1FA2",
  },
  cancelButtonText: {
    color: "#7B1FA2",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyNotesText: {
    textAlign: "center",
    color: "#7B1FA2",
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
