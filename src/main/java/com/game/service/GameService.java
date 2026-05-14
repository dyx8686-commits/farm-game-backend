package com.game.service;

import com.game.model.Player;
import com.game.model.Field;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GameService {

    private final List<Player> players = new ArrayList<>();

    // 🧑 создать игрока
    public Player createPlayer(String name, String type) {
        Player player = new Player(name, type);

player.getInventory().put("GOLD", 1000);
        players.add(player);
        return player;
    }

    // 📋 все игроки
    public List<Player> getPlayers() {
        return players;
    }

    // 🔍 игрок
    public Player getPlayer(String name) {
        for (Player player : players) {
            if (player.getName().equals(name)) {
                return player;
            }
        }
        return null;
    }

    // ⏱ тик игры
    public void tick() {

    long now = System.currentTimeMillis();

    for (Player player : players) {

        if (player.getFields() != null) {

            for (Field field : player.getFields()) {

                if (field.isPlanted() && !field.isReady()) {

                    if (now - field.getPlantTime() >= field.getGrowTime()) {
                        field.setReady(true);
                    }
                }
            }
        }

        // 💰 ДОХОД ПО ТИПУ ИГРОКА (ВНУТРИ ЦИКЛА!)
        Map<String, Integer> inv = player.getInventory();

        inv.put("FOOD", inv.getOrDefault("FOOD", 0)
                + (player.getType().equals("FARMER") ? 10 : 0));

        inv.put("WOOD", inv.getOrDefault("WOOD", 0)
                + (player.getType().equals("WOODCUTTER") ? 8 : 0));

        inv.put("ORE", inv.getOrDefault("ORE", 0)
                + (player.getType().equals("MINER") ? 5 : 0));
    }
}
    // 🌱 посадка
  public Player plant(String name, String item) {

    Player player = getPlayer(name);
    if (player == null) return null;

    Map<String, Integer> inv = player.getInventory();

    if (inv.getOrDefault(item, 0) <= 0) return player;

    inv.put(item, inv.get(item) - 1);

    Field field = new Field();
    field.setPlanted(true);
    field.setReady(false);
    field.setPlantTime(System.currentTimeMillis());
    field.setGrowTime(10000);

    player.getFields().add(field);

    return player;
}
    // 🌾 сбор
    public Player harvest(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        if (player.getFields() == null) return player;

        for (Field field : player.getFields()) {

            if (field.isReady()) {

                inv.put("FOOD", inv.getOrDefault("FOOD", 0) + 5);
                field.setReady(false);
            }
        }

        return player;
    }

    // 🛒 покупка семян
    public Player buySeeds(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int cost = amount * 5;
        int food = inv.getOrDefault("FOOD", 0);

        if (food < cost) return player;

        inv.put("FOOD", food - cost);
        inv.put("SEEDS", inv.getOrDefault("SEEDS", 0) + amount);

        return player;
    }

    // 🌲 дерево
    public Player chopWood(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        inv.put("WOOD", inv.getOrDefault("WOOD", 0) + 5);

        return player;
    }

    // ⛏ руда
    public Player mineOre(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        inv.put("ORE", inv.getOrDefault("ORE", 0) + 3);

        return player;
    }

    // 💰 sell wood
    public Player sellWood(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int wood = inv.getOrDefault("WOOD", 0);
        if (wood < amount) return player;

        inv.put("WOOD", wood - amount);
        inv.put("GOLD", inv.getOrDefault("GOLD", 0) + amount * 2);

        return player;
    }

    // 💰 sell ore
    public Player sellOre(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int ore = inv.getOrDefault("ORE", 0);
        if (ore < amount) return player;

        inv.put("ORE", ore - amount);
        inv.put("GOLD", inv.getOrDefault("GOLD", 0) + amount * 5);

        return player;
    }

    // 💰 sell food
    public Player sellFood(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int food = inv.getOrDefault("FOOD", 0);
        if (food < amount) return player;

        inv.put("FOOD", food - amount);
        inv.put("GOLD", inv.getOrDefault("GOLD", 0) + amount);

        return player;
    }

    // 🌲 buy sapling
    public Player buySapling(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int cost = amount * 6;
        int wood = inv.getOrDefault("WOOD", 0);

        if (wood < cost) return player;

        inv.put("WOOD", wood - cost);
        inv.put("SAPLING", inv.getOrDefault("SAPLING", 0) + amount);

        return player;
    }

    // ⛏ buy ore box
    public Player buyOreBox(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        Map<String, Integer> inv = player.getInventory();

        int cost = amount * 10;
        int gold = inv.getOrDefault("GOLD", 0);

        if (gold < cost) return player;

        inv.put("GOLD", gold - cost);
        inv.put("ORE_BOX", inv.getOrDefault("ORE_BOX", 0) + amount);

        return player;
    }
    // ⛏ покупка руды (в сундуке / магазине)
public Player buyOre(String name, int amount) {

    Player player = getPlayer(name);
    if (player == null) return null;

    Map<String, Integer> inv = player.getInventory();

    int cost = amount * 10;
    int gold = inv.getOrDefault("GOLD", 0);

    if (gold < cost) return player;

    inv.put("GOLD", gold - cost);
    inv.put("ORE", inv.getOrDefault("ORE", 0) + amount * 5);

    return player;
}
    public Player buyItem(String name, String item, int amount) {

    Player player = getPlayer(name);
    if (player == null) return null;

    Map<String, Integer> inv = player.getInventory();

    switch (item) {

        // 🌾 FARMER SEEDS
        case "WHEAT_SEEDS" -> {
            int cost = amount * 5;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("WHEAT_SEEDS", inv.getOrDefault("WHEAT_SEEDS", 0) + amount);
        }

        case "CORN_SEEDS" -> {
            int cost = amount * 7;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("CORN_SEEDS", inv.getOrDefault("CORN_SEEDS", 0) + amount);
        }

        case "POTATO_SEEDS" -> {
            int cost = amount * 6;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("POTATO_SEEDS", inv.getOrDefault("POTATO_SEEDS", 0) + amount);
        }

        // 🌲 WOODCUTTER SAPLINGS
        case "OAK_SAPLING" -> {
            int cost = amount * 4;
            if (inv.getOrDefault("WOOD", 0) < cost) return player;

            inv.put("WOOD", inv.get("WOOD") - cost);
            inv.put("OAK_SAPLING", inv.getOrDefault("OAK_SAPLING", 0) + amount);
        }

        case "PINE_SAPLING" -> {
            int cost = amount * 6;
            if (inv.getOrDefault("WOOD", 0) < cost) return player;

            inv.put("WOOD", inv.get("WOOD") - cost);
            inv.put("PINE_SAPLING", inv.getOrDefault("PINE_SAPLING", 0) + amount);
        }

        // ⛏ MINER RESOURCES
        case "COPPER_ORE" -> {
            int cost = amount * 3;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("COPPER_ORE", inv.getOrDefault("COPPER_ORE", 0) + amount);
        }

        case "IRON_ORE" -> {
            int cost = amount * 6;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("IRON_ORE", inv.getOrDefault("IRON_ORE", 0) + amount);
        }

        case "GOLD_ORE_BOX" -> {
            int cost = amount * 10;
            if (inv.getOrDefault("GOLD", 0) < cost) return player;

            inv.put("GOLD", inv.get("GOLD") - cost);
            inv.put("GOLD_ORE", inv.getOrDefault("GOLD_ORE", 0) + amount);
        }
    }

    return player;
}
}
