import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";

export default function DisplayIndNote() {
  const { noteTitle, noteContent, timestamp, id } = useLocalSearchParams();
  const [status, setStatus] = useState("default");
  const [response, setResponse] = useState(null);
  const [probableLanguages, setProbableLanguages] = useState([]);

  const detectLang = async () => {
    console.log("Start detecting language...");
    setStatus("loading");

    try {
      const res = await fetch("http://192.168.1.101:5000/detect-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteContent }),
      });

      const data = await res.json();

      if (data.status === "pass") {
        setResponse({ language: data.language });

        const parsedProbableLanguages = data.probable_languages
          .replace(/\[|\]/g, "")
          .split(",")
          .map((item) => {
            const [lang, prob] = item.split(":");
            return {
              language: lang.trim(),
              probability: parseFloat(prob).toFixed(4),
            };
          });

        setProbableLanguages(parsedProbableLanguages);
        setStatus("success");
      } else {
        setResponse(null);
        setProbableLanguages([]);
        setStatus("issue");
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setStatus("issue");
    }

    console.log("End detecting language...");
  };

  useEffect(() => {
    if (noteTitle && noteContent && timestamp && id) {
      console.log("Fetching data for:", id, noteTitle, noteContent, timestamp);
      detectLang();
    }
  }, [noteTitle, noteContent, timestamp, id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Detected Language</Text>

        {/* Status Handling */}
        {status === "loading" && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5D4A7E" />
            <Text style={styles.loadingText}>Analyzing text...</Text>
          </View>
        )}

        {status === "issue" && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to detect language</Text>
            <TouchableOpacity style={styles.retryButton} onPress={detectLang}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === "success" && response && (
          <>
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Detected Language</Text>
              <Text style={styles.detectedLang}>{response.language}</Text>
            </View>

            {/* Note Information */}
            <View style={styles.noteContainer}>
              <View style={styles.noteMeta}>
                <Text style={styles.noteTitle}>{noteTitle}</Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
              </View>
              <Text style={styles.noteContent}>{noteContent}</Text>
            </View>

            <Text style={styles.sectionHeader}>Analysis Results</Text>
          </>
        )}

        {/* Probable Languages List */}
        {status === "success" && (
          <FlatList
            data={probableLanguages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.languageItem}>
                <Text style={styles.languageText}>{item.language}</Text>
                <View style={styles.probabilityContainer}>
                  <View
                    style={[
                      styles.probabilityBar,
                      { width: `${parseFloat(item.probability) * 100}%` },
                    ]}
                  />
                  <Text style={styles.probabilityText}>{item.probability}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.flatListContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#5D4A7E",
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#F8F0F0",
    borderRadius: 10,
    padding: 24,
    marginTop: 20,
  },
  errorText: {
    color: "#C62828",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#5D4A7E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detectedLang: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D4A7E",
  },
  noteContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  noteContent: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E2E2E",
    marginBottom: 16,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  languageItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E2E2E",
    marginBottom: 8,
  },
  probabilityContainer: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    position: "relative",
    marginTop: 8,
  },
  probabilityBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#5D4A7E",
    borderRadius: 3,
  },
  probabilityText: {
    position: "absolute",
    right: 0,
    top: -20,
    fontSize: 12,
    color: "#666",
  },
});
