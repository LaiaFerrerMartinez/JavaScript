package pojo;

public class Magdalena {

    private String color;
    private String sabor;


    public Magdalena(String sabor, String color) {
        this.sabor = sabor;
        this.color = color;
    }

    public String addSabor() {
        return sabor;
    }

    public String addColor() {
        return color;
    }

    public String getColor() {
        return color;
    }

    public String getSabor() {
        return sabor;
    }
}