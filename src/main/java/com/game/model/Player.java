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

    inventory.put("FOOD", 25);
inventory.put("WOOD", 40);
inventory.put("ORE", 15);
inventory.put("GOLD", 120);

// 🌾 FARMER
inventory.put("WHEAT_SEEDS", 12);
inventory.put("CORN_SEEDS", 7);
inventory.put("POTATO_SEEDS", 5);

// 🌲 WOODCUTTER
inventory.put("OAK_SAPLING", 8);
inventory.put("PINE_SAPLING", 4);

// ⛏ MINER
inventory.put("COPPER_ORE", 13);
inventory.put("IRON_ORE", 6);
inventory.put("GOLD_ORE_BOX", 2);

        
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
