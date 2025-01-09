import pojo.Magdalena;

public class Main {
    public static void main(String[] args) {

        Magdalena magdalena1 = new Magdalena("Chocolate", "Marrón");
        Magdalena magdalena2 = new Magdalena("Vainilla", "Blanca");
        Magdalena magdalena3 = new Magdalena("Fresa", "Rosa");
        Magdalena magdalena4 = new Magdalena("Limón", "Amarilla");

        MagdalenaFactory magdalenaFactory = new MagdalenaFactory();
            magdalenaFactory.addMagdalena(magdalena1);
            magdalenaFactory.addMagdalena(magdalena2);
            magdalenaFactory.addMagdalena(magdalena3);
            magdalenaFactory.addMagdalena(magdalena4);
            magdalenaFactory.printMagdalena();
    }
}