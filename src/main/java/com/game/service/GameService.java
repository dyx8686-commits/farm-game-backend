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

    // 📋 получить всех игроков
    public List<Player> getPlayers() {
        return players;
    }

    // ⏱ tick (ресурсы + рост растений)
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

            // 💰 ресурсы
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

    // 🌱 посадка
    public Player plant(String name) {

        Player player = getPlayer(name);

        if (player == null || player.getSeeds() <= 0) {
            return player;
        }

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

        if (player == null || player.getFields() == null) return player;

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
    public Player buySeeds(String name, int amount) {

    Player player = getPlayer(name);

    if (player == null) return null;

    int cost = amount * 5; // 1 seed = 5 FOOD

    int food = player.getResources().get("FOOD");

    if (food < cost) {
        return player; // не хватает еды
    }

    // списываем FOOD
    player.getResources().put("FOOD", food - cost);

    // добавляем seeds
    player.setSeeds(player.getSeeds() + amount);

    return player;
}
}
