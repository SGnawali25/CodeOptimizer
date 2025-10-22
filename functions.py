def brute_force_two_sum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return (i, j)
    return None
# [[1,3,5,9], 8]
def optimized_two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return (num_map[complement], i)
        num_map[num] = i
    return None

def natural_sum(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

def arr_sum(arr):
    total = 0
    for num in arr:
        total += num
    return total