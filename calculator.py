def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def main():
    print("Simple Calculator")
    print("-----------------")
    print("Operations: +, -, *, /")

    while True:
        try:
            a = float(input("Enter first number: "))
            op = input("Enter operator (+, -, *, /): ").strip()
            b = float(input("Enter second number: "))

            if op == "+":
                result = add(a, b)
            elif op == "-":
                result = subtract(a, b)
            elif op == "*":
                result = multiply(a, b)
            elif op == "/":
                result = divide(a, b)
            else:
                print("Invalid operator. Please use +, -, *, /")
                continue

            print(f"Result: {a} {op} {b} = {result}")

        except ValueError as e:
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
