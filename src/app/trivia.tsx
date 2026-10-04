import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "expo-router";

interface QuestionData {
  question: string;
  correctAnswer: string;
  answers: string[];
}

export default function TriviaScreen() {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, [])
  );

  const fetchQuestion = async () => {
    setLoading(true);
    setShowAnswer(false);

    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=1&category=21&type=multiple&encode=url3986"
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const correct = decodeURIComponent(item.correct_answer);
        const incorrect = item.incorrect_answers.map((ans: string) =>
          decodeURIComponent(ans)
        );

        const allAnswers = [...incorrect, correct].sort(() => Math.random() - 0.5);

        setQuestionData({
          question: decodeURIComponent(item.question),
          correctAnswer: correct,
          answers: allAnswers,
        });
      }
    } catch (error) {
      console.error("Kunde inte hämta fråga:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎤 Pausfråga till publiken</Text>
      <Text style={styles.subtext}>
        Dra igång en frågesport i matchpausen! Läs upp frågan i arenans mikrofon.
      </Text>

      <Pressable style={styles.button} onPress={fetchQuestion}>
        <Text style={styles.buttonText}>
          {loading ? "Hämtar fråga..." : "Hämta ny fråga"}
        </Text>
      </Pressable>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#ffd700"
          style={{ marginTop: 24 }}
        />
      )}

      {questionData && !loading && (
        <View style={styles.card}>
          <Text style={styles.questionText}>{questionData.question}</Text>

          <View style={styles.answersContainer}>
            {questionData.answers.map((answer, index) => (
              <View key={index} style={styles.answerBox}>
                <Text style={styles.answerText}>
                  {String.fromCharCode(65 + index)}: {answer}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.revealButton}
            onPress={() => setShowAnswer(!showAnswer)}
          >
            <Text style={styles.revealButtonText}>
              {showAnswer ? "Dölj rätt svar" : "Visa rätt svar"}
            </Text>
          </Pressable>

          {showAnswer && (
            <View style={styles.correctBox}>
              <Text style={styles.correctLabel}>Rätt svar:</Text>
              <Text style={styles.correctAnswerText}>
                {questionData.correctAnswer}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 6,
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#aaaaaa",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#22c553",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },
  questionText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  answersContainer: {
    gap: 8,
    marginBottom: 16,
  },
  answerBox: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 8,
  },
  answerText: {
    color: "#ffffff",
    fontSize: 15,
  },
  revealButton: {
    backgroundColor: "#ffd700",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  revealButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
  },
  correctBox: {
    marginTop: 12,
    backgroundColor: "#14532d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  correctLabel: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: "bold",
  },
  correctAnswerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
});
