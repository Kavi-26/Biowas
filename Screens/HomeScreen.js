import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';

const tipsData = [
  {
    id: '1',
    title: 'What is Bio-waste?',
    content:
      'Bio-waste refers to biodegradable waste such as food scraps, garden waste, and manure that can be composted or converted into biogas.',
  },
  {
    id: '2',
    title: 'Segregate Waste Properly',
    content:
      'Always separate bio-waste from plastics and other non-biodegradables to help the environment and improve recycling efficiency.',
  },
  {
    id: '3',
    title: 'Composting at Home',
    content:
      'You can compost food waste like fruit peels, vegetable scraps, and eggshells to create organic fertilizer for your garden.',
  },
  {
    id: '4',
    title: 'Use Biodegradable Bags',
    content:
      'When disposing of bio-waste, use compostable or biodegradable bags instead of plastic to prevent pollution.',
  },
  {
    id: '5',
    title: 'Avoid Contamination',
    content:
      'Don’t throw metals, plastics, or glass in the bio-waste bin. It contaminates the waste and makes it hard to compost.',
  },
];

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);

  const openTip = (tip) => {
    setSelectedTip(tip);
    setModalVisible(true);
  };

  const closeTip = () => {
    setModalVisible(false);
    setSelectedTip(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🌱 Bio-Waste Tips</Text>

      <FlatList
        data={tipsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.tipCard} onPress={() => openTip(item)}>
            <Text style={styles.tipTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for tip details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeTip}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedTip?.title}</Text>
              <Text style={styles.modalText}>{selectedTip?.content}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeTip}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f3e6' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  tipCard: {
    backgroundColor: '#b7e4c7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b4332',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#2d6a4f',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;
