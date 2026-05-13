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

    inventory.put("FOOD", 0);
    inventory.put("WOOD", 0);
    inventory.put("ORE", 0);
    inventory.put("GOLD", 0);
    inventory.put("SEEDS", 5);

    // 🌾 FARMER SEEDS
    inventory.put("WHEAT_SEEDS", 0);
    inventory.put("CORN_SEEDS", 0);
    inventory.put("POTATO_SEEDS", 0);

    // 🌲 WOODCUTTER
    inventory.put("OAK_SAPLING", 0);
    inventory.put("PINE_SAPLING", 0);

    // ⛏ MINER
    inventory.put("COPPER_ORE", 0);
    inventory.put("IRON_ORE", 0);
    inventory.put("GOLD_ORE_BOX", 0);
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
