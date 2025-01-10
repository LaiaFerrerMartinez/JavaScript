import pojo.Magdalena;

public class MagdalenaFactory {
    int contador = 0;
    private Magdalena[] lstMagdalena = new Magdalena[4];


    public void addMagdalena (Magdalena miMagdalena) {
        lstMagdalena[contador] = miMagdalena;
        contador++;
    }

    public void printMagdalena () {
        Magdalena magdalena;
        for (int i = 0; i < lstMagdalena.length; i++) {
            magdalena = lstMagdalena[i];
            System.out.print("Magdalena " + (i + 1) + ": ");
            System.out.print("Atributos: Sabor - " + magdalena.getSabor());
            System.out.println(", Color - " + magdalena.getColor());
        }
    }
}
