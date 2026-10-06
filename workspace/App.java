// Java 21 Demo di Nemesis IDE
public class App {
    public static void main(String[] args) {
        System.out.println("☕ Halo dari Java di Nemesis IDE!");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
            System.out.println("Step " + i + ": sum = " + sum);
        }
        
        System.out.println("Total penjumlahan 1 s/d 5: " + sum);
    }
}
