import math
import random


def validate_equivalence(original_fn, optimized_fn, test_inputs, tolerance=1e-9):
    """
    Validates that original and optimized functions produce the same outputs.

    Parameters:
        original_fn (callable): The original function.
        optimized_fn (callable): The optimized function.
        test_inputs (list of tuples): Inputs to test with.
        tolerance (float): Allowed difference for floats.

    Returns:
        bool: True if all tests pass, False otherwise.
    """
    for i, inp in enumerate(test_inputs):
        orig_out = original_fn(*inp)
        opt_out = optimized_fn(*inp)

        if isinstance(orig_out, float) or isinstance(opt_out, float):
            if not math.isclose(orig_out, opt_out, rel_tol=tolerance):
                print(f"[FAIL] Test {i+1}: Input={inp} → Original={orig_out}, Optimized={opt_out}")
                return False
        else:
            if orig_out != opt_out:
                print(f"[FAIL] Test {i+1}: Input={inp} → Original={orig_out}, Optimized={opt_out}")
                return False

        print(f"[PASS] Test {i+1}: Input={inp} → Output={orig_out}")

    return True


# ---- Example Functions ----
def original_sum(numbers):
    total = 0
    for n in numbers:
        total += n
    return total

def optimized_sum(numbers):
    return sum(numbers)


if __name__ == "__main__":
    # Example test inputs
    test_inputs = [
        ([1, 2, 3, 4],),           # small list
        (list(range(100)),),       # larger list
        ([0, 0, 0],),              # edge case
        # (list(range(100000)),),    # stress test
    ]

    result = validate_equivalence(original_sum, optimized_sum, test_inputs)
    print("\nValidation Result:", "✅ PASSED" if result else "❌ FAILED")
