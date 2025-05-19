import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, SafeAreaView, Modal, Linking, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { Info, Trash2, Github, Mail, RotateCcw, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { ReactNode } from 'react';

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: () => void;
  isSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { tasks } = useTaskStore();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  
  const totalCompletions = tasks.reduce((sum, task) => sum + task.completionCount, 0);
  
  const handleClearAllTasks = () => {
    // This is just a placeholder - we'd implement this with a confirmation dialog
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const openSourceCode = async () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    // Replace with actual GitHub repository URL
    await WebBrowser.openBrowserAsync('https://github.com/example/todo-app');
  };

  const sendFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    const subject = encodeURIComponent('Todo App Feedback');
    const body = encodeURIComponent('I have some feedback about the Todo app:');
    const mailtoUrl = `mailto:feedback@example.com?subject=${subject}&body=${body}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailtoUrl);
        } else {
          console.log("Can't handle mailto URL");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const openAboutModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setAboutModalVisible(true);
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    action, 
    isSwitch = false, 
    value = false, 
    onValueChange = () => {} 
  }: SettingItemProps) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={isSwitch ? undefined : action}
      activeOpacity={isSwitch ? 1 : 0.7}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
          thumbColor="#fff"
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {tasks.filter(t => t.completed).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalCompletions}</Text>
            <Text style={styles.statLabel}>Total Completions</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <SettingItem
            icon={<Info size={20} color={Colors.light.primary} />}
            title="About"
            subtitle="Learn more about this app"
            action={openAboutModal}
          />
          
          <SettingItem
            icon={<Github size={20} color={Colors.light.primary} />}
            title="Source Code"
            subtitle="View the source code on GitHub"
            action={openSourceCode}
          />
          
          <SettingItem
            icon={<Mail size={20} color={Colors.light.primary} />}
            title="Feedback"
            subtitle="Send feedback or report issues"
            action={sendFeedback}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <SettingItem
            icon={<Trash2 size={20} color="#FF3B30" />}
            title="Clear All Tasks"
            subtitle={`This will delete all ${tasks.length} tasks`}
            action={handleClearAllTasks}
          />
          
          <SettingItem
            icon={<RotateCcw size={20} color={Colors.light.primary} />}
            title="Completion History"
            subtitle={`You've completed tasks ${totalCompletions} times`}
            action={() => {}}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Task Count: {tasks.length}
          </Text>
          <Text style={styles.footerVersion}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Todo App</Text>
              <TouchableOpacity 
                onPress={() => setAboutModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.aboutTitle}>Task Manager</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              
              <Text style={styles.aboutSectionTitle}>Description</Text>
              <Text style={styles.aboutText}>
                A simple and elegant task management app to help you stay organized and productive.
                Track your tasks, set priorities, and monitor your progress.
              </Text>
              
              <Text style={styles.aboutSectionTitle}>Features</Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• Create and manage tasks</Text>
                <Text style={styles.featureItem}>• Categorize with tags</Text>
                <Text style={styles.featureItem}>• Track completion history</Text>
                <Text style={styles.featureItem}>• Filter by status</Text>
                <Text style={styles.featureItem}>• Add notes to tasks</Text>
              </View>
              
              <Text style={styles.aboutSectionTitle}>Credits</Text>
              <Text style={styles.aboutText}>
                Developed with React Native and Expo.
              </Text>
              
              <Text style={styles.copyright}>
                © 2023 Todo App. All rights reserved.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.subtext,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.subtext,
    marginBottom: 8,
    marginLeft: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 2,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: Colors.light.subtext,
    opacity: 0.7,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: Colors.light.subtext,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 16,
    color: Colors.light.subtext,
    lineHeight: 24,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    opacity: 0.7,
  },
});