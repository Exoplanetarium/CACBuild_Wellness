// FullScreenChart.js

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Orientation from 'react-native-orientation-locker'; 
import { Ionicons } from '@expo/vector-icons'; // For close icon

const FullScreenChart = ({ onClose, compileMoodData, getFilteredDates, theme }) => {
  const [zoomLevel, setZoomLevel] = useState(1); // For handling zoom
  const [isLandscape, setIsLandscape] = useState(false); // Track orientation
  const [dimensions, setDimensions] = useState(Dimensions.get('window')); // Current window dimensions
  const [isReady, setIsReady] = useState(false); // To track if orientation is locked

  const moodData = compileMoodData();

  // Add invisible points at -100 and 100 to ensure full y-axis range
  const invisiblePoints = [100, -100];

  useEffect(() => {
    console.log('FullScreenChart rendered');
    Orientation.lockToLandscape();

    // Orientation change listener
    const orientationChangeListener = (orientation) => {
      if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    Orientation.addOrientationListener(orientationChangeListener);

    // Dimensions change listener using subscription
    const dimensionSubscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => {
      // lock back to portrait when modal is closed
      Orientation.lockToPortrait();

      // Remove orientation listener
      Orientation.removeOrientationListener(orientationChangeListener);

      // Remove dimensions listener using subscription
      if (dimensionSubscription && dimensionSubscription.remove) {
        dimensionSubscription.remove();
      }
    };
  }, []);

  // Handlers for zoom controls
  const handleZoomIn = () => {
    if (zoomLevel < 3) setZoomLevel(zoomLevel + 0.5); // Increase zoom
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel - 0.5); // Decrease zoom
  };

  // Calculate dynamic chart width based on zoom level
  const chartWidth = dimensions.width * zoomLevel;

  // Prepare chart data ensuring datasets have the same length as labels
  const prepareChartData = () => {
    const labels = [...getFilteredDates(), '', '']; // Adding empty labels for invisible points
    const mainData = [...moodData.map(log => log.averageMood), ...invisiblePoints];
    const secondaryData = [...invisiblePoints]; // Only two points

    // Ensure both datasets have the same length as labels
    const paddedMainData = [...mainData];
    while (paddedMainData.length < labels.length) {
      paddedMainData.push(paddedMainData[paddedMainData.length - 1]);
    }

    return {
      labels,
      datasets: [
        {
          data: paddedMainData,
          color: (opacity = 1, index) => {
            if (index < moodData.length) {
              return moodData[index]?.color || theme.colors.primary;
            }
            return 'transparent'; // Invisible points
          },
          strokeWidth: 2,
        },
        {
          data: secondaryData,
          color: (opacity = 0) => 'transparent', // Make the line transparent
          strokeWidth: 0, // No stroke to avoid connecting these points
          withDots: false, // No dots for these points
        },
      ],
    };
  };

 // Show loading indicator until orientation is confirmed
 if (!isLandscape) {
  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onBackground, marginTop: 10 }}>Adjusting Orientation...</Text>
      </View>
    </Modal>
  );
}

return (
  <Modal
    visible={true}
    animationType="slide"
    transparent={false}
    onRequestClose={onClose}
  >
    <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={50} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* ScrollView for Zooming */}
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsHorizontalScrollIndicator={false}
      >
        <LineChart
          data={{
            labels: moodData.map(log => log.date), // Align labels with data points
            datasets: [
              {
                data: moodData.map(log => log.averageMood),
                color: (opacity = 1, index) => moodData[index]?.color || theme.colors.primary, // Actual mood data
                strokeWidth: 2,
              },
              {
                data: invisiblePoints, // Invisible points dataset
                color: (opacity = 0) => 'transparent', // Make the line transparent
                strokeWidth: 0, // No stroke to avoid connecting these points
                withDots: false, // No dots for these points
              },
            ],
          }}
          width={chartWidth} // Dynamic width based on zoom level
          height={dimensions.height * 0.8} // Adjust height to fit screen
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: (opacity = 1) => theme.colors.onBackground,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              stroke: '#e3e3e3',
              strokeDasharray: '0',
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: theme.colors.primary,
            },
          }}
          bezier
          style={styles.chart}
          verticalLabelRotation={-45} // Rotate labels for better alignment
          fromZero={false}
          segments={10}
          onDataPointClick={({ index, value }) => {
            Alert.alert(`Date: ${moodData[index]?.date}`, `Mood Value: ${value}`);
          }}
        />
      </ScrollView>

      {/* Zoom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleZoomIn}
          style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleZoomOut}
          style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.onBackground }]}>Mood</Text>
        </View>
      </View>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 30,
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
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default FullScreenChart;
