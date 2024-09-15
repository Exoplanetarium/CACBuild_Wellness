import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Text, Alert, Dimensions, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Orientation from 'react-native-orientation-locker'; 
import { Ionicons } from '@expo/vector-icons'; // For close icon

const FullScreenChart = ({ onClose, compileMoodData, getFilteredDates, theme }) => {
  const [zoomLevel, setZoomLevel] = useState(1); // For handling zoom
  const dimensions = useWindowDimensions(); // Get current window dimensions
  const moodData = compileMoodData();

  // Add invisible points at -100 and 100 to ensure full y-axis range
  const invisiblePoints = [100, -100];

  useEffect(() => {
    console.log('FullScreenChart rendered');
    Orientation.lockToLandscape();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const handleZoomIn = () => {
    if (zoomLevel < 3) setZoomLevel(zoomLevel + 0.5); // Increase zoom
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel - 0.5); // Decrease zoom
  };

  return (
    <Modal visible={true} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <LineChart
          data={{
            labels: [...getFilteredDates(), '', ''], // Adding empty labels for the invisible points
            datasets: [{
              data: moodData.map(log => log.averageMood),
              color: (opacity = 1, index) => moodData[index]?.color || theme.colors.primary, // Actual mood data
            },
            {
              data: invisiblePoints, // Invisible points dataset
              color: (opacity = 0) => 'transparent', // Make the line transparent
              strokeWidth: 0, // No stroke to avoid connecting these points
              withDots: false, // No dots for these points
              propsForDots: { 
                r: "0", // No radius for the invisible points
              },

            },
          ],
          }}
          width={dimensions.width}
          height={dimensions.height * 0.9} // Adjust height to fit screen
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: (opacity = 1) => theme.colors.onBackground,
            propsForBackgroundLines: {
              strokeWidth: 1,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: theme.colors.primary,
            },
            propsForHorizontalLabels: {
              fontSize: 10, // Smaller font for labels
            },
            propsForVerticalLabels: {
              fontSize: 10, // Smaller font for labels
            },
            propsForLabels: {
              
            },
            useShadowColorFromDataset: true,
          }}
          segments={10}
          style={styles.expandedChart}
          withHorizontalLines={true}
          withVerticalLines={true} // Only show horizontal lines
          withInnerLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          decorator={() => {
            return (
              <View
                style={{
                  position: 'absolute',
                  top: dimensions.height * 0.3782, // Center the line at y=0
                  width: dimensions.width,
                  left: 64,
                  height: 1,
                  backgroundColor: 'white',
                }}
              />
            );
          }}
        />

        <View style={styles.controls}>
          <TouchableOpacity onPress={handleZoomIn} style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomOut} style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.controlText}>-</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={50} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  expandedChart: {
    marginHorizontal: 10,
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  controls: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 20,
    right: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  controlText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FullScreenChart;
