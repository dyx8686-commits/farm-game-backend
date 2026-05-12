package com.game.model;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

public class Player {

    private String name;
    private String type;

    private Map<String, Integer> resources = new HashMap<>();

    private int gold = 0;

    private int seeds = 5;
    private List<Field> fields = new ArrayList<>();

    public Player(String name, String type) {

        this.name = name;
        this.type = type;
        this.gold = 0;

        resources.put("FOOD", 0);
        resources.put("WOOD", 0);
        resources.put("ORE", 0);
        resources.put("GOLD", 0);
    }

    // ===== BASIC INFO =====

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    // ===== RESOURCES =====

    public Map<String, Integer> getResources() {
        return resources;
    }

    // ===== FARM SYSTEM =====

    public int getSeeds() {
        return seeds;
    }

    public void setSeeds(int seeds) {
        this.seeds = seeds;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }
    public int getGold() {
    return gold;
}

public void setGold(int gold) {
    this.gold = gold;
}
}
