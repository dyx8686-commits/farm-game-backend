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

            // 🌱 рост полей
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

            // 💰 авто ресурсы
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

    // 🛒 магазин семян
    public Player buySeeds(String name, int amount) {

        Player player = getPlayer(name);

        if (player == null) return null;

        int cost = amount * 5;

        int food = player.getResources().get("FOOD");

        if (food < cost) {
            return player;
        }

        player.getResources().put("FOOD", food - cost);
        player.setSeeds(player.getSeeds() + amount);

        return player;
    }
}
