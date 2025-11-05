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

# Java programming language
# brute force
# public static int[] bruteForceTwoSum(int[] nums, int target) {
#         int n = nums.length;
#         for (int i = 0; i < n; i++) {
#             for (int j = i + 1; j < n; j++) {
#                 if (nums[i] + nums[j] == target) {
#                     return new int[]{i, j};
#                 }
#             }
#         }
#         return null; // no pair found
#     }

# import java.util.HashMap;
# import java.util.Map;

# Optimized
# public static int[] bruteForceTwoSum(int[] nums, int target) {
#     Map<Integer, Integer> numMap = new HashMap<>();
#     for (int i = 0; i < nums.length; i++) {
#         int complement = target - nums[i];
#         if (numMap.containsKey(complement)) {
#             return new int[]{numMap.get(complement), i};
#         }
#         numMap.put(nums[i], i);
#     }
#     return null; // no pair found
# }


# C programming language
# brute force
# int* brute_force_two_sum(int* nums, int n, int target) {
#     for (int i = 0; i < n; i++) {
#         for (int j = i + 1; j < n; j++) {
#             if (nums[i] + nums[j] == target) {
#                 int* result = (int*)malloc(2 * sizeof(int));
#                 result[0] = i;
#                 result[1] = j;
#                 return result; // return indices as an array
#             }
#         }
#     }
#     return NULL; // no pair found
# }

# optimized
#include <stdlib.h>

# // --- Start of Hash Table Implementation ---

# typedef struct Entry {
#     int key;
#     int value; // Stores the index of the number
#     struct Entry* next;
# } Entry;

# typedef struct HashTable {
#     int size;
#     Entry** table;
# } HashTable;

# // A simple hash function
# unsigned int hash(int key, int table_size) {
#     // Using absolute value to handle negative keys consistently
#     return (unsigned int)abs(key) % table_size;
# }

# // Function to create a new hash table
# HashTable* createHashTable(int size) {
#     if (size <= 0) return NULL; // Handle invalid size
#     HashTable* ht = (HashTable*)malloc(sizeof(HashTable));
#     if (ht == NULL) return NULL; // Malloc failed
#     ht->size = size;
#     ht->table = (Entry**)calloc(size, sizeof(Entry*)); // Initialize with NULLs
#     if (ht->table == NULL) {
#         free(ht);
#         return NULL; // Calloc failed
#     }
#     return ht;
# }

# // Function to insert a key-value pair into the hash table
# // Value here is the index of the number in the original array
# void insert(HashTable* ht, int key, int value) {
#     if (ht == NULL) return;
#     unsigned int index = hash(key, ht->size);
#     Entry* newEntry = (Entry*)malloc(sizeof(Entry));
#     if (newEntry == NULL) return; // Malloc failed
#     newEntry->key = key;
#     newEntry->value = value;
#     newEntry->next = ht->table[index]; // Prepend to linked list (chaining for collision resolution)
#     ht->table[index] = newEntry;
# }

# // Function to search for a key in the hash table
# // Returns the Entry if found, otherwise NULL
# Entry* search(HashTable* ht, int key) {
#     if (ht == NULL) return NULL;
#     unsigned int index = hash(key, ht->size);
#     Entry* current = ht->table[index];
#     while (current != NULL) {
#         if (current->key == key) {
#             return current;
#         }
#         current = current->next;
#     }
#     return NULL;
# }

# // Function to free all memory allocated for the hash table
# void freeHashTable(HashTable* ht) {
#     if (ht == NULL) return;
#     for (int i = 0; i < ht->size; i++) {
#         Entry* current = ht->table[i];
#         while (current != NULL) {
#             Entry* temp = current;
#             current = current->next;
#             free(temp);
#         }
#     }
#     free(ht->table);
#     free(ht);
# }

# // --- End of Hash Table Implementation ---

# // Optimized function to find two numbers that sum to target
# // Returns a dynamically allocated array of two integers (indices) or NULL if no pair is found
# int* optimized_two_sum(int* nums, int n, int target) {
#     // A hash table is used to store numbers encountered and their indices.
#     // A size heuristic (e.g., N*2) is used for the hash table; a prime number
#     // or dynamically resizing hash table would be more robust for real-world scenarios.
#     int ht_size = (n > 0) ? n * 2 : 1; // Ensure ht_size is at least 1
#     HashTable* ht = createHashTable(ht_size);
#     if (ht == NULL) return NULL; // Failed to create hash table

#     int* result = NULL;

#     for (int i = 0; i < n; i++) {
#         int complement = target - nums[i];
#         Entry* found = search(ht, complement);

#         if (found != NULL) {
#             // If the complement is found in the hash table, we have our pair.
#             // Allocate memory for the result array.
#             result = (int*)malloc(2 * sizeof(int));
#             if (result == NULL) {
#                 freeHashTable(ht);
#                 return NULL; // Malloc failed
#             }
#             result[0] = found->value; // Index of the complement
#             result[1] = i;           // Current number's index
#             freeHashTable(ht);       // Clean up hash table memory before returning
#             return result;
#         }

#         // If the complement is not found, add the current number and its index to the hash table.
#         insert(ht, nums[i], i);
#     }

#     freeHashTable(ht); // Clean up if no pair was found
#     return NULL;       // No pair found
# }


# JavaScript programming language
# // brute force
# function bruteForceTwoSum(nums, target) {
#   const n = nums.length;
#   for (let i = 0; i < n; i++) {
#     for (let j = i + 1; j < n; j++) {
#       if (nums[i] + nums[j] === target) {
#         return [i, j];
#       }
#     }
#   }
#   return null; // no pair found
# }

# // optimized
# function optimizedTwoSum(nums, target) {
#   const numMap = new Map(); // Stores number -> index
#   const n = nums.length;

#   for (let i = 0; i < n; i++) {
#     const currentNum = nums[i];
#     const complement = target - currentNum;

#     if (numMap.has(complement)) {
#       // Found the complement, return its index and the current index
#       return [numMap.get(complement), i];
#     }

#     // If complement not found, add current number and its index to the map
#     numMap.set(currentNum, i);
#   }

#   return null; // No pair found
# }

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