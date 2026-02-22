#include <iostream>

// Error: Dangling pointer
int* create_pointer() {
    int local_var = 99;
    // Returning pointer to local variable - error!
    return &local_var;
}

int main() {
    int* dangling = create_pointer();
    
    // Accessing memory that no longer exists
    std::cout << "Dangling pointer value: " << *dangling << std::endl;
    
    return 0;
}
