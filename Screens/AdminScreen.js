import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const AdminScreen = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleImage = async (pickerResult) => {
    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      const uri = asset.uri;
      setImage(uri);
      setIsLoading(true);

      try {
        const base64 = asset.base64;
        if (!base64) throw new Error("No base64 data found");

        // Send base64 image to goqr.me API
        const formData = new FormData();
        formData.append("file", {
          uri: `data:image/jpeg;base64,${base64}`,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const response = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        const qrData = result[0]?.symbol[0]?.data;

        if (qrData) {
          setIsLoading(false);
          navigation.navigate('PointsScreen', { 
            imageUri: uri,
            userUid: qrData.trim() // Pass QR data as userUid
          });
        } else {
          throw new Error('No QR Code found');
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert("Error", error.message || "Could not process QR code");
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
        quality: 1, // Use maximum quality for better QR code reading
        base64: true, // Needed for QR code scanning
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
        quality: 1, // Use maximum quality for better QR code reading
        base64: true, // Needed for QR code scanning
      });
      await handleImage(result);
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>QR Code Scanner</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cameraButton]} 
            onPress={takePhoto}
          >
            <Text style={styles.buttonText}>📸 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.galleryButton]} 
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.buttonText}>❌ Clear Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>No Image Selected</Text>
            <Text style={styles.placeholderText}>
              Take a photo or select one from your gallery to scan a QR code
            </Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Processing QR Code...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4285F4",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
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
  },
  cameraButton: {
    backgroundColor: "#4285F4",
  },
  galleryButton: {
    backgroundColor: "#0F9D58",
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
    backgroundColor: "rgba(0,0,0,0.5)",
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