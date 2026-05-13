package com.game.model;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

public class Player {

    private String name;
    private String type;

    // 🎒 ЕДИНЫЙ ИНВЕНТАРЬ
    private Map<String, Integer> inventory = new HashMap<>();

    private List<Field> fields = new ArrayList<>();

    public Player(String name, String type) {

        this.name = name;
        this.type = type;

        // стартовые ресурсы
        inventory.put("FOOD", 0);
        inventory.put("WOOD", 0);
        inventory.put("ORE", 0);
        inventory.put("GOLD", 0);
        inventory.put("SEEDS", 5);   // стартовые семена
        inventory.put("SAPLING", 0); // для лесника
        inventory.put("ORE_BOX", 0);  // для шахтера
    }

    // ===== BASIC INFO =====

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    // ===== INVENTORY =====

    public Map<String, Integer> getInventory() {
        return inventory;
    }

    public void setInventory(Map<String, Integer> inventory) {
        this.inventory = inventory;
    }

    // ===== FARM SYSTEM =====

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }
}
