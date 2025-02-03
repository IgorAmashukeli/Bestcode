#include <iostream>
#include <chrono>
#include <future>

int summa(int n, int k) {
    int* a = nullptr;
    return *a + n + k;
}



std::chrono::milliseconds max_time(0);


int helper(int a, int b) {
    auto start_time = std::chrono::high_resolution_clock::now();
    
    int res = summa(a, b);
    auto end_time = std::chrono::high_resolution_clock::now();
    auto cur_time = std::chrono::duration_cast<std::chrono::milliseconds>(end_time - start_time);
    if (cur_time > max_time) {
        max_time = cur_time;
    }
    return res;
}

int main() {
    int test_case_num = 0;
    const int time_limit_seconds = 1; 

    for (int i = 0; i < 10; ++i) {
        for (int j = 0; j < 10; ++j) {
            int correct_result = i + j;
            int result;

            std::future<int> future_result = std::async(std::launch::async, helper, i, j);
            auto status = future_result.wait_for(std::chrono::seconds(time_limit_seconds));

            if (status == std::future_status::timeout) {
                std::cout << "TL!\n";
                exit(0);
            }

            result = future_result.get();


            if (result != correct_result) {
                std::cout << "WA!\n";
                std::cout << test_case_num << "\n";
                std::cout << "input: " << i << " " << j << "\n";
                std::cout << "correct output: " << correct_result << "\n";
                std::cout << "your output: " << result << "\n";
                return 0;
            }

            test_case_num++;
        }
    }
    std::cout << "OK\n";
    std::cout << max_time << "\n";
    return 0;
}

