#include <iostream>

// Error: Array out of bounds access
int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    
    // Accessing beyond array size
    std::cout << "Array access:" << std::endl;
    for (int i = 0; i <= 10; i++) {
        std::cout << arr[i] << std::endl;  // Error when i >= 5
    }
    
    return 0;
}
