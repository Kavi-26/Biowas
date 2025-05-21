import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Enhanced card icons based on tip titles
const getIconForTip = (title) => {
  if (title.includes('Bio-waste')) return 'recycle';
  if (title.includes('Compost')) return 'sprout';
  if (title.includes('Segregate')) return 'sort';
  if (title.includes('Biodegradable')) return 'leaf';
  if (title.includes('Contamination')) return 'alert-circle-outline';
  return 'leaf-maple';
};

const HomeScreen = () => {
  const { t } = useTranslation();
  const tipsData = t('home.tips', { returnObjects: true });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const modalRef = useRef();
  
  const openTip = (tip) => {
    setSelectedTip(tip);
    setModalVisible(true);
  };

  const closeTip = () => {
    if (modalRef.current) {
      modalRef.current.fadeOut(300).then(() => {
        setModalVisible(false);
        setSelectedTip(null);
      });
    } else {
      setModalVisible(false);
      setSelectedTip(null);
    }
  };

  const renderTipCard = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 150}
      duration={800}
      style={styles.cardContainer}>
      <TouchableOpacity 
        style={styles.tipCard} 
        onPress={() => openTip(item)}
        activeOpacity={0.75}>
        <LinearGradient
          colors={index % 2 === 0 ? ['#b7e4c7', '#95d5b2'] : ['#a0d6b0', '#80cbc4']}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.gradientCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={getIconForTip(item.title)} 
              size={28}
              color="#2d6a4f" 
            />
          </View>
          <Text style={styles.tipTitle}>{item.title}</Text>
          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#2d6a4f" 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e6f3e6" />
      <LinearGradient
        colors={['#e6f3e6', '#d8f3dc', '#e1f4e7']}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            style={styles.headerContainer}>
            <Animatable.Text 
              animation="fadeInDown"
              duration={1000}
              style={styles.header}>
              {t('home.header')}
            </Animatable.Text>
            <View style={styles.divider} />
          </Animatable.View>

          <FlatList
            data={tipsData}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={renderTipCard}
            showsVerticalScrollIndicator={false}
          />

          <Modal
            visible={modalVisible}
            animationType="none"
            transparent={true}
            onRequestClose={closeTip}>
            <View style={styles.modalContainer}>
              <Animatable.View 
                ref={modalRef}
                animation="zoomIn"
                duration={400}
                style={styles.modalContent}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalHeader}>
                    <MaterialCommunityIcons 
                      name={getIconForTip(selectedTip?.title || '')} 
                      size={32} 
                      color="#2d6a4f" 
                      style={styles.modalIcon}
                    />
                    <Text style={styles.modalTitle}>{selectedTip?.title}</Text>
                  </View>
                  <View style={styles.modalDivider} />
                  <Text style={styles.modalText}>{selectedTip?.content}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={closeTip}
                    activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#2d6a4f', '#1b4332']}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={styles.gradientButton}>
                      <Ionicons name="close-circle-outline" size={18} color="white" style={styles.buttonIcon} />
                      <Text style={styles.closeButtonText}>{t('home.close')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </Animatable.View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerImageContainer: {
    height: 60,
    width: 60,
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d6a4f',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    width: width * 0.4,
    height: 3,
    backgroundColor: '#2d6a4f',
    borderRadius: 10,
    marginBottom: 15,
    opacity: 0.3,
  },
  listContainer: {
    padding: 16,
    paddingTop: 5,
  },
  cardContainer: {
    marginBottom: 16,
  },
  tipCard: {
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
  },
  gradientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    height: 80,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1b4332',
    letterSpacing: 0.25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b4332',
    letterSpacing: 0.5,
  },
  modalDivider: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 18,
    borderRadius: 1,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 25,
    textAlign: 'justify',
  },
  closeButton: {
    alignSelf: 'center',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
