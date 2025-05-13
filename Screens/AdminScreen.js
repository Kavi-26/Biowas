import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const AdminScreen = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const imageContainerRef = useRef(null);

  const handleImage = async (pickerResult) => {
    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      const uri = asset.uri;
      setImage(uri);
      setIsLoading(true);

      try {
        // Skip QR code processing and redirect directly
        if (imageContainerRef.current) {
          await imageContainerRef.current.zoomOut(500);
        }
        setIsLoading(false);
        
        // Navigate directly to PointsScreen with the image URI
        navigation.navigate("PointsScreen", {
          imageUri: uri,
          userUid: "direct-access",
          transition: "zoomOut"
        });
      } catch (error) {
        setIsLoading(false);
        Alert.alert("Error", error.message || "Could not process image");
      }
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow gallery access!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      await handleImage(result);
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow camera access!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      await handleImage(result);
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4285F4", "#34A853"]} style={styles.container}>
        <Animatable.View animation="fadeIn" duration={1000} style={styles.header}>
          <Text style={styles.headerText}>QR Code Scanner</Text>
        </Animatable.View>

        <View style={styles.content}>
          <Animatable.View animation="slideInUp" duration={1000} style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto}>
              <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.buttonText}>
                📸 Take Photo
              </Animatable.Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage}>
              <Text style={styles.buttonText}>🖼️ Gallery</Text>
            </TouchableOpacity>
          </Animatable.View>

          {image ? (
            <Animatable.View
              ref={imageContainerRef}
              animation="zoomIn"
              duration={500}
              style={styles.imageContainer}
            >
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  imageContainerRef.current?.fadeOut(500).then(() => {
                    setImage(null);
                  });
                }}
              >
                <Text style={styles.buttonText}>❌ Clear Image</Text>
              </TouchableOpacity>
            </Animatable.View>
          ) : (
            <Animatable.View animation="fadeIn" style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>No Image Selected</Text>
              <Text style={styles.placeholderText}>
                Take a photo or select one from your gallery to scan a QR code
              </Text>
            </Animatable.View>
          )}

          {isLoading && (
            <Animatable.View animation="fadeIn" style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Processing QR Code...</Text>
            </Animatable.View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  cameraButton: {
    backgroundColor: "rgba(66, 133, 244, 0.9)",
  },
  galleryButton: {
    backgroundColor: "rgba(15, 157, 88, 0.9)",
  },
  clearButton: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
    resizeMode: "contain",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "white",
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#666",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminScreen;