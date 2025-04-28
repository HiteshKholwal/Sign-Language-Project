import React, { useState } from "react";
import { preprocessTextForSignLanguage } from "./nlp";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import TranslateIcon from "@mui/icons-material/Translate";
import GestureIcon from "@mui/icons-material/Gesture";

export default function SignLanguageApp() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [convertedSigns, setConvertedSigns] = useState([]);
  const [recognizedText, setRecognizedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Speech-to-text logic
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">
          Your browser does not support speech recognition. Try Chrome desktop.
        </Typography>
      </Box>
    );
  }

  // Convert text to sign (dummy logic; replace with your actual mapping)
  const handleTextToSign = () => {
    setLoading(true);
    setTimeout(() => {
      // Use NLP preprocessing here
      const keywords = preprocessTextForSignLanguage(textInput);
      // Map keywords to sign images/GIFs
      const signs = keywords.map(word => ({
        word,
        img: "https://img.icons8.com/ios-filled/100/000000/hand.png" // Example placeholder image
      }));
      setConvertedSigns(signs);
      setLoading(false);
    }, 800);
  };
  

  // Dummy sign-to-text logic
  const handleSignToText = () => {
    setLoading(true);
    setTimeout(() => {
      setRecognizedText("Hello world (recognized from sign)");
      setLoading(false);
    }, 800);
  };

  // Use transcript as input
  const handleUseTranscript = () => setTextInput(transcript);

  return (
    <>
      {/* AppBar/Header */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <GestureIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sign Language Conversion App
          </Typography>
          <Button color="inherit" href="#">
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab icon={<TranslateIcon />} label="Text/Audio to Sign" />
            <Tab icon={<GestureIcon />} label="Sign to Text" />
          </Tabs>

          {/* Text/Audio to Sign Tab */}
          {tab === 0 && (
            <Box>
              <Stack spacing={2}>
                <TextField
                  label="Enter text"
                  variant="outlined"
                  fullWidth
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  multiline
                  minRows={2}
                />
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color={listening ? "success" : "default"}
                    onClick={() => SpeechRecognition.startListening({ continuous: true })}
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton onClick={SpeechRecognition.stopListening} color="error">
                    <StopIcon />
                  </IconButton>
                  <IconButton onClick={resetTranscript} color="warning">
                    <ReplayIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUseTranscript}
                    disabled={!transcript}
                  >
                    Use Voice Text
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  <strong>Voice Input:</strong> {transcript}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleTextToSign}
                  startIcon={<TranslateIcon />}
                  disabled={!textInput.trim()}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Convert to Sign Language
                </Button>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                    {convertedSigns.map((sign, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          textAlign: "center",
                          minWidth: 80,
                          mt: 2,
                        }}
                      >
                        <img
                          src={sign.img}
                          alt={sign.word}
                          width={64}
                          height={64}
                          style={{
                            borderRadius: theme.shape.borderRadius,
                            background: "#f5f5f5",
                            marginBottom: 8,
                          }}
                        />
                        <Typography variant="caption">{sign.word}</Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* Sign to Text Tab */}
          {tab === 1 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <em>
                  (Sign-to-text recognition coming soon! This is a placeholder for webcam/gesture input.)
                </em>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignToText}
                startIcon={<GestureIcon />}
                sx={{ mb: 2 }}
              >
                Recognize Sign (Demo)
              </Button>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="h6" color="secondary">
                  {recognizedText}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          bgcolor: "background.paper",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Sign Language Conversion Project
        </Typography>
      </Box>
    </>
  );
}
