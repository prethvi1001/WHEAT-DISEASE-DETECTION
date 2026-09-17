import os
import numpy as np

# Set TensorFlow log level to suppress messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
    from tensorflow.keras.utils import to_categorical
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("Warning: TensorFlow not installed. 'train.py' will simulate model compilation and saving.")

# Configuration
IMAGE_SIZE = 224
NUM_CLASSES = 7
CLASSES = [
    'Healthy Wheat', 
    'Leaf Rust', 
    'Stripe Rust', 
    'Stem Rust', 
    'Powdery Mildew', 
    'Leaf Blight', 
    'Septoria Leaf Blotch'
]

def build_cnn_model():
    """
    Builds the CNN model architecture matching the project requirements:
    Input Layer -> Conv2D -> ReLU -> MaxPooling -> Conv2D -> ReLU -> MaxPooling -> Conv2D -> Flatten -> Dense -> Dropout -> Softmax
    """
    if not TENSORFLOW_AVAILABLE:
        print("TensorFlow is not available. Skipping model compilation.")
        return None

    model = Sequential([
        # Input Layer & Conv2D + ReLU (implicit activation parameter)
        Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 3)),
        Conv2D(32, (3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        
        # Second Conv2D + ReLU + MaxPooling
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        
        # Third Conv2D (No maxpooling after it, then flatten)
        Conv2D(128, (3, 3), activation='relu'),
        
        # Flatten
        Flatten(),
        
        # Dense Layer
        Dense(128, activation='relu'),
        
        # Dropout
        Dropout(0.5),
        
        # Softmax Output Layer
        Dense(NUM_CLASSES, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def generate_mock_dataset(num_samples=70):
    """
    Generates dummy image data for training when real dataset is not loaded.
    This simulates 10 samples per disease class of size (224, 224, 3).
    """
    print(f"Generating mock dataset of {num_samples} samples...")
    X = np.random.rand(num_samples, IMAGE_SIZE, IMAGE_SIZE, 3).astype(np.float32)
    y = np.repeat(np.arange(NUM_CLASSES), num_samples // NUM_CLASSES)
    # Shuffle
    indices = np.arange(num_samples)
    np.random.shuffle(indices)
    X = X[indices]
    y = y[indices]
    
    y_cat = to_categorical(y, num_classes=NUM_CLASSES) if TENSORFLOW_AVAILABLE else y
    return X, y_cat

def train_and_save():
    os.makedirs('model', exist_ok=True)
    
    if not TENSORFLOW_AVAILABLE:
        print("Creating mock model file for simulation purposes...")
        with open('model/wheat_disease_model.h5', 'w') as f:
            f.write("MOCK_CNN_MODEL_DATA_FALLBACK_ACTIVE")
        print("Mock model successfully saved to 'model/wheat_disease_model.h5'.")
        return
        
    model = build_cnn_model()
    model.summary()
    
    # Generate mock training and validation data
    X_train, y_train = generate_mock_dataset(70)
    X_val, y_val = generate_mock_dataset(21)
    
    print("\nStarting Model Training...")
    # Train for a few epochs for demonstration
    history = model.fit(
        X_train, y_train,
        epochs=5,
        batch_size=7,
        validation_data=(X_val, y_val),
        verbose=1
    )
    
    # Save the trained model
    model_path = 'model/wheat_disease_model.h5'
    model.save(model_path)
    print(f"\nModel successfully trained and saved to '{model_path}'.")

if __name__ == '__main__':
    train_and_save()
