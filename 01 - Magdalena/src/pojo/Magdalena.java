package pojo;

public class Magdalena {
    // ATRIBUTOS
        String sabor;
        String color;
        String ingredientes;
        String relleno;
    // CONSTRUCTOR
        /*
            public Magdalena () {
                // CONTRASEÑA VACÍA
            }
        */
        public Magdalena(String sabor, String color, String ingredientes, String relleno) {
            System.out.println("Sabor" + sabor);
            System.out.println("Color" + color);
            System.out.println("Ingredientes" + ingredientes);
            System.out.println("Relleno" + relleno);
            this.sabor = sabor;
            this.color = color;
            this.ingredientes = ingredientes;
            this.relleno = relleno;
        }
    // MÉTODO
        public void hornear () {
            System.out.println("Hornear la mag de " + this.sabor);
            System.out.println("Estoy horneando!!");
        }

        public void mezclar () {
            System.out.println("Mezclar ingredientes: " + this.ingredientes + "; y relleno: " + this.relleno);
            System.out.println("Estoy mezclando!!");
        }
}
