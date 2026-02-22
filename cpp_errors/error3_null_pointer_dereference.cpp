#include <iostream>

// Error: Null pointer dereference
class Person {
public:
    std::string name;
    Person(std::string n) : name(n) {}
};

int main() {
    Person* ptr = nullptr;
    
    // Dereferencing null pointer - error!
    std::cout << "Name: " << ptr->name << std::endl;
    
    return 0;
}
