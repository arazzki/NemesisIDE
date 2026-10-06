# Selamat datang di Nemesis IDE!

def sapa(nama):
    return f"Halo {nama}, selamat datang di Nemesis IDE!"

def hitung_fibonacci(n):
    deret = [0, 1]
    for i in range(2, n):
        deret.append(deret[-1] + deret[-2])
    return deret

if __name__ == "__main__":
    print(sapa("Developer"))
    print("\nDeret Fibonacci 10 angka pertama:")
    print(hitung_fibonacci(10))
