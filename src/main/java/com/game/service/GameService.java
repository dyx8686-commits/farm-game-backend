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

            // 🌱 рост растений
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

            // 💰 пассивные ресурсы
            switch (player.getType()) {

                case "FARMER":
                    player.getResources().put(
                            "FOOD",
                            player.getResources().get("FOOD") + 10
                    );
                    break;

                case "WOODCUTTER":
                    player.getResources().put(
                            "WOOD",
                            player.getResources().get("WOOD") + 8
                    );
                    break;

                case "MINER":
                    player.getResources().put(
                            "ORE",
                            player.getResources().get("ORE") + 5
                    );
                    break;
            }
        }
    }

    // 🌱 посадка семян
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

    // 🌾 сбор урожая
    public Player harvest(String name) {

        Player player = getPlayer(name);

        if (player == null || player.getFields() == null) return null;

        for (Field field : player.getFields()) {

            if (field.isReady()) {

                player.getResources().put(
                        "FOOD",
                        player.getResources().get("FOOD") + 5
                );

                field.setReady(false);
            }
        }

        return player;
    }

    // 🔍 найти игрока
    public Player getPlayer(String name) {

        for (Player player : players) {
            if (player.getName().equals(name)) {
                return player;
            }
        }

        return null;
    }

    // 💰 магазин семян
    public Player buySeeds(String name, int amount) {

        Player player = getPlayer(name);

        if (player == null) return null;

        int cost = amount * 5;

        int food = player.getResources().get("FOOD");

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
            player.getResources().get("WOOD") + 5
    );

    return player;
}

// ⛏ добыча руды
public Player mineOre(String name) {

    Player player = getPlayer(name);

    if (player == null) return null;

    player.getResources().put(
            "ORE",
            player.getResources().get("ORE") + 3
    );

    return player;
}

// 💰 продажа дерева
public Player sellWood(String name, int amount) {

    Player player = getPlayer(name);

    if (player == null) return null;

    int wood = player.getResources().get("WOOD");

    if (wood < amount) return player;

    player.getResources().put("WOOD", wood - amount);

    player.getResources().put(
            "FOOD",
            player.getResources().get("FOOD") + amount * 2
    );

    return player;
}

// 💰 продажа руды
public Player sellOre(String name, int amount) {

    Player player = getPlayer(name);

    if (player == null) return null;

    int ore = player.getResources().get("ORE");

    if (ore < amount) return player;

    player.getResources().put("ORE", ore - amount);

    player.getResources().put(
            "FOOD",
            player.getResources().get("FOOD") + amount * 3
    );

    return player;
}
}
