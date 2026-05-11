package com.game.model;

import java.util.HashMap;
import java.util.Map;

public class Player {

    private String name;
    private String type;

    private Map<String, Integer> resources = new HashMap<>();

    public Player(String name, String type) {

        this.name = name;
        this.type = type;

        resources.put("FOOD", 0);
        resources.put("WOOD", 0);
        resources.put("ORE", 0);
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Map<String, Integer> getResources() {
        return resources;
    }
}
