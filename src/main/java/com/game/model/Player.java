package com.game.model;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

public class Player {

    private String name;
    private String type;
    private String island;

    // 🎒 ЕДИНЫЙ ИНВЕНТАРЬ
    private Map<String, Integer> inventory = new HashMap<>();

    private List<Field> fields = new ArrayList<>();
    public String getIsland() {
    return island;
}

public void setIsland(String island) {
    this.island = island;
}

    public Player(String name, String type) {

    this.name = name;
    this.type = type;

    inventory.put("GOLD", 120);

    // 🌴 FARMER
    if(type.equals("FARMER")) {

        inventory.put("FOOD", 50);
        inventory.put("WOOD", 10);
        inventory.put("ORE", 5);

        inventory.put("WHEAT_SEEDS", 12);
        inventory.put("CORN_SEEDS", 7);
        inventory.put("POTATO_SEEDS", 5);
    }

    // 🌲 WOODCUTTER
    if(type.equals("WOODCUTTER")) {

        inventory.put("FOOD", 15);
        inventory.put("WOOD", 60);
        inventory.put("ORE", 5);

        inventory.put("OAK_SAPLING", 8);
        inventory.put("PINE_SAPLING", 4);
    }

    // ⛏ MINER
    if(type.equals("MINER")) {

        inventory.put("FOOD", 10);
        inventory.put("WOOD", 15);
        inventory.put("ORE", 40);

        inventory.put("COPPER_ORE", 13);
        inventory.put("IRON_ORE", 6);
        inventory.put("GOLD_ORE_BOX", 2);
    }
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
