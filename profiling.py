import timeit
import cProfile
import pstats
import io


def profile_function(func, *args, number=1000, **kwargs):
    """
    Profiles a Python function using timeit and cProfile.

    Parameters:
        func (callable): Function to profile.
        *args: Positional arguments to pass to the function.
        number (int): Number of executions for timeit.
        **kwargs: Keyword arguments to pass to the function.
    """

    # ---- Timeit Profiling ----
    timer = timeit.Timer(lambda: func(*args, **kwargs))
    exec_time = timer.timeit(number=number) / number
    print(f"\n[Timeit] Average execution time over {number} runs: {exec_time:.8f} seconds")

    # ---- cProfile Profiling ----
    print("\n[cProfile] Detailed function call analysis:")
    pr = cProfile.Profile()
    pr.enable()
    func(*args, **kwargs)  # Run the function once
    pr.disable()

    s = io.StringIO()
    ps = pstats.Stats(pr, stream=s).sort_stats("cumulative")
    ps.print_stats(10)  # Show top 10 function calls
    print(s.getvalue())


# ---- Example Functions to Test ----
def inefficient_sum(n):
    total = 0
    for i in range(n):
        total += i
    return total


def efficient_sum(n):
    return sum(range(n))


if __name__ == "__main__":
    # Profile inefficient function
    profile_function(inefficient_sum, 10000, number=100)

    # Profile efficient function
    profile_function(efficient_sum, 10000, number=100)
