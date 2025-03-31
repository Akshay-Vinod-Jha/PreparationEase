import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { db, collection, getDocs } from "@/firebaseConfig";
import NoteCard from "@/components/Notecard";
import { Colors } from "@/styles/Colors";
const LanguageDetectorScreen = () => {
  const { username } = useLocalSearchParams();
  const [status, setStatus] = useState("default"); // "default", "loading", "issue"
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (username) {
      getAllNotes(username);
    }
  }, [username]);

  const getAllNotes = async (username) => {
    try {
      setStatus("loading");
      const collectionRef = collection(db, `users/${username}/notes`);
      const snapshot = await getDocs(collectionRef);
      const notesData = snapshot.docs.map((val) => ({
        id: val.id,
        ...val.data(),
      }));
      setNotes(notesData);
      setFilteredNotes(notesData); // Set filtered notes initially
      setStatus("default");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
      setFilteredNotes([]);
      setStatus("issue");
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter((note) =>
        note.noteTitle.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const renderNoteCard = ({ item }) => (
    <NoteCard
      noteTitle={item.noteTitle ? item.noteTitle : "No Title"}
      noteContent={
        item.noteContent ? item.noteContent : "No Description For Title"
      }
      timestamp={item.timeStamp ? item.timeStamp : "No Timestamp Available"}
      id={item.id}
      onPress={(id) => console.log("Note clicked:", id)}
      loc={"translatenote"}
      username={username}
      dir={"translatenotes"}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Translate Notes</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Note"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Status Handling */}
      {status === "loading" && (
        <ActivityIndicator size="large" color="#7B1FA2" />
      )}
      {status === "issue" && (
        <Text style={styles.errorText}>Failed to load notes. Try again.</Text>
      )}

      {/* Notes List */}
      {status === "default" && filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteCard}
          contentContainerStyle={styles.notesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        status === "default" && (
          <Text style={styles.emptyText}>No notes found.</Text>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  notesList: {
    paddingBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});

export default LanguageDetectorScreen;
