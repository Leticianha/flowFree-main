import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons/'

const GRID_SIZE = 5;

const FlowFreeGame = () => {
  const initialGrid = [
    ['blue', 'white', 'white', 'white', 'yellow'],
    ['green', 'white', 'yellow', 'green', 'white'],
    ['white', 'white', 'white', 'blue', 'white'],
    ['white', 'white', 'white', 'white', 'white'],
    ['red', 'white', 'white', 'white', 'red']
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [initialCell, setInitialCell] = useState(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [currentRound, setCurrentRound] = useState(1); // State to track current round

  useEffect(() => {
    // Check for win condition when the grid updates
    if (!isRestarting && isWinConditionMet()) {
      setIsModalVisible(true); // Show modal when win condition is met
    }
  }, [grid]);

  const isWinConditionMet = () => {
    // Check if all cells are filled and connected
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 'white') return false;
      }
    }
    return true;
  };

  const isCellFixed = (row, col) => {
    return grid[row][col] === 'white' || (row === initialCell?.row && col === initialCell?.col);
  };

  const handleCellPress = (row, col) => {
    const cellColor = grid[row][col];

    // Check if the cell is already selected
    const isSelectedCell = selectedCells.find(cell => cell.row === row && cell.col === col);

    // Check if the clicked cell is an initial cell and already selected
    const isInitialAndSelected = initialCell && initialCell.row === row && initialCell.col === col && isSelectedCell;

    if (!isInitialAndSelected) {
      if (!isSelectedCell) {
        if (!selectedColor && cellColor !== 'white') {
          setSelectedColor(cellColor);
          setSelectedCells([{ row, col }]);
          setInitialCell({ row, col });
        } else if (cellColor === 'white' && selectedColor) {
          const newGrid = [...grid];
          newGrid[row][col] = selectedColor;
          setGrid(newGrid);
          setSelectedCells([...selectedCells, { row, col }]);
        } else if (cellColor === selectedColor && selectedCells.length > 0) {
          const newGrid = [...grid];
          selectedCells.forEach(cell => {
            newGrid[cell.row][cell.col] = selectedColor;
          });
          setGrid(newGrid);
          setSelectedColor(null);
          setSelectedCells([]);
        } else if (cellColor !== selectedColor && selectedCells.length > 0) {
          const newGrid = [...grid];
          selectedCells.forEach(cell => {
            if (newGrid[cell.row][cell.col] === selectedColor && !(cell.row === initialCell.row && cell.col === initialCell.col)) {
              newGrid[cell.row][cell.col] = 'white';
            }
          });
          setGrid(newGrid);
          setSelectedColor(null);
          setSelectedCells([]);
        }
      } else {
        // If the cell is already selected, deselect it (make it white)
        const newGrid = [...grid];
        newGrid[row][col] = 'white';
        setGrid(newGrid);
        setSelectedCells(selectedCells.filter(cell => !(cell.row === row && cell.col === col)));
      }
    }
  };

  const restartGame = () => {
    setGrid(initialGrid);
    setSelectedColor(null);
    setSelectedCells([]);
    setInitialCell(null);
    setIsRestarting(true); // Set to true to prevent cell presses during restart
    setTimeout(() => setIsRestarting(false), 100); // Reset isRestarting after a short delay
    setIsModalVisible(false); // Hide modal when restarting game
    setCurrentRound(1); // Reset current round to 1
  };

  const nextRound = () => {
    if (currentRound < 5) {
      setGrid(initialGrid); // Reset grid for next round
      setSelectedColor(null);
      setSelectedCells([]);
      setInitialCell(null);
      setIsModalVisible(false); // Hide modal
      setCurrentRound(currentRound + 1); // Increment current round
    } else {
      // Game completed all rounds, you can implement what to do here
    }
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((color, colIndex) => (
          <TouchableOpacity
            key={colIndex}
            style={[styles.cell, { backgroundColor: color }]}
            onPress={() => handleCellPress(rowIndex, colIndex)}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>{renderGrid()}</View>
      <TouchableOpacity onPress={restartGame} style={styles.button}>
        <Ionicons size={40} color={"#fff"} name="refresh-outline" />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Você ganhou a rodada {currentRound}!</Text>
            {currentRound < 5 && (
              <TouchableOpacity onPress={nextRound} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Próxima Rodada</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FlowFreeGame;
