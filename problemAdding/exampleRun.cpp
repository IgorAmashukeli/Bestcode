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
  int test_case_count = 3;
  int time_limit_seconds = 1;
  int arr[3][2];
  arr[0][0] = 1;
  arr[0][1] = 2;
  arr[1][0] = 2;
  arr[1][1] = 2;
  arr[2][0] = 3;
  arr[2][1] = 3;

  for (int k = 0; k < test_case_count; ++k) {
    int i = arr[k][0];
    int j = arr[k][1];
    int correct_result = i + j;
    int result;

    std::future<int> future_result = std::async(std::launch::async, helper, i, j);
    auto status = future_result.wait_for(std::chrono::seconds(time_limit_seconds));

    if (status == std::future_status::timeout) {
        std::cout << "TL!\n";
        exit(0);
    }

    result = future_result.get();

    result = summa(i, j);

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

  std::cout << "OK\n";
  std::cout << max_time << "\n";

  return 0;
}