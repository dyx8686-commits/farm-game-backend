package com.game.service;

import com.game.model.Player;
import com.game.model.Field;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    private final List<Player> players = new ArrayList<>();

    // 🧑 создать игрока
    public Player createPlayer(String name, String type) {

        Player player = new Player(name, type);

        players.add(player);

        return player;
    }

    // 📋 все игроки
    public List<Player> getPlayers() {
        return players;
    }

    // ⏱ тик игры
    public void tick() {

        for (Player player : players) {

            if (player.getFields() != null) {

                for (Field field : player.getFields()) {

                    if (field.isPlanted()) {

                        long now = System.currentTimeMillis();

                        if (now - field.getPlantTime() >= field.getGrowTime()) {
                            field.setPlanted(false);
                            field.setReady(true);
                        }
                    }
                }
            }

            player.getResources().put(
                    "FOOD",
                    player.getResources().getOrDefault("FOOD", 0)
                            + (player.getType().equals("FARMER") ? 10 : 0)
            );

            player.getResources().put(
                    "WOOD",
                    player.getResources().getOrDefault("WOOD", 0)
                            + (player.getType().equals("WOODCUTTER") ? 8 : 0)
            );

            player.getResources().put(
                    "ORE",
                    player.getResources().getOrDefault("ORE", 0)
                            + (player.getType().equals("MINER") ? 5 : 0)
            );
        }
    }

    // 🌱 посадка
    public Player plant(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        if (player.getSeeds() <= 0) return player;

        Field field = new Field();
        field.setPlanted(true);
        field.setReady(false);
        field.setPlantTime(System.currentTimeMillis());
        field.setGrowTime(10000);

        player.getFields().add(field);
        player.setSeeds(player.getSeeds() - 1);

        return player;
    }

    // 🌾 сбор
    public Player harvest(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        if (player.getFields() == null) return player;

        for (Field field : player.getFields()) {

            if (field.isReady()) {

                player.getResources().put(
                        "FOOD",
                        player.getResources().getOrDefault("FOOD", 0) + 5
                );

                field.setReady(false);
            }
        }

        return player;
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

    // 🛒 семена
    public Player buySeeds(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        int cost = amount * 5;
        int food = player.getResources().getOrDefault("FOOD", 0);

        if (food < cost) return player;

        player.getResources().put("FOOD", food - cost);
        player.setSeeds(player.getSeeds() + amount);

        return player;
    }

    // 🌲 рубка дерева
    public Player chopWood(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        player.getResources().put(
                "WOOD",
                player.getResources().getOrDefault("WOOD", 0) + 5
        );

        return player;
    }

    // ⛏ добыча руды
    public Player mineOre(String name) {

        Player player = getPlayer(name);
        if (player == null) return null;

        player.getResources().put(
                "ORE",
                player.getResources().getOrDefault("ORE", 0) + 3
        );

        return player;
    }

    // 💰 дерево → GOLD
    public Player sellWood(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        int wood = player.getResources().getOrDefault("WOOD", 0);
        if (wood < amount) return player;

        player.getResources().put("WOOD", wood - amount);

        player.getResources().put(
                "GOLD",
                player.getResources().getOrDefault("GOLD", 0) + amount * 2
        );

        return player;
    }

    // 💰 руда → GOLD
    public Player sellOre(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        int ore = player.getResources().getOrDefault("ORE", 0);
        if (ore < amount) return player;

        player.getResources().put("ORE", ore - amount);

        player.getResources().put(
                "GOLD",
                player.getResources().getOrDefault("GOLD", 0) + amount * 5
        );

        return player;
    }

    // 💰 еда → GOLD
    public Player sellFood(String name, int amount) {

        Player player = getPlayer(name);
        if (player == null) return null;

        int food = player.getResources().getOrDefault("FOOD", 0);
        if (food < amount) return player;

        player.getResources().put("FOOD", food - amount);

        player.getResources().put(
                "GOLD",
                player.getResources().getOrDefault("GOLD", 0) + amount
        );

        return player;
    }
    public Player buySapling(String name, int amount) {

    Player player = getPlayer(name);
    if (player == null) return null;

    int cost = amount * 6;

    int wood = player.getResources().getOrDefault("WOOD", 0);

    if (wood < cost) return player;

    player.getResources().put("WOOD", wood - cost);

    player.setSeeds(player.getSeeds() + amount); // временно используем seeds как универсальный инвентарь

    return player;
}
    public Player buyOre(String name, int amount) {

    Player player = getPlayer(name);
    if (player == null) return null;

    int cost = amount * 10;

    int gold = player.getResources().getOrDefault("GOLD", 0);

    if (gold < cost) return player;

    player.getResources().put("GOLD", gold - cost);

    player.getResources().put(
            "ORE",
            player.getResources().getOrDefault("ORE", 0) + amount * 5
    );

    return player;
}
}
