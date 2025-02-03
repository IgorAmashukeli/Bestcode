# Compile the C++ code
g++ --std=c++20 -Wall -Wextra -Werror -fsanitize=address -fsanitize=undefined example.cpp

# Check the exit status of the compilation
if [ $? -eq 0 ]; then
    echo "Compilation successful"
else
    echo "Compilation failed"
fi