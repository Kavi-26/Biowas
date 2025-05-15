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
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const { t } = useTranslation();
  const tipsData = t('home.tips', { returnObjects: true });

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
      <Text style={styles.header}>{t('home.header')}</Text>

      <FlatList
        data={tipsData}
        keyExtractor={(_, idx) => idx.toString()}
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
                <Text style={styles.closeButtonText}>{t('home.close')}</Text>
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
